<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrdenTrabajoRequest;
use App\Http\Responses\ApiResponse;
use App\Models\OrdenTrabajo;
use App\Models\Pedido;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrdenTrabajoController extends Controller
{
    //
    public function cargarMedidas($id_pedido)
    {
        try {
            $resultados = DB::table('medidas as a')
                ->join('orden_trabajos as b', 'b.id_medidas', '=', 'a.id_medidas')
                ->join('detalle_pedidos as c', 'c.id_detalle_pedido', '=', 'b.id_detalle_pedido')
                ->join('pedidos as d', 'd.id_pedido', '=', 'c.id_pedido')
                ->join('clientes as e', 'e.id_cliente', '=', 'd.id_cliente')
                ->where('d.id_pedido', $id_pedido)
                ->select('a.*', 'b.*', 'c.*', 'd.*', 'e.*') // Ajusta las columnas que necesitas para evitar que se sobrescriban los IDs
                ->get();
            if (!$resultados) {
                return ApiResponse::success('las medidas guardas para el cliente no se pueden acceder', 200, response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]));
            } else {
                return ApiResponse::success('Si se encontraron medidas para la prenda', 200, $resultados);
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        }
    }
    public function store(OrdenTrabajoRequest  $request)
    {
        try {
            $validate = $request->validated();
            $validate['visibilidad_ordentrabajo'] = true;
            $ordentrabajo = OrdenTrabajo::create($validate);
            return ApiResponse::success('La orden de trabajo fue creada con exito', 200,  $ordentrabajo);
        } catch (\Throwable $th) {
            return ApiResponse::error('Hay un problema con el proceso para crear', 504, $th->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $e->getMessage());
        }
    }
    public function show(int $id){
       try {
        $ordentrabajo=OrdenTrabajo::findOrFail($id);
            return ApiResponse::success('Orden de trabajo encontrado correctamente', 200, $ordentrabajo);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
    public function update(OrdenTrabajo $request, int $id){
        try {
            $ordentrabajo=OrdenTrabajo::findOrFail($id);
            $validaciones=$request->validated();
            $ordentrabajo->update($validaciones);
            return ApiResponse::success('Pedido actualizado con exito', 200, $ordentrabajo);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontro el pedido', 404, $me->getMessage());
        } catch (ValidationException $ve) {
            return ApiResponse::error('Error en validaciones', 422, $ve->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
    public function destroy(int $id){
        try {
            $ordentrabajo=OrdenTrabajo::findOrFail($id);
            $ordentrabajo->visibilidad_ordentrabajo=false;
            $ordentrabajo->save();
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('El pedido seleccionado no existe', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al eliminar', 500, $ex->getMessage());
        }
    }
}
