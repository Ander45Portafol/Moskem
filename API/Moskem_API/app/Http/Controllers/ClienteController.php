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
    public function index(): JsonResponse
    {
        try {
            $cliente = Cliente::where('visibilidad_cliente', true)->orderBy("nombres_cliente")->get();
            if ($cliente->isEmpty()) {
                return response()->json('No existen registros');
            } else {
                return ApiResponse::success('¡Exito!', 200, ClienteResource::collection($cliente));
            }
        } catch (Throwable $to) {
            return ApiResponse::error('Error', 500, $to->getMessage());
        }
    }
    public function store(ClienteRequest $request): JsonResponse
    {
        try {
            $validate = $request->validated();
            $validate['visibilidad_cliente']=true;
            $client = Cliente::create($validate);
            $membresia = $client->tipo_membresia;
            if ($membresia === 'Platinum') {
                $añoActual = now()->format('y'); // Obtiene "26" (por el año 2026)

                // Rellenamos el ID con ceros a la izquierda hasta completar 6 dígitos
                $idConCeros = str_pad($client->id_cliente, 6, '0', STR_PAD_LEFT);

                // Asignamos el formato final al campo 'codigo' (asumiendo que se llama 'codigo')
                $client->codigo_membresia = 'PT' . $añoActual . $idConCeros; // Resultado: PT26000001

                // Guardamos el cambio en la base de datos
                $client->save();
            } else if ($membresia === 'Elite') {
                $añoActual = now()->format('y'); // Obtiene "26" (por el año 2026)

                // Rellenamos el ID con ceros a la izquierda hasta completar 6 dígitos
                $idConCeros = str_pad($client->id_cliente, 6, '0', STR_PAD_LEFT);

                // Asignamos el formato final al campo 'codigo' (asumiendo que se llama 'codigo')
                $client->codigo_membresia = 'EL' . $añoActual . $idConCeros; // Resultado: El26000001

                // Guardamos el cambio en la base de datos
                $client->save();
            } else {
                $client->codigo_membresia = null;
                $client->save();
            }
            //Guardamos el proceso, para hacer efectiva la actualización del estado
            return ApiResponse::success('Cliente creado con exito', 200, new ClienteResource($client));
        } catch (Exception $ex) {
            return ApiResponse::error('Error a intentar guardar el registro', 500, $ex->getMessage());
        }
    }
    public function show($id): JsonResponse
    {
        try {
            $client = Cliente::findOrFail($id);
            return ApiResponse::success('Cliente encontrado correctamente', 200, $client);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }
    public function update(ClienteRequest $request, $id_cliente): JsonResponse
    {
        try {
            $client = Cliente::findOrFail($id_cliente);
            $validaciones = $request->validated();
            if ($client->tipo_membresia != $validaciones->tipo_membresia) {
                if ($validaciones->tipo_membresia === 'Platinum') {
                    $añoActual = now()->format('y'); // Obtiene "26" (por el año 2026)

                    // Rellenamos el ID con ceros a la izquierda hasta completar 6 dígitos
                    $idConCeros = str_pad($validaciones->id_cliente, 6, '0', STR_PAD_LEFT);

                    // Asignamos el formato final al campo 'codigo' (asumiendo que se llama 'codigo')
                    $validaciones->codigo_membresia = 'PT' . $añoActual . $idConCeros; // Resultado: PT26000001

                } else if ($validaciones->tipo_membresia  === 'Elite') {
                    $añoActual = now()->format('y'); // Obtiene "26" (por el año 2026)

                    // Rellenamos el ID con ceros a la izquierda hasta completar 6 dígitos
                    $idConCeros = str_pad($validaciones->id_cliente, 6, '0', STR_PAD_LEFT);

                    // Asignamos el formato final al campo 'codigo' (asumiendo que se llama 'codigo')
                    $validaciones->codigo_membresia = 'EL' . $añoActual . $idConCeros; // Resultado: El26000001
                } else {
                    $validaciones->codigo_membresia = null;
                }
                $client->save($validaciones);
            }
            return ApiResponse::success('Cliente actualizado con exito', 200, new ClienteResource($client));
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intenttar actualizar el regsitro', 500, $ex->getMessage());
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontro al cliente', 404, $me->getMessage());
        } catch (ValidationException $ve) {
            return ApiResponse::error('Error en validaciones', 422, $ve->getMessage());
        }
    }
    public function destroy($id_cliente)
    {
        try {
            $client = Cliente::findOrFail($id_cliente);
            //No se elimina el registro, solo se cambia el estado a false para siempre mantener un control de todos los usuarios que se tendrán en el sistema
            $client->visibilidad_cliente = false;
            //Guardamos el proceso, para hacer efectiva la actualización del estado
            $client->save();
            return ApiResponse::success('Cliente eliminado con exito', 200);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('El cliente seleccionado no existe', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al eliminar', 500, $ex->getMessage());
        }
    }
}
