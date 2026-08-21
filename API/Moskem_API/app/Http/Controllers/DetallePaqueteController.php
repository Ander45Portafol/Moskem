<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\DetallePaquete;
use App\Models\DetallePedido;
use App\Models\Paquete;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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
    public function getPaquetePedido(int $id_pedido){
        try {
            //code...        
            $id_paquete = DetallePedido::where('id_pedido', $id_pedido)
            ->distinct()
            ->value('id_paquete');

        $paquete=Paquete::findOrFail($id_paquete);
        return response()->json(['data' => $paquete]);
        } catch (ModelNotFoundException $me) {
            return response()->json(['data' => []]);
        }

    }
}
