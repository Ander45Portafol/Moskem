<?php

namespace App\Http\Controllers;

use App\Http\Request\MerceriaRequest;
use App\Http\Requests\MerceriaResource;
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
}
