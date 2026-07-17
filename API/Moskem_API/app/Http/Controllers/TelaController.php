<?php

namespace App\Http\Controllers;

use App\Http\Requests\TelasRequest;
use APP\Http\Resources\TelasResource;
use App\Http\Responses\ApiResponse;
use App\Models\Tela;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class TelaController extends Controller
{
    public function index():JsonResponse
    {
        try {
            $telas = Tela::where('visibilidad_tela', true)->orderBy("id_tela")->get();
            if ($telas->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, TelasResource::collection($telas));
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        } catch (Throwable $to) {
            return ApiResponse::error('Error', 500, $to->getMessage());
        }
    }
    public function store(TelasRequest $request):JsonResponse{
        try {
            $validate=$request->validated();
            $validate['visibilidad_tela']=true;
            $tela=Tela::create($validate);
            return ApiResponse::success('Tela creada con exito',200,new TelasResource($tela));
        } catch (\Throwable $th) {
            return ApiResponse::error('Hay un problema con el proceso para crear',504,$th->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('Error al intentar guardar el registro',500,$e->getMessage());
        }
    }
    public function show($id):JsonResponse{
        try {
            $tela=Tela::findOrFail($id);
            return ApiResponse::success('Tela encontrada correctamente', 200, $tela);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro',404,$me->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
    public function update(TelasRequest $request, $id):JsonResponse{
        try {
            $tela=Tela::findOrFail($id);
            $validate=$request->validated();
            $tela->update($validate);
            return ApiResponse::success('Tela actualizada con exito',200,new TelasResource($tela));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro',404,$me->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
    public function destroy($id):JsonResponse{
        try {
            $tela=Tela::findOrFail($id);
            $tela->visibilidad_tela=false;
            $tela->save();
            return ApiResponse::success('Tela eliminada con exito',200,new TelasResource($tela));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro',404,$me->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
}