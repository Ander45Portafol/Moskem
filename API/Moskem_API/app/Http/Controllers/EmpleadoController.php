<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmpleadoRequest;
use App\Http\Resources\EmpleadoResource;
use App\Http\Responses\ApiResponse;
use App\Models\Empleado;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Throwable;

class EmpleadoController extends Controller
{
    //
    public function index():JsonResponse
    {
        try {
            $empleado = Empleado::where('visibilidad_empleado', true)->orderBy('nombres_empleado')->get();
            if ($empleado->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, EmpleadoResource::collection($empleado));
            }
        } catch (Throwable $th) {
            return ApiResponse::error('ERROR', 500, $th->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('ERROR', 500, $e->getMessage());
        }
    }
    public function store(EmpleadoRequest $request): JsonResponse
    {
        try {
            $validate = $request->validated();
            $validate['visibilidad_empleado'] = true;
            // 1. Creamos el empleado inicialmente
            $empleado = Empleado::create($validate);


            // 2. Extraemos el primer nombre y el primer apellido para las iniciales
            // Usamos explode por si el usuario ingresó nombres compuestos separados por espacios
            $primerNombre = explode(' ', trim($empleado->nombres_empleado))[0];
            $primerApellido = explode(' ', trim($empleado->apellidos_empleado))[0];

            // Tomamos la primera letra de cada uno y la aseguramos en mayúscula
            $inicialNombre = strtoupper(substr($primerNombre, 0, 1));
            $inicialApellido = strtoupper(substr($primerApellido, 0, 1));

            // 3. Rellenamos el ID con ceros a la izquierda hasta completar 6 dígitos
            $idConCeros = str_pad($empleado->id_empleado, 6, '0', STR_PAD_LEFT);

            // 4. Concatenamos las iniciales con el ID formateado (Ej: AA000001)
            $empleado->codigo_empleado = $inicialNombre . $inicialApellido . $idConCeros;

            //Utilizamos que para la primera contraseña se cree con el codigo de el empleado
            $empleado->clave_empleado = Hash::make($empleado->codigo_empleado);

            // 5. Guardamos el cambio definitivo en la base de datos
            $empleado->save();

            // Retornamos usando tu estructura de ApiResponse y tu Resource
            return ApiResponse::success('Empleado creado con exito', 200, new EmpleadoResource($empleado));
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }
    public function show($id):JsonResponse
    {
        try {
            $employee = Empleado::findOrFail($id);
            return ApiResponse::success('Empleado encontrado correctamente', 200, $employee);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }
    public function update(EmpleadoRequest $request, $id):JsonResponse
    {
        try {
            $empleado=Empleado::findOrFail($id);
            $validaciones=$request->validated();
            $empleado->update($validaciones);
            return ApiResponse::success('Empleado actualizado con exito', 200, new EmpleadoResource($empleado));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontro el pedido', 404, $me->getMessage());
        } catch (ValidationException $ve) {
            return ApiResponse::error('Error en validaciones', 422, $ve->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
    public function destroy($id){
        try {
            $empleado=Empleado::findOrFail($id);
            $empleado->visibilidad_empleado=false;
            $empleado->save();
            return ApiResponse::success('Empleado eliminado con exito', 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('El empleado seleccionado no existe', 404, $me->getMessage());        
            }catch(Exception $e){
            return ApiResponse::error('Error al eliminar', 500, $e->getMessage());
            }
    }
}
