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
        // Si la cookie token_jwt existe y no se envió cabecera Authorization
        if ($request->hasCookie('token_jwt') && !$request->headers->has('Authorization')) {
            $token = $request->cookie('token_jwt');
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);    }
}
