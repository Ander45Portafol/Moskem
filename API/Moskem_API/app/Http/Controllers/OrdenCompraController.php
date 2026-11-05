<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\OrdenCompra;
use Illuminate\Http\Request;
use Throwable;

class OrdenCompraController extends Controller
{
    //
    public function index()
    {
        try {
            // 1. Usamos 'with' para traer los datos de las relaciones y optimizar las consultas
            // NOTA: Usé 'visibilidad_ordencompra' según tu modelo, si es 'visibilidad_renta' cámbialo.
            $ordenesCompra = OrdenCompra::with(['merceria', 'tela'])
                ->where('visibilidad_ordencompra', true)
                ->get();

            if ($ordenesCompra->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                // 2. Transformamos la colección para crear el atributo "compra"
                $data = $ordenesCompra->map(function ($orden) {
                    // Convertimos el modelo a un arreglo
                    $ordenArray = $orden->toArray();

                    // Evaluamos cuál tiene datos y lo asignamos a "compra"
                    if (!is_null($orden->id_merceria)) {
                        $ordenArray['compra'] = $orden->merceria;
                    } elseif (!is_null($orden->id_tela)) {
                        $ordenArray['compra'] = $orden->tela;
                    } else {
                        $ordenArray['compra'] = null; // Por si algún registro no tiene ninguno
                    }

                    // 3. (Opcional) Eliminamos las relaciones originales para que el JSON quede más limpio
                    unset($ordenArray['merceria']);
                    unset($ordenArray['tela']);

                    return $ordenArray;
                });

                return ApiResponse::success('¡Exito!', 200, $data);
            }
        } catch (\Throwable $to) {
            return ApiResponse::error('Error', 500, $to->getMessage());
        }
    }
}
