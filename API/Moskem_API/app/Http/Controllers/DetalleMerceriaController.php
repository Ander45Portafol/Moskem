<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\DetalleMerceria;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DetalleMerceriaController extends Controller
{
    //
    public function store(Request $request){
        try {
            $validated=$request->validate([
                'id_detalle_pedidos'=>'required',
                'id_mercerias'=>'required',
                'cantidad_merceria'=>'required'
            ]);
            $detalle_merceria=DetalleMerceria::create($validated);
            return ApiResponse::success('Detalle Merceria creado con exito',201,$detalle_merceria);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }
    public function update(Request $request,int $id){
        try {
            $detalle_merceria=DetalleMerceria::findOrFail($id);
            $datos = $request->only([
                'id_detalle_pedidos',
                'id_mercerias',
                'cantidad_merceria'
            ]);
            $detalle_merceria->update($datos);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontro el detalle', 404, $me->getMessage());
        }  catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
    public function destroy(int $id){
        try {
            $detalle_merceria=DetalleMerceria::findOrFail($id);
            $detalle_merceria->delete();
            return ApiResponse::success('Detalle Mercia eliminado con exito',200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('El detalle merceria seleccionado no existe', 404, $me->getMessage());        
        }catch(Exception $ex){
            return ApiResponse::error('Error al eliminar', 500, $ex->getMessage());
        }
    } 
    public function getDetallePedidoMerceria(int $id){
        try {
            $detalle_mercerias = DetalleMerceria::from('mercerias as a')
                ->join('detalle_mercerias as b', 'a.id_merceria', '=', 'b.id_mercerias')
                ->where('b.id_detalle_pedidos', $id) 
                ->select('b.id_detalle_merceria','a.id_merceria','a.tipo_merceria', 'a.color', 'a.tamanio_merceria', 'b.cantidad_merceria')
                ->get();
            if (!$detalle_mercerias) {
                return ApiResponse::success('los detalles de merceria para la prenda', 200, response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]));
            }else{
                return ApiResponse::success('los detalles de merceria para la prenda', 200, $detalle_mercerias);
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        }
    }

}
