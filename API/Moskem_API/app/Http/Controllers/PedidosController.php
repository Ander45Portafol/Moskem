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
                    'code' => 200
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
            $pedido=Pedido::findOrFail($id);
            return ApiResponse::success('Pedido encontrado correctamente', 200, $pedido);
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
