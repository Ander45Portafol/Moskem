<?php
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DetalleMerceriaController;
use App\Http\Controllers\DetallePaqueteController;
use App\Http\Controllers\DetallePedidoController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\MedidaController;
use App\Http\Controllers\MerseriaController;
use App\Http\Controllers\OrdenTrabajoController;
use App\Http\Controllers\PaqueteController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProveedoresController;
use App\Http\Controllers\PrendaController;
use App\Http\Controllers\TelaController;
use App\Models\DetalleMerceria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//Metodo para el motor de busqueda
Route::get('clientes/buscar', [ClienteController::class, 'search']);
Route::get('empleados/buscar',[EmpleadoController::class,'search']);
Route::get('detalles/{id_pedido}', [DetallePedidoController::class, 'getByPedido']);
Route::apiResource('clientes', ClienteController::class);
Route::apiResource('pedidos',PedidosController::class);

Route::apiResource('mercerias',MerseriaController::class);

Route::apiResource('empleados',EmpleadoController::class);
Route::apiResource('detalle_pedidos',DetallePedidoController::class);
Route::apiResource('telas',TelaController::class);
Route::apiResource('proveedores',ProveedoresController::class);
route:: apiResource('paquetes',PaqueteController::class);
Route::apiResource('detalle_paquetes',DetallePaqueteController::class);
Route::apiResource('prendas',PrendaController::class);
Route::get('getPaquete/{id_pedido}', [DetallePaqueteController::class, 'getPaquetePedido']);
Route::apiResource('detalle_mercerias',DetalleMerceriaController::class);
Route::get('lista_merceria/{id}',[DetalleMerceriaController::class, 'getDetallePedidoMerceria']);
Route::get('sastres',[EmpleadoController::class, 'getSastres']);
Route::get('medidas_prendas/{id_pedido}',[OrdenTrabajoController::class,'cargarMedidas']);
Route::apiResource('medidas',MedidaController::class);
Route::apiResource('orden_trabajo',OrdenTrabajoController::class);
Route::get('create_codigo_medida/{id}/{id_medida}',[MedidaController::class, 'createCodigo']);