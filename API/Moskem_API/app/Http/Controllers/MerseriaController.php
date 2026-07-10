<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerceriaRequest;
use App\Http\Resources\MerceriaResource;
use App\Http\Responses\ApiResponse;
use App\Models\Merceria;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class MerseriaController extends Controller
{
    //
    public function index():JsonResponse
    {
        try {
            $merceria = Merceria::where('visibilidad_merceria', true)->orderBy("id_merceria")->get();
            if ($merceria->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, MerceriaResource::collection($merceria));
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        }
        catch(Throwable $to){
            return ApiResponse::error('Error',500,$to->getMessage());
        }
    }
    public function store(MerceriaRequest $request):JsonResponse{
        try {
            $validate=$request->validated();
            $validate['visibilidad_merceria']=true;
            $merceria=Merceria::create($validate);
            return ApiResponse::success('Merceria creada con exito',200,new MerceriaResource($merceria));
        } catch (\Throwable $th) {
            return ApiResponse::error('Hay un problema con el proceso para crear',504,$th->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('Error al intentar guardar el registro',500,$e->getMessage());
        }
    }
    public function show($id):JsonResponse{
        try {
            $merceria=Merceria::findOrFail($id);
            return ApiResponse::success('Merceria encontrada correctamente', 200, $merceria);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro',404,$me->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());

        }
    }
    public function update(MerceriaRequest $request, $id):JsonResponse{
        try {
            $merceria=Merceria::findOrFail($id);
            $validate=$request->validated();
            $merceria->update($validate);
            return ApiResponse::success('Merceria actualizada con exito',200,new MerceriaResource($merceria));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro',404,$me->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
    public function destroy($id):JsonResponse{
        try {
            $merceria=Merceria::findOrFail($id);
            $merceria->visibilidad_merceria=false;
            $merceria->save();
            return ApiResponse::success('Merceria eliminada con exito',200,new MerceriaResource($merceria));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro',404,$me->getMessage());
        }
        catch(Exception $e){
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
}
