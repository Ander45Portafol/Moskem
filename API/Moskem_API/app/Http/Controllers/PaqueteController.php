<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Paquete;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class PaqueteController extends Controller
{
    //
    public function index(){
        try {
            $paquete = Paquete::with('detalle_paquete.prenda')->get();
            return ApiResponse::success('Pedido encontrado correctamente', 200, $paquete);
        } catch (Exception $e) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());        }
    }
    public function show(int $id_paquete){
        try {
            $paquete = Paquete::with('detalle_paquete.prenda')->findOrFail($id_paquete);
            return ApiResponse::success('Paquete encontrado correctamente', 200, $paquete);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }

}
