<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClienteRequest;
use App\Http\Requests\PedidoRequest;
use App\Http\Resources\PedidoResource;
use App\Http\Responses\ApiResponse;
use App\Models\Pedido;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class PedidosController extends Controller
{
    //
    public function index():JsonResponse
    {
        try {
            $pedido = Pedido::where('visibilidad_pedido', true)->orderBy("fecha_entrega")->get();
            if ($pedido->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200,
                    'data'=>$pedido
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, PedidoResource::collection($pedido));
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        }
        catch(Throwable $to){
            return ApiResponse::error('Error',500,$to->getMessage());
        }
    }
    public function store(PedidoRequest $request):JsonResponse{
        try {
            $validate=$request->validated();
            $validate['visibildad_pedido']=true;
            $pedido=Pedido::create($validate);
            return ApiResponse::success('Pedido creado con exito',200,new PedidoResource($pedido));
        } catch (\Throwable $th) {
            return ApiResponse::error('Hay un problema con el proceso para crear',504,$th->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('Error al intentar guardar el registro',500,$e->getMessage());
        }
    }
    public function show($id):JsonResponse{
        try {
            $pedido=Pedido::with('cliente')->findOrFail($id);
            $data = [
                'id_pedido'          => $pedido->id_pedido,
                'id_cliente'         => $pedido->id_cliente,
                // Si el pedido tiene cliente, obtenemos su 'nombre_completo'. Si no, devolvemos null o un string alternativo.
                'cliente'            => $pedido->cliente ? $pedido->cliente->nombres_cliente.' '.$pedido->cliente->apellidos_cliente : 'Cliente no asignado',
                'estado_pedido'      => $pedido->estado_pedido,
                'nota_pedido'        => $pedido->nota_pedido,
                'imagen_referencia'  => $pedido->imagen_referencia,
                'evento_traje'       => $pedido->evento_traje,
                'tipo_entalle'       => $pedido->tipo_entalle,
                'anticipo'           => $pedido->anticipo,
                'costo_total'        => $pedido->costo_total,
                'restante'           => $pedido->restante,
                'fecha_tallaje1'     => $pedido->fecha_tallaje1,
                'fecha_tallaje2'     => $pedido->fecha_tallaje2,
                'fecha_entrega'      => $pedido->fecha_entrega,
                'tipo_evento'        => $pedido->tipo_evento,
                'visibilidad_pedido' => $pedido->visibilidad_pedido,
                'created_at'         => $pedido->created_at,
                'updated_at'         => $pedido->updated_at,
            ];
            return ApiResponse::success('Pedido encontrado correctamente', 200, $data);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro',404,$me->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
    public function update(PedidoRequest $request, $id):JsonResponse{
        try {
            $pedido=Pedido::findOrFail($id);
            $validaciones=$request->validated();
            $pedido->update($validaciones);
            return ApiResponse::success('Pedido actualizado con exito', 200, new PedidoResource($pedido));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontro el pedido', 404, $me->getMessage());
        } catch (ValidationException $ve) {
            return ApiResponse::error('Error en validaciones', 422, $ve->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
    public function destroy($id):JsonResponse{
        try {
            $pedido=Pedido::findOrFail($id);
            $pedido->visibilidad_pedido=false;
            $pedido->save();
            return ApiResponse::success('Pedido eliminado con exito', 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('El pedido seleccionado no existe', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al eliminar', 500, $ex->getMessage());
        }
    }
}
