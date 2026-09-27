<?php

use App\Http\Middleware\JwtFromCookie;
use App\Http\Middleware\ReadJwtFromCookie;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Evitamos que Laravel encomponente/encripte la cookie token_jwt
        $middleware->encryptCookies(except: [
            'token_jwt',
        ]);

        $middleware->api(prepend: [
            ReadJwtFromCookie::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
