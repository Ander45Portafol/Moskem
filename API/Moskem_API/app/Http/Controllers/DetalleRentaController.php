<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\DetalleRenta;
use Exception;
use Illuminate\Http\Request;

use function PHPUnit\Framework\isEmpty;

class DetalleRentaController extends Controller
{
    public function cargarDetalleRenta( int $id_renta){
        try {
            $detalle_rentas=DetalleRenta::with('producto')->where('id_renta',$id_renta)->get();
            if ($detalle_rentas->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200,
                    'data' => []
                ], 200);
            }
            return ApiResponse::success('¡Éxito!', 200, $detalle_rentas);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al listar los productos', 500, $ex->getMessage());
        } catch (\Throwable $to) {
            return ApiResponse::error('Error inesperado al listar los productos', 500, $to->getMessage());
        }
    }
}
