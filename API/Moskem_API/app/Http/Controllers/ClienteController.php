<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClienteRequest;
use App\Models\Cliente;
use App\Http\Resources\ClienteResource;
use App\Http\Responses\ApiResponse;
use Exception;
use Illuminate\Http\JsonResponse;
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
}
