<?php

namespace App\Http\Controllers;

use App\Http\Requests\RentaRequest;
use App\Http\Resources\RentaResource;
use App\Http\Responses\ApiResponse;
use App\Models\DetalleRenta;
use App\Models\Renta;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RentaController extends Controller
{
    public function index()
    {
        try {
            $renta = DetalleRenta::with(['renta.cliente', 'producto'])->whereHas('renta', function ($query) {
                $query->where('visibilidad_renta', true);
            })->get();
            if ($renta->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200,
                    'data' => []
                ], 200);
            }

            return ApiResponse::success('¡Éxito!', 200, RentaResource::collection($renta));
        } catch (Exception $ex) {
            return ApiResponse::error('Error al listar los productos', 500, $ex->getMessage());
        } catch (\Throwable $to) {
            return ApiResponse::error('Error inesperado al listar los productos', 500, $to->getMessage());
        }
    }
    public function store(RentaRequest $request)
    {
        try {
            $validate = $request->validated();
            $validate["visibilidad_renta"] = true;

            $renta = Renta::create($validate);
            return ApiResponse::success('Renta guardada exitosamente', 200, new RentaResource($renta));
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }

    public function update(RentaRequest $request, int $id)
    {
        try {
            $renta = Renta::findOrFail($id);
            $validaciones = $request->validated();

            $renta->update($validaciones);
            return ApiResponse::success('Renta actualizada con éxito', 200, new RentaResource($renta));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontró el detalle', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }

    public function show(int $id)
    {
        try {
            $renta = Renta::findOrFail($id);
            return ApiResponse::success('Renta obtenida con exito', 200, $renta);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }
    public function destroy(int $id)
    {
        try {
            $renta = Renta::findOrFail($id);
            $renta->visibilidad_renta = false;
            $renta->save();
            return ApiResponse::success('Pedido eliminado con exito', 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('El pedido seleccionado no existe', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al eliminar', 500, $ex->getMessage());
        }
    }
}
