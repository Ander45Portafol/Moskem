<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}