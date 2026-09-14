<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Prenda;
use Exception;
use Illuminate\Http\Request;

class PrendaController extends Controller
{
    //
    public function index()
    {
        try {
            $prendas = Prenda::all();
            return ApiResponse::success('Prendas cargadas correctamente',201,$prendas);
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
                'precio_unitario'=> 'required|decimal:0,2'
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
}
