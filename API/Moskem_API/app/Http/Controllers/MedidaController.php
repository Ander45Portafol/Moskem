<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Medida;
use App\Models\Pedido;
use App\Models\Renta;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            $medidas = Medida::create($request->all());
            return ApiResponse::success('Medidas ingresadas correctamente', 201, [
                'id_medidas' => $medidas->id_medidas,
                'medidas'    => $medidas
            ]);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }
    public function createCodigo(Request $request, int $id, int $id_medida)
    {
        try {
            $cargarCliente = function ($query) {
                $query->select('id_cliente', 'nombres_cliente', 'apellidos_cliente');
            };
            $registro = $request->query('tipo') === 'renta'
                ? Renta::with(['cliente' => $cargarCliente])->findOrFail($id)
                : Pedido::with(['cliente' => $cargarCliente])->findOrFail($id);

            if (!$registro->cliente) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'El registro no tiene un cliente asignado'
                ], 404);
            }

            $primerNombre = explode(' ', trim($registro->cliente->nombres_cliente))[0];
            $primerApellido = explode(' ', trim($registro->cliente->apellidos_cliente))[0];
            
            $inicialNombre = strtoupper(substr($primerNombre, 0, 1));
            $inicialApellido = strtoupper(substr($primerApellido, 0, 1));
            $medida=Medida::findOrFail($id_medida);
            $medida->codigo_medida = $inicialNombre . $inicialApellido .$id .$id_medida;
            $medida->save();
            return response()->json([
                'status' => 'success',
                'data'   => $medida
            ], 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }
    public function buscarMedidasRenta(int $id_renta)
    {
        try {
            $renta = Renta::findOrFail($id_renta);
            $medidasRenta = DB::table('detalle_rentas as detalle')
                ->join('rentas', 'rentas.id_renta', '=', 'detalle.id_renta')
                ->join('productos', 'productos.id_producto', '=', 'detalle.id_producto')
                ->join('medidas', 'medidas.id_medidas', '=', 'detalle.id_medidas')
                ->where('rentas.id_cliente', $renta->id_cliente)
                ->whereNotNull('medidas.codigo_medida')
                ->select('medidas.*', 'productos.tipo_producto as tipo_prenda')
                ->get();
            $medidasPedido = DB::table('orden_trabajos as orden')
                ->join(
                    'detalle_pedidos as detalle',
                    'detalle.id_detalle_pedido',
                    '=',
                    'orden.id_detalle_pedido'
                )
                ->join('pedidos', 'pedidos.id_pedido', '=', 'detalle.id_pedido')
                ->join('medidas', 'medidas.id_medidas', '=', 'orden.id_medidas')
                ->where('pedidos.id_cliente', $renta->id_cliente)
                ->whereNotNull('medidas.codigo_medida')
                ->select('medidas.*', 'detalle.prenda as tipo_prenda')
                ->get();

            $historial = $medidasRenta
                ->concat($medidasPedido)
                ->unique(fn($medida) => $medida->id_medidas . '|' . $medida->tipo_prenda)
                ->sortBy('codigo_medida')
                ->values();

            return ApiResponse::success(
                'Medidas del cliente encontradas correctamente',
                200,
                $historial
            );
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontró la renta', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al consultar las medidas de renta', 500, $ex->getMessage());
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
            $medida->update($request->all());
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
