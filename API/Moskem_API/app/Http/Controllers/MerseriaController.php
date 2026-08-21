<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerceriaRequest;
use App\Http\Resources\MerceriaResource;
use App\Http\Responses\ApiResponse;
use App\Models\Merceria;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Throwable;

class MerseriaController extends Controller
{
    /**
     * Obtener todos los registros activos de mercería
     */
    public function index(): JsonResponse
    {
        try {
            $merceria = Merceria::where('visibilidad_merceria', true)
                ->orderBy('id_merceria')
                ->get();

            if ($merceria->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200,
                    'data' => []
                ], 200);
            }

            return ApiResponse::success('¡Éxito!', 200, MerceriaResource::collection($merceria));
        } catch (Exception $ex) {
            return ApiResponse::error('Error al listar las mercerías', 500, $ex->getMessage());
        } catch (Throwable $to) {
            return ApiResponse::error('Error inesperado al listar las mercerías', 500, $to->getMessage());
        }
    }

    /**
     * Crear un nuevo registro de mercería
     */
    public function store(MerceriaRequest $request): JsonResponse
    {
        try {
            $validate = $request->validated();
            $validate['visibilidad_merceria'] = true;

            $merceria = Merceria::create($validate);

            return ApiResponse::success('Mercería creada con éxito', 201, new MerceriaResource($merceria));
        } catch (Exception $e) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $e->getMessage());
        } catch (Throwable $th) {
            return ApiResponse::error('Hay un problema con el proceso para crear', 500, $th->getMessage());
        }
    }

    /**
     * Mostrar un registro específico por ID
     */
    public function show($id): JsonResponse
    {
        try {
            $merceria = Merceria::findOrFail($id);
            return ApiResponse::success('Mercería encontrada correctamente', 200, $merceria);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }

    /**
     * Actualizar un registro existente por ID
     */
    public function update(MerceriaRequest $request, $id): JsonResponse
    {
        try {
            $merceria = Merceria::findOrFail($id);
            $validate = $request->validated();

            $merceria->update($validate);

            return ApiResponse::success('Mercería actualizada con éxito', 200, new MerceriaResource($merceria));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro para actualizar', 404, $me->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }

    /**
     * Deshabilitar (borrado lógico) de un registro por ID
     */
    public function destroy($id): JsonResponse
    {
        try {
            $merceria = Merceria::findOrFail($id);
            $merceria->visibilidad_merceria = false;
            $merceria->save();

            return ApiResponse::success('Mercería eliminada con éxito', 200, new MerceriaResource($merceria));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro para eliminar', 404, $me->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
}