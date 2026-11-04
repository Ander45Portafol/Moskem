<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerceriaRequest;
use App\Http\Resources\MerceriaResource;
use App\Http\Responses\ApiResponse;
use App\Models\Merceria;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
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
        $rutaImagen = null;
        try {
            $validate = $request->validated();
            $validate['visibilidad_merceria'] = true;
            $archivoImagen = $validate['imagen_merceria'] ?? null;
            unset($validate['imagen_merceria']);
            if ($archivoImagen) {
                $rutaImagen = $archivoImagen->store('mercerias', 'public');
                if (!$rutaImagen) {
                    throw new \RuntimeException('No se pudo guardar el archivo de imagen.');
                }
                $validate['imagen_merceria'] = $rutaImagen;
            }
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
    public function show(int $id): JsonResponse
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
    public function update(MerceriaRequest $request, int $id): JsonResponse
    {
        $nuevaRutaImagen = null;
        try {
            $merceria = Merceria::findOrFail($id);
            $validate = $request->validated();

            $archivoImagen = $validate['imagen_merceria'] ?? null;
            unset($validate['imagen_merceria']);

            $validate['codigo_merceria_proveedor'] = $validate['codigo_merceria_proveedor'] ?? '';

            $rutaImagenAnterior = $merceria->imagen_merceria;

            if ($archivoImagen) {
                $nuevaRutaImagen = $archivoImagen->store('mercerias', 'public');

                if (!$nuevaRutaImagen) {
                    throw new \RuntimeException('No se pudo guardar el archivo de imagen.');
                }

                // 2. Ahora sí guardará la ruta correcta en la DB
                $merceria->imagen_merceria = $nuevaRutaImagen;
            }

            $merceria->fill($validate);
            $merceria->save();

            // 3. Esta validación ya funcionará y borrará la imagen vieja
            if (
                $nuevaRutaImagen &&
                $rutaImagenAnterior &&
                $rutaImagenAnterior !== $nuevaRutaImagen
            ) {
                Storage::disk('public')->delete($rutaImagenAnterior);
            }

            $merceria->load('proveedor');
            return ApiResponse::success('Mercería actualizada con éxito', 200, new MerceriaResource($merceria));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro para actualizar', 404, $me->getMessage());
        } catch (\Throwable $e) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
    /**
     * Deshabilitar (borrado lógico) de un registro por ID
     */
    public function destroy(int $id): JsonResponse
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
