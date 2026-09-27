<?php

namespace App\Http/Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'correo_electronico' => ['required', 'email'],
            'clave'              => ['required', 'string'],
        ]);

        $usuario = Usuario::where('correo_electronico', $credentials['correo_electronico'])->first();

        if (!$usuario) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        if (!$usuario->estado_usuario) {
            return response()->json(['error' => 'La cuenta se encuentra desactivada o bloqueada por intentos fallidos'], 403);
        }

        $authCredentials = [
            'correo_electronico' => $credentials['correo_electronico'],
            'password'           => $credentials['clave'],
        ];

        if (!$token = Auth::guard('api')->attempt($authCredentials)) {
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
                'error' => "Credenciales inválidas. Te quedan {$usuario->cantidad_intentos} intento(s)."
            ], 401);
        }

        // Login exitoso
        $usuario->update([
            'cantidad_intentos' => 5,
            'estado_usuario'    => true,
        ]);

        $usuario->load('empleado');

        // Retornar respuesta adjuntando la Cookie HttpOnly
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

        // Eliminar la cookie al cerrar sesión (olvidar la cookie token_jwt)
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
        // Duración de la cookie equivalente al TTL del JWT (en minutos)
        $minutes = Auth::guard('api')->factory()->getTTL();

        // Crear la cookie HttpOnly
        $cookie = cookie(
            'token_jwt', // Nombre de la cookie
            $token,      // Valor (JWT)
            $minutes,    // Minutos
            '/',         // Path
            null,        // Domain
            config('app.env') === 'production', // Secure (HTTPS solo en producción)
            true,        // HttpOnly (Inaccesible desde JS)
            false,       // Raw
            'Lax'        // SameSite
        );

        return response()->json([
            'user' => $usuario,
        ])->withCookie($cookie);
    }
}