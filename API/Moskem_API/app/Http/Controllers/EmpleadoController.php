<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmpleadoRequest;
use App\Http\Resources\EmpleadoResource;
use Illuminate\Support\Str;
use App\Http\Responses\ApiResponse;
use App\Models\Empleado;
use App\Models\Usuario;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Throwable;

class EmpleadoController extends Controller
{
    //
    public function index(): JsonResponse
    {
        try {
            $empleado = Empleado::where('visibilidad_empleado', true)->orderBy('nombres_empleado')->get();
            if ($empleado->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200,
                    'data' => []
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
            $data = DB::transaction(function () use ($request) {
                $validate = $request->validated();
                $validate['visibilidad_empleado'] = true;

                // 1. Creamos el empleado inicialmente
                $empleado = Empleado::create($validate);

                // 2. Extraemos el primer nombre y primer apellido para las iniciales
                $primerNombre = explode(' ', trim($empleado->nombres_empleado))[0];
                $primerApellido = explode(' ', trim($empleado->apellidos_empleado))[0];

                $inicialNombre = mb_strtoupper(mb_substr($primerNombre, 0, 1));
                $inicialApellido = mb_strtoupper(mb_substr($primerApellido, 0, 1));

                // 3. Rellenamos el ID con ceros a la izquierda (Ej: AA000001)
                $idConCeros = str_pad($empleado->id_empleado, 6, '0', STR_PAD_LEFT);
                $empleado->codigo_empleado = $inicialNombre . $inicialApellido . $idConCeros;
                $empleado->save();

                // 4. Generamos una clave aleatoria alfanumérica de 8 caracteres
                $clavePlana = Str::random(8);

                // 5. Creación del usuario asociado usando el codigo_empleado
                $usuario = Usuario::create([
                    'id_empleado'       => $empleado->id_empleado,
                    'cantidad_intentos' => 5,
                    'usuario'           => $empleado->codigo_empleado, // <--- Ajustado a codigo_empleado
                    'estado_usuario'    => true,
                    'tipo_usuario'      => $empleado->tipo_empleado,
                    'clave'             => Hash::make($clavePlana),
                ]);

                return [
                    'empleado'   => $empleado,
                    'clavePlana' => $clavePlana,
                ];
            });

            // Retornamos la respuesta de éxito junto con la clave plana
            return ApiResponse::success(
                'Empleado y usuario creados con éxito',
                201,
                [
                    'empleado'      => new EmpleadoResource($data['empleado']),
                    'clave_inicial' => $data['clavePlana'], // <--- Ahora sí viajará en el JSON
                ]
            );
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $ex->getMessage());
        }
    }
    public function show($id): JsonResponse
    {
        try {
            $employee = Empleado::findOrFail($id);
            return ApiResponse::success('Empleado encontrado correctamente', 200, $employee);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }
    public function update(EmpleadoRequest $request, $id): JsonResponse
    {
        try {
            $empleado = Empleado::findOrFail($id);
            $validaciones = $request->validated();
            if ($empleado->nombres_empleado != $validaciones['nombres_empleado'] || $empleado->apellidos_empleado != $validaciones['apellidos_empleado']) {
                $primerNombre = explode(' ', trim($validaciones['nombres_empleado']))[0];
                $primerApellido = explode(' ', trim($validaciones['apellidos_empleado']))[0];
                $inicialNombre = strtoupper(substr($primerNombre, 0, 1));
                $inicialApellido = strtoupper(substr($primerApellido, 0, 1));
                $idConCeros = str_pad($empleado->id_empleado, 6, '0', STR_PAD_LEFT);

                // 4. Concatenamos las iniciales con el ID formateado (Ej: AA000001)
                $validaciones['codigo_empleado'] = $inicialNombre . $inicialApellido . $idConCeros;
            }
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
    public function destroy($id)
    {
        try {
            $empleado = Empleado::findOrFail($id);
            $empleado->visibilidad_empleado = false;
            $empleado->save();
            return ApiResponse::success('Empleado eliminado con exito', 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('El empleado seleccionado no existe', 404, $me->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('Error al eliminar', 500, $e->getMessage());
        }
    }
    //Metodo para el motor de busqueda
    public function search(Request $request)
    {
        try {
            $search = $request->query('q');

            if (empty($search)) {
                $empleados = Empleado::where('visibilidad_empleado', true)->get();
                return ApiResponse::success('Lista de clientes', 200, EmpleadoResource::collection($empleados));
            }
            $search = trim($search);
            $empleados = Empleado::where('visibilidad_empleado', true)->where(function ($query) use ($search) {
                // 1. Concatenamos nombres y apellidos con un espacio en medio
                $query->whereRaw("CONCAT(nombres_empleado, ' ', apellidos_empleado) ILIKE ?", ["%{$search}%"])


                    // 2. Mantenemos las búsquedas individuales por codigo
                    ->orWhere('codigo_empleado', 'ILIKE', "%{$search}%");
            })->get();
            return ApiResponse::success('Resultados de búsqueda', 200, EmpleadoResource::collection($empleados));
        } catch (\Exception $ex) {
            return ApiResponse::error('Error al buscar', 500, $ex->getMessage());
        }
    }
    public function getSastres()
    {
        try {
            $empleado = Empleado::where('tipo_empleado', 'Sastre')->where('visibilidad_empleado', true)->get();
            if ($empleado->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200,
                    'data' => []
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
}
