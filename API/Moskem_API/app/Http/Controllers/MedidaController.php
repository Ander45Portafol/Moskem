<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Medida;
use App\Models\Pedido;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Throwable;

class MedidaController extends Controller
{
    //
    public function index()
    {
        try {
            $medidas = Medida::all();
            if ($medidas->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, $medidas);
            }
        } catch (Throwable $th) {
            return ApiResponse::error('Error al conectar con el servidor', 404, $th->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('No se puedo finalizar el proceso', 500, $e->getMessage());
        }
    }
    public function store(Request $request)
    {
        try {
            $medidas = Medida::create($request);
            return ApiResponse::success('Medidas ingresadas correctamente', 500, $medidas);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }
    public function createCodigo(int $id,Request)
    {
        try {
            $pedido = Pedido::with(['cliente' => function ($query) {
                $query->select('id_cliente', 'nombres_cliente', 'apellidos_cliente');
            }])->find($id);
            if (!$pedido->cliente) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'El pedido no tiene un cliente asignado'
                ], 404);
            }

            $primerNombre = explode(' ', trim($pedido->cliente->nombres_cliente))[0];
            $primerApellido = explode(' ', trim($pedido->cliente->apellidos_cliente))[0];
            
            $inicialNombre = strtoupper(substr($primerNombre, 0, 1));
            $inicialApellido = strtoupper(substr($primerApellido, 0, 1));
            $medida=Medida::findOrFail($id_medida);
            $medida->codigo_medida = $inicialNombre . $inicialApellido .$id .$id_medida;
            $medida->codigo_medida = $codigoGenerado;
            $medida->save();
            return response()->json([
                'status' => 'success',
                'data'   => $medida
            ], 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }
    public function show(int $id)
    {
        try {
            $merceria = Medida::findOrFail($id);
            return ApiResponse::success('Medidas encontradas con exito', 200, $merceria);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }
    public function update(Request $request, int $id)
    {
        try {
            $medida = Medida::findOrFail($id);
            $medida->update($request);
            return ApiResponse::success('Detalle creado con exito', 200, $medida);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontro el detalle', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
    public function destroy(int $id)
    {
        try {
            $medidas = Medida::findOrFail($id);
            $medidas->delete();
            return ApiResponse::success('Registro de medidas eliminadas con exito', 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('La medida seleccionadas no existe', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al eliminar', 500, $ex->getMessage());
        }
    }
}
