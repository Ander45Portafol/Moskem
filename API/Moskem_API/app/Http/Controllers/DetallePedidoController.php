<?php

namespace App\Http\Controllers;

use App\Http\Requests\DetallePedidoRequest;
use App\Http\Resources\DetallePedidoResource;
use App\Http\Responses\ApiResponse;
use App\Models\DetallePedido;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class DetallePedidoController extends Controller
{
    //
    public function index()
    {
        try {
            $detalle_pedido = DetallePedido::all();
            if ($detalle_pedido->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, DetallePedidoResource::collection($detalle_pedido));
            }
        } catch (Throwable $th) {
            return ApiResponse::error('Error al conectar con el servidor', 404, $th->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('No se puedo finalizar el proceso', 500, $e->getMessage());
        }
    }
    public function store(DetallePedidoRequest $request)
    {
        try {
            $validate = $request->validated();
            $detalle_pedido = DetallePedido::create($validate);
            return ApiResponse::success('Detalle creado con exito', 200, new DetallePedidoResource($detalle_pedido));
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }
    public function show($id)
    {
        try {
            $detalle_pedido = DetallePedido::findOrFail($id);
            return ApiResponse::success('Detalle creado con exito', 200, $detalle_pedido);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }
    public function update(DetallePedidoRequest $request,$id){
        try {
            $detalle_pedido=DetallePedido::findOrFail($id);
            $validaciones=$request->validated();
            $detalle_pedido->update($validaciones);
            return ApiResponse::success('Detalle creado con exito', 200, new DetallePedidoResource($detalle_pedido));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontro el detalle', 404, $me->getMessage());
        } catch (ValidationException $ve) {
            return ApiResponse::error('Error en validaciones', 422, $ve->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
}
