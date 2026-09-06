<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Productos;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Js;
use Psy\Util\Json;

class ProductosController extends Controller
{
    /**
     * Obtener todos los registros de productos
     */
    public function index(): JsonResponse
    {
        try {
            $productos = productos::where('visibilidad_producto', true)
                ->orderBy('id_producto')
                ->get();
            
            if ($productos->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200, 
                    'data' => []
                ], 200);   
            }

            return ApiResponse::success('¡Éxito!', 200, $productos);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al listar los productos', 500, $ex->getMessage());
        } catch (\Throwable $to) {
            return ApiResponse::error('Error inesperado al listar los productos', 500, $to->getMessage());
        }
    }

    /**
     * Crear un nuevo registro de producto
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validate = $request->validated();
            $validate['visibilidad_producto'] = true;

            $producto = Productos::create($validate);

            return response()->json([
                'message' => 'Producto creado con éxito',
                'code' => 201,
                'data' => $producto
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al intentar guardar el registro',
                'code' => 500,
                'error' => $e->getMessage()
            ], 500);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Hay un problema con el proceso para crear',
                'code' => 500,
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener un registro de producto por su ID
     */
    public function show($id): JsonResponse
    {
        try {
            $producto = Productos::findOrFail($id);
            return ApiResponse::success('Producto encontrado correctamente', 200, $producto);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Error al intentar buscar el registro', 500, $e->getMessage());
        }
    }

    /**
     * Actualizar un registro de producto por su ID
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $producto = Productos::findOrFail($id);
            $validate = $request->validated();

            $producto->update($validate);

            return ApiResponse::success('Producto actualizado con éxito', 200, $producto);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $e->getMessage());
        }
    }

    /**
     * Eliminar un registro de producto por su ID
     */
    public function destroy($id): JsonResponse
    {
        try {
            $producto = Productos::findOrFail($id);
            $producto->visibilidad_producto = false;
            $producto->save();

            return ApiResponse::success('Producto eliminado con éxito', 200, $producto);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (\Exception $e) {
            return ApiResponse::error('Error al intentar eliminar el registro', 500, $e->getMessage());
        }
    }
}
