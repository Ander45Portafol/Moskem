<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\DetallePaquete;
use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class DetallePaqueteController extends Controller
{
    public function index()
    {
        return response()->json(DetallePaquete::all());
    }
    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'id_paquete'=>'required|integer',
                'prenda_paquete' => 'required',
                'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            $detalle_paquete = DetallePaquete::create(collect($validated)->except('imagen')->toArray());

            if ($request->hasFile('imagen')) {
                $detalle_paquete->imagen = $request->file('imagen')->store('detalle_paquetes', 'public');
                $detalle_paquete->save();
            }
            // Retornamos usando tu estructura de ApiResponse y tu Resource
            return ApiResponse::success('Detalle paquete creado con exito', 200, $detalle_paquete);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }
}
