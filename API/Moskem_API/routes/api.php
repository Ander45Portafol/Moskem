<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DetalleMerceriaController;
use App\Http\Controllers\DetallePaqueteController;
use App\Http\Controllers\DetallePedidoController;
use App\Http\Controllers\DetalleRentaController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\MedidaController;
use App\Http\Controllers\MerseriaController;
use App\Http\Controllers\OrdenTrabajoController;
use App\Http\Controllers\PaqueteController;
use App\Http\Controllers\PedidosController;
use App\Http\Controllers\ProveedoresController;
use App\Http\Controllers\PrendaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\RentaController;
use App\Http\Controllers\TelaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 1. Ruta Pública para Iniciar Sesión
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('sendResetCode', [AuthController::class, 'sendResetCode']);
Route::post('verifyResetCode', [AuthController::class, 'verifyResetCode']);
Route::post('resetPassword', [AuthController::class, 'resetPassword']);

// 2. TODAS las rutas protegidas del sistema van dentro de este grupo
Route::middleware('auth:api')->group(function () {

    // Rutas de Sesión / Autenticación
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);

    // Métodos para el motor de búsqueda
    Route::get('clientes/buscar', [ClienteController::class, 'search']);
    Route::get('empleados/buscar', [EmpleadoController::class, 'search']);

    // Métodos independientes
    Route::post('renta_detalles', [DetalleRentaController::class, 'store']);
    Route::put('renta_detalles', [DetalleRentaController::class, 'update']);
    Route::put('create_codigo_medida/{id}/{id_medida}', [MedidaController::class, 'createCodigo']);
    Route::get('medidas_renta/{id_renta}', [MedidaController::class, 'buscarMedidasRenta']);
    Route::get('orden_trabajo/detalle/{id_detalle_pedido}', [OrdenTrabajoController::class, 'showByDetalle']);
    Route::get('getOrders/{id_pedido}', [OrdenTrabajoController::class, 'cargarOrdenes']);
    Route::get('getMedidas/{idDetallePedido}', [OrdenTrabajoController::class, 'getMedida']);
    Route::get('lista_merceria/{id}', [DetalleMerceriaController::class, 'getDetallePedidoMerceria']);

    Route::get('medidas_prendas/{id_cliente}/{prenda}', [OrdenTrabajoController::class, 'cargarMedidas']);
    Route::get('getPaquete/{id_pedido}', [DetallePaqueteController::class, 'getPaquetePedido']);
    //En está ruta cargamos todos los detalles de una renta
    Route::get('renta_detalles/{id_renta}', [DetalleRentaController::class, 'cargarDetalleRenta']);
    //En está ruta cargamos todos los detalles de un pedido
    Route::get('detalles/{id_pedido}', [DetallePedidoController::class, 'getByPedido']);

    // Métodos pertenecientes a apiResource
    Route::apiResource('productos', ProductoController::class);
    Route::apiResource('empleados', EmpleadoController::class);
    Route::apiResource('paquetes', PaqueteController::class);
    Route::apiResource('clientes', ClienteController::class);
    Route::apiResource('pedidos', PedidosController::class);
    Route::apiResource('mercerias', MerseriaController::class);
    Route::apiResource('detalle_pedidos', DetallePedidoController::class);
    Route::apiResource('telas', TelaController::class);
    Route::apiResource('proveedores', ProveedoresController::class);
    Route::apiResource('medidas', MedidaController::class);
    Route::apiResource('detalle_paquetes', DetallePaqueteController::class);
    Route::apiResource('prendas', PrendaController::class);
    Route::apiResource('detalle_mercerias', DetalleMerceriaController::class);
    Route::apiResource('orden_trabajo', OrdenTrabajoController::class);
    Route::apiResource('rentas', RentaController::class);
    Route::get('sastres', [EmpleadoController::class, 'getSastres']);
});