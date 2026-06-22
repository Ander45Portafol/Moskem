<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClienteRequest;
use App\Models\Cliente;
use App\Http\Resources\ClienteResource;
use App\Http\Responses\ApiResponse;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Nette\Schema\ValidationException;
use Throwable;

class ClienteController extends Controller
{
    public function index():JsonResponse
    {
        try{
            $cliente=Cliente::orderBy("nombres_cliente")->get();
            if ($cliente->isEmpty()) {
                return response()->json('No existen registros');
            }else{
                return ApiResponse::success('¡Exito!',200,ClienteResource::collection($cliente));
            }
        }catch(Throwable $to){
            return ApiResponse::error('Error',500,$to->getMessage());
        }
    }
    public function store(ClienteRequest $request):JsonResponse{
        try{
            $validate=$request->validated();
            $client=Cliente::create($validate);
            return ApiResponse::success('Cliente creado con exito',200,new ClienteResource($client));
        }catch(Exception $ex){
            return ApiResponse::error('Error a intentar guardar el registro', 500, $ex->getMessage());

        }
    }
    public function show($id):JsonResponse{
        try{
            $client=Cliente::findOrFail($id);
            return ApiResponse::success('Cliente encontrado correctamente',200,$client);
        }catch(ModelNotFoundException $me){
            return ApiResponse::error('Error al intentar buscar el registro',404, $me->getMessage());
        }
    }
    public function update(ClienteRequest $request,$id):JsonResponse
    {
        try{
            $client=Cliente::findOrFail($id);
            $validaciones=$request->validated();
            $client->update($validaciones);
            return ApiResponse::success('Cliente actualizado con exito',200,new ClienteResource($client));
        }catch(Exception $ex){
            return ApiResponse::error('Error al intenttar actualizar el regsitro',500,$ex->getMessage());
        }catch(ModelNotFoundException $me){
            return ApiResponse::error('No se encontro al cliente',404,$me->getMessage());
        }
        catch(ValidationException $ve){
            return ApiResponse::error('Error en validaciones',422,$ve->getMessage());
        }
    }
    public function destroy($id){
        try{
            $client=Cliente::findOrFail($id);
            $client->delete();
            return ApiResponse::success('Cliente eliminado con exito',200);
        }catch(ModelNotFoundException $me){
            return ApiResponse::error('El cliente seleccionado no existe', 404,$me->getMessage());
        }catch(Exception $ex){
            return ApiResponse::error('Error al eliminar', 500, $ex->getMessage());
        }
    }
}
