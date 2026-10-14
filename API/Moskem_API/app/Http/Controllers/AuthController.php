<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use App\Notifications\SendResetCodeNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validamos que recibimos el código de empleado en el campo 'usuario'
        $credentials = $request->validate([
            'usuario' => ['required', 'string'], // Código de empleado (ej: AA000001)
            'clave'   => ['required', 'string'], // Contraseña enviada desde el frontend
        ]);

        // 2. Buscamos al usuario por la columna 'usuario' de la BD
        $usuario = Usuario::where('usuario', $credentials['usuario'])->first();

        if (!$usuario) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        // 3. Verificamos si la cuenta está inactiva o bloqueada
        if (!$usuario->estado_usuario) {
            return response()->json([
                'error' => 'La cuenta se encuentra desactivada o bloqueada por intentos fallidos'
            ], 403);
        }

        // 4. Mapeamos credenciales para Auth::guard('api')->attempt()
        // 'usuario' consulta la columna en BD y 'password' se valida con Hash::check gracias a getAuthPassword() en el modelo
        $authCredentials = [
            'usuario'  => $credentials['usuario'],
            'password' => $credentials['clave'],
        ];

        if (!$token = Auth::guard('api')->attempt($authCredentials)) {
            // Descontar intento fallido
            $usuario->decrement('cantidad_intentos');
            $usuario->refresh();

            if ($usuario->cantidad_intentos <= 0) {
                $usuario->update([
                    'estado_usuario'    => false,
                    'cantidad_intentos' => 0,
                ]);

                return response()->json([
                    'error' => 'Ha superado el límite de 5 intentos fallidos. Su cuenta ha sido bloqueada.'
                ], 423);
            }

            return response()->json([
                'error' => "Credenciales inválidas."
            ], 401);
        }

        // 5. Login exitoso: restablecemos intentos y cargamos la relación 'empleado'
        $usuario->update([
            'cantidad_intentos' => 5,
            'estado_usuario'    => true,
        ]);

        $usuario->load('empleado');

        return $this->respondWithToken($token, $usuario);
    }

    public function me()
    {
        $usuario = Auth::guard('api')->user();

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $usuario->load('empleado');

        return response()->json($usuario);
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        $cookie = cookie()->forget('token_jwt');

        return response()->json(['message' => 'Sesión cerrada correctamente'])->withCookie($cookie);
    }

    public function refresh()
    {
        $usuario = Auth::guard('api')->user();

        if ($usuario) {
            $usuario->load('empleado');
        }

        $newToken = Auth::guard('api')->refresh();

        return $this->respondWithToken($newToken, $usuario);
    }

    protected function respondWithToken($token, $usuario)
    {
        $minutes = Auth::guard('api')->factory()->getTTL();

        // Cookie HttpOnly optimizada para el entorno local/producción
        $cookie = cookie(
            'token_jwt',                        // Nombre
            $token,                             // Valor (JWT)
            $minutes,                           // Expiración en minutos
            '/',                                // Path
            null,                               // Domain
            config('app.env') === 'production', // Secure (solo exige HTTPS en producción)
            true,                               // HttpOnly (Protegido contra JS)
            false,                              // Raw
            'Lax'                               // SameSite
        );

        return response()->json([
            'user' => $usuario,
        ])->withCookie($cookie);
    }

    public function sendResetCode(Request $request)
    {
        // 1. Validar la entrada del formulario
        $request->validate([
            'usuario'         => 'required|string',
            'correo_empleado' => 'required|email',
        ]);

        // Limpiar espacios y normalizar a minúsculas
        $usuarioInput = strtolower(trim($request->usuario));
        $correoInput  = strtolower(trim($request->correo_empleado));

        // 2. Buscar al usuario ignorando mayúsculas/minúsculas en ambas tablas
        $usuario = Usuario::whereRaw('LOWER(usuario) = ?', [$usuarioInput])
            ->whereHas('empleado', function ($query) use ($correoInput) {
                $query->whereRaw('LOWER(correo_empleado) = ?', [$correoInput]);
            })
            ->first();

        // 3. Si las credenciales no coinciden entre ambas tablas
        if (!$usuario) {
            return response()->json([
                'message' => 'El nombre de usuario o el correo electrónico son incorrectos.'
            ], 422);
        }

        // 4. Generar código aleatorio de 6 dígitos
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // 5. Guardar en Cache por 15 minutos con la clave normalizada
        Cache::put('reset_code_' . $usuarioInput, (string)$code, now()->addMinutes(15));

        // 6. Enviar notificación al empleado
        $usuario->empleado->notify(new SendResetCodeNotification($code));

        return response()->json([
            'message' => 'Se ha enviado un código de verificación a tu correo electrónico.'
        ], 200);
    }
    // 2. Verificar el código de 6 dígitos ingresado por el usuario
    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string',
            'codigo'  => 'required|string|digits:6'
        ]);

        // Generar la misma clave estandarizada
        $usuarioInput = strtolower(trim($request->usuario));
        $cacheKey = 'reset_code_' . $usuarioInput;

        $cachedCode = Cache::get($cacheKey);

        // Verificar expiración o existencia
        if (!$cachedCode) {
            return response()->json([
                'message' => 'El código de verificación ha expirado o es inválido.'
            ], 422);
        }

        // Comparar asegurando conversión a string
        if ((string)$cachedCode !== (string)$request->codigo) {
            return response()->json([
                'message' => 'El código ingresado es incorrecto.'
            ], 422);
        }

        // Eliminar código usado
        Cache::forget($cacheKey);

        // Autorizar cambio de clave por 10 min
        Cache::put('reset_authorized_' . $usuarioInput, true, now()->addMinutes(10));

        return response()->json([
            'message' => 'Código verificado correctamente. Ya puedes ingresar tu nueva contraseña.'
        ], 200);
    }
    // 3. Actualizar la contraseña por la nueva
    public function resetPassword(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string',
            'codigo'  => 'required|string',
            'clave'   => [
                'required',
                'string',
                Password::min(8)      // Longitud mínima recomendada (12+ caracteres)
                    ->mixedCase()      // Opcional: Requiere mayúsculas y minúsculas
                    ->numbers()        // Opcional: Requiere números
                    ->symbols()        // Opcional: Requiere caracteres especiales
                    ->uncompromised() // Verifica que la clave no haya aparecido en filtraciones de datos
            ],
        ]);

        $usuarioInput = strtolower(trim($request->usuario));

        // 2. Validar que el usuario tenga la autorización en Cache
        $isAuthorized = Cache::get('reset_authorized_' . $usuarioInput);

        if (!$isAuthorized) {
            return response()->json([
                'message' => 'No estás autorizado para realizar este cambio o la sesión ha expirado. Inicia el proceso nuevamente.'
            ], 403);
        }

        // 3. Buscar al usuario en la base de datos (insensible a mayúsculas/minúsculas)
        $usuario = Usuario::whereRaw('LOWER(usuario) = ?', [$usuarioInput])->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado.'
            ], 404); // Se recomienda status 404 para no encontrado en lugar de 444
        }

        // 4. Actualizar contraseña encriptada 
        // Nota: Reemplaza 'clave' por el nombre exacto de la columna en tu BD (ej. $usuario->clave o $usuario->password)
        $usuario->clave = Hash::make($request->clave);
        $usuario->save();

        // 5. Consumir el permiso temporal en Cache para que no se pueda reutilizar
        Cache::forget('reset_authorized_' . $usuarioInput);

        return response()->json([
            'message' => 'Contraseña actualizada con éxito.'
        ], 200);
    }
}
