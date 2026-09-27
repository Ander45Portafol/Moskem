<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReadJwtFromCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si no viene la cabecera Authorization pero sí existe la cookie token_jwt
        if (!$request->hasHeader('Authorization') && $request->hasCookie('token_jwt')) {
            $token = $request->cookie('token_jwt');

            // Inyectamos el Bearer Token en la cabecera para que la guardia auth:api (JWT) lo pueda procesar
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
