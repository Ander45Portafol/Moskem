<?php

namespace App\Http\Controllers;

use App\Http\Requests\TelasRequest;
use App\Http\Resources\TelasResource as ResourcesTelasResource;
use App\Http\Responses\ApiResponse;
use App\Models\Tela;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Throwable;

class TelaController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $telas = Tela::where('visibilidad_tela', true)->orderBy("id_tela")->get();
            if ($telas->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, ResourcesTelasResource::collection($telas));
            }
        } catch (Throwable $to) {
            return ApiResponse::error('Error', 500, $to->getMessage());
        }
    }
    public function store(TelasRequest $request): JsonResponse
    {
        $rutaImagen = null;

        try {
            $validate = $request->validated();
            $archivoImagen = $validate['imagen_telas'] ?? null;
            unset($validate['imagen_telas']);

            $validate['visibilidad_tela'] = true;
            $validate['fecha_ingreso_tela'] = now()->toDateString();
            $validate['codigo_tela_proveedor'] = $validate['codigo_tela_proveedor'] ?? '';

            if ($archivoImagen) {
                $rutaImagen = $archivoImagen->store('telas', 'public');
                if (!$rutaImagen) {
                    throw new \RuntimeException('No se pudo guardar el archivo de imagen.');
                }
                $validate['imagen_telas'] = $rutaImagen;
            }

            $tela = Tela::create($validate);
            $tela->load('proveedor');

            return ApiResponse::success('Tela creada con exito', 200, new ResourcesTelasResource($tela));
        } catch (\Throwable $th) {
            if ($rutaImagen) {
                Storage::disk('public')->delete($rutaImagen);
            }
            return ApiResponse::error('Error al intentar guardar la tela', 500, $th->getMessage());
        }
    }
    public function show(int $id): JsonResponse
    {
        try {
            $tela = Tela::findOrFail($id);
            return ApiResponse::success('Tela encontrada correctamente', 200, $tela);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (Throwable $e) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
    public function update(TelasRequest $request, $id): JsonResponse
    {
        $nuevaRutaImagen = null;

        try {
            $tela = Tela::findOrFail($id);
            $validate = $request->validated();
            $archivoImagen = $validate['imagen_telas'] ?? null;
            unset($validate['imagen_telas']);
            $validate['codigo_tela_proveedor'] = $validate['codigo_tela_proveedor'] ?? '';

            $rutaImagenAnterior = $tela->imagen_telas;

            if ($archivoImagen) {
                $nuevaRutaImagen = $archivoImagen->store('telas', 'public');
                if (!$nuevaRutaImagen) {
                    throw new \RuntimeException('No se pudo guardar el archivo de imagen.');
                }
                $tela->imagen_telas = $nuevaRutaImagen;
            }

            $tela->fill($validate);
            $tela->save();

            if (
                $nuevaRutaImagen &&
                $rutaImagenAnterior &&
                $rutaImagenAnterior !== $nuevaRutaImagen
            ) {
                Storage::disk('public')->delete($rutaImagenAnterior);
            }

            $tela->load('proveedor');
            return ApiResponse::success('Tela actualizada con exito', 200, new ResourcesTelasResource($tela));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (Throwable $th) {
            if ($nuevaRutaImagen) {
                Storage::disk('public')->delete($nuevaRutaImagen);
            }
            return ApiResponse::error('No se pudo actualizar la tela', 500, $th->getMessage());
        }
    }
    public function destroy($id): JsonResponse
    {
        try {
            $tela = Tela::findOrFail($id);
            $tela->visibilidad_tela = false;
            $tela->save();
            return ApiResponse::success('Tela eliminada con exito', 200, new ResourcesTelasResource($tela));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (Throwable $th) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $th->getMessage());
        }
    }
}
