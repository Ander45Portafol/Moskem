<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Prenda;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class PrendaController extends Controller
{
    //
    public function index()
    {
        try {
            $prendas = Prenda::all();
            return ApiResponse::success('Prendas cargadas correctamente', 201, $prendas);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar mostrar los registro', 500, $ex->getMessage());
        }
    }
    public function store(Request $request)
    {

        try {

            $validated = $request->validate([
                'prenda_paquete' => 'required',
                'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'precio_unitario' => 'required|decimal:0,2'
            ]);

            $prenda = Prenda::create(collect($validated)->except('imagen')->toArray());

            if ($request->hasFile('imagen')) {
                $prenda->imagen = $request->file('imagen')->store('prendas', 'public');
                $prenda->save();
            }
            // Retornamos usando tu estructura de ApiResponse y tu Resource
            return ApiResponse::success('Prenda creada con exito', 200, $prenda);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }
    public function update(Request $request, int $id)
    {
        try {
            // Buscamos el registro; si usas Route Model Binding, puedes cambiar $id por (Prenda $prenda)
            $prenda = Prenda::findOrFail($id);

            $validated = $request->validate([
                'prenda_paquete' => 'required',
                'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'precio_unitario' => 'required|decimal:0,2'
            ]);

            // Actualizamos los datos (excluyendo la imagen temporalmente)
            $prenda->update(collect($validated)->except('imagen')->toArray());

            // Si el request trae una nueva imagen, procesamos el reemplazo
            if ($request->hasFile('imagen')) {

                // 1. Eliminamos la imagen anterior física del disco público si existe
                if ($prenda->imagen) {
                    Storage::disk('public')->delete($prenda->imagen);
                }

                // 2. Guardamos la nueva imagen y actualizamos el campo
                $prenda->imagen = $request->file('imagen')->store('prendas', 'public');
                $prenda->save();
            }

            return ApiResponse::success('Prenda actualizada con éxito', 200, $prenda);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (Throwable $th) {

            return ApiResponse::error('No se pudo actualizar la prenda', 500, $th->getMessage());
        }
    }
    public function destroy(int $id)
    {
        try {
            $prenda = Prenda::findOrFail($id);
            if ($prenda->imagen) {
                Storage::disk('public')->delete($prenda->imagen);
            }
            $prenda->delete();
            return ApiResponse::success('Prenda eliminada con éxito', 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (Throwable $th) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $th->getMessage());
        }
    }
}
