<?php

namespace App\Http\Controllers;

use App\Http\Resources\DetallePedidoResource;
use App\Http\Responses\ApiResponse;
use App\Models\DetallePedido;
use Illuminate\Http\Request;

class DetallePedidoController extends Controller
{
    //
    public function index(){
        try {
            $detalle_pedido=DetallePedido::orderBy('evento_traje')->get();
            if ($detalle_pedido->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            }else{
                return ApiResponse::success('¡Exito!', 200, DetallePedidoResource::collection($detalle_pedido));
            }
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
