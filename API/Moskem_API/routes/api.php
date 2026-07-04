<?php
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\MerseriaController;
use App\Http\Controllers\PedidosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//Metodo para el motor de busqueda
Route::get('clientes/buscar', [ClienteController::class, 'search']);
Route::apiResource('clientes', ClienteController::class);
Route::apiResource('pedidos',PedidosController::class);

Route::apiResource('mercerias',MerseriaController::class);


