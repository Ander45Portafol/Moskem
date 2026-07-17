<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClienteRequest;
use App\Models\Cliente;
use App\Http\Resources\ClienteResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Nette\Schema\ValidationException;
use Throwable;

class ClienteController extends Controller
{
    //Metodo para mostrar todos los registros
    public function index(): JsonResponse
    {
        try {
            $cliente = Cliente::where('visibilidad_cliente', true)->orderBy("nombres_cliente")->get();
            if ($cliente->isEmpty()) {
                return response()->json([
                    'message'=>'No existen registros',
                    'code'=>200,
                    'data'=>[]
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 200, ClienteResource::collection($cliente));
            }
        } catch (Throwable $to) {
            return ApiResponse::error('Error', 500, $to->getMessage());
        }
    }
    //Metodo para el motor de busqueda
    public function search(Request $request){
        try{
            $search = $request->query('q');

            if (empty($search)) {
                $clientes= Cliente::where('visibilidad_cliente', true)->get();
                return ApiResponse::success('Lista de clientes',200,ClienteResource::collection($clientes));
            }
            $search =trim($search);
            $clientes=Cliente::where('visibilidad_cliente', true)->where(function($query)use ($search){
                // 1. Concatenamos nombres y apellidos con un espacio en medio
                $query->whereRaw("CONCAT(nombres_cliente, ' ', apellidos_cliente) ILIKE ?", ["%{$search}%"])


                    // 2. Mantenemos las búsquedas individuales por documento o correo
                    ->orWhere('documento_cliente', 'ILIKE', "%{$search}%");
            })->get();
            return ApiResponse::success('Resultados de búsqueda', 200, ClienteResource::collection($clientes));
        }catch(\Exception $ex){
            return ApiResponse::error('Error al buscar',500,$ex->getMessage());
        }
    }
    //Metodo para crear registros
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
    //Metodo utilizado para cargar un registro en especifico
    public function show($id): JsonResponse
    {
        try {
            $client = Cliente::findOrFail($id);
            return ApiResponse::success('Cliente encontrado correctamente', 200, $client);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        }
    }

    //Metodo utilizado para actualizar registros
    public function update(ClienteRequest $request, $id_cliente): JsonResponse
    {
        try {
            // 1. Buscamos al cliente
            $client = Cliente::findOrFail($id_cliente);

            // 2. Obtenemos las validaciones (es un ARRAY)
            $validaciones = $request->validated();

            // 3. Comparamos usando corchetes ya que es un array
            if ($client->tipo_membresia !== $validaciones['tipo_membresia']) {

                $tipo = $validaciones['tipo_membresia'];

                if ($tipo === 'Platinum' || $tipo === 'Elite') {
                    $prefijo = ($tipo === 'Platinum') ? 'PT' : 'EL';
                    $añoActual = now()->format('y'); // Obtiene "26"

                    // Usamos el ID real del cliente que ya recuperamos de la base de datos
                    $idConCeros = str_pad($client->id_cliente, 6, '0', STR_PAD_LEFT);

                    // Asignamos la nueva propiedad al array
                    $validaciones['codigo_membresia'] = $prefijo . $añoActual . $idConCeros;
                } else {
                    // Si pasa a ser 'Normal', se limpia el código
                    $validaciones['codigo_membresia'] = null;
                }
            }

            // 4. Actualizamos el modelo pasándole el array modificado
            $client->update($validaciones);

            return ApiResponse::success('Cliente actualizado con exito', 200, new ClienteResource($client));
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontro al cliente', 404, $me->getMessage());
        } catch (ValidationException $ve) {
            return ApiResponse::error('Error en validaciones', 422, $ve->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
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
