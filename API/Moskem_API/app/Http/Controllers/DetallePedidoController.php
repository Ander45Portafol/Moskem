<?php

namespace App\Http\Controllers;

use App\Http\Requests\DetallePedidoRequest;
use App\Http\Resources\DetallePedidoResource;
use App\Http\Responses\ApiResponse;
use App\Models\DetallePedido;
use App\Models\Prenda;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class DetallePedidoController extends Controller
{
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

            // 1. Si es Prenda Única
            if (empty($validate['id_paquete']) || $validate['id_paquete'] === 'null') {
                $validate['id_paquete'] = null;
                $validate['tipo_pedido'] = 'Prenda unica';

                $prendaObj = Prenda::where('prenda_paquete', $validate['prenda'])->first();
                $validate['precio_detalle'] = $prendaObj ? $prendaObj->precio_unitario : 0.00;
            }
            // 2. Si pertenece a un Paquete
            else {
                $validate['tipo_pedido'] = 'Paquete';
                $validate['precio_detalle'] = 0.00;

                // SINCRONIZACIÓN MASA: Asegurar que los miembros del paquete tengan el mismo numero_pedido
                DetallePedido::where('id_pedido', $validate['id_pedido'])
                    ->whereNotNull('id_paquete')
                    ->update(['numero_pedido' => $validate['numero_pedido']]);
            }

            $detalle_pedido = DetallePedido::create($validate);
            return ApiResponse::success('Detalle creado con éxito', 200, new DetallePedidoResource($detalle_pedido));
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }

    public function update(DetallePedidoRequest $request, int $id)
    {
        try {
            $detalle_pedido = DetallePedido::findOrFail($id);
            $validaciones = $request->validated();

            if (empty($validaciones['id_paquete']) || $validaciones['id_paquete'] === 'null') {
                $validaciones['id_paquete'] = null;
                $validaciones['tipo_pedido'] = 'Prenda unica';

                $nombrePrenda = $validaciones['prenda'] ?? $detalle_pedido->prenda;
                $prendaObj = Prenda::where('prenda_paquete', $nombrePrenda)->first();
                if ($prendaObj) {
                    $validaciones['precio_detalle'] = $prendaObj->precio_unitario;
                }
            } else {
                $validaciones['tipo_pedido'] = 'Paquete';
                $validaciones['precio_detalle'] = 0.00;

                // SINCRONIZACIÓN MASA en actualización
                if (isset($validaciones['numero_pedido'])) {
                    DetallePedido::where('id_pedido', $detalle_pedido->id_pedido)
                        ->whereNotNull('id_paquete')
                        ->update(['numero_pedido' => $validaciones['numero_pedido']]);
                }
            }

            $detalle_pedido->update($validaciones);
            return ApiResponse::success('Detalle actualizado con éxito', 200, new DetallePedidoResource($detalle_pedido));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontró el detalle', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
    public function show(int $id)
    {
        try {
            $detalle_pedido = DetallePedido::findOrFail($id);
            return ApiResponse::success('Detalle obtenido con exito', 200, $detalle_pedido);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }

    public function getByPedido(int $id_pedido): JsonResponse
    {
        try {
            $detalles = DetallePedido::where('id_pedido', $id_pedido)->with("telas")->get();

            if ($detalles->isEmpty()) {
                return ApiResponse::success('No se encontraron detalles para este pedido', 200, []);
            }

            return ApiResponse::success('Detalles del pedido obtenidos correctamente', 200, $detalles);
        } catch (Exception $e) {
            return ApiResponse::error('Error al obtener los detalles del pedido', 500, $e->getMessage());
        }
    }
}
