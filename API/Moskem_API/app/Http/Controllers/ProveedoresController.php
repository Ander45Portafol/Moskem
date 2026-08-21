<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Proveedore;
use Exception;
use Illuminate\Http\Request;
use Throwable;

class ProveedoresController extends Controller
{
     //
    public function index()
    {
        try {
            $proveedores = Proveedore::all();
            if ($proveedores->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, $proveedores);
            }
        } catch (Throwable $th) {
            return ApiResponse::error('Error al conectar con el servidor', 404, $th->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('No se puedo finalizar el proceso', 500, $e->getMessage());
        }
    }
}
