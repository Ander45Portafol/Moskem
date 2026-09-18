<?php

namespace App\Http\Controllers;

use App\Http\Requests\RentaRequest;
use App\Http\Resources\RentaResource;
use App\Http\Responses\ApiResponse;
use App\Models\DetalleRenta;
use Exception;

class RentaController extends Controller
{
    public function index()
    {
        try {
            $renta = DetalleRenta::with(['renta.clientes', 'producto'])->get();
            if ($renta->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200,
                    'data' => []
                ], 200);
            }

            return ApiResponse::success('¡Éxito!', 200, RentaResource::collection($renta));
        } catch (Exception $ex) {
            return ApiResponse::error('Error al listar los productos', 500, $ex->getMessage());
        } catch (\Throwable $to) {
            return ApiResponse::error('Error inesperado al listar los productos', 500, $to->getMessage());
        }
    }
    public function store(RentaRequest $request){
        
    }
}
