<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrdenTrabajoRequest;
use App\Http\Responses\ApiResponse;
use App\Models\OrdenTrabajo;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrdenTrabajoController extends Controller
{
    //
    public function cargarMedidas($id_cliente, $prenda)
    {
        try {
            $resultados = DB::table('medidas as e')
                ->join('orden_trabajos as a', 'a.id_medidas', '=', 'e.id_medidas')
                ->join('detalle_pedidos as b', 'a.id_detalle_pedido', '=', 'b.id_detalle_pedido')
                ->join('pedidos as c', 'c.id_pedido', '=', 'b.id_pedido')
                ->join('clientes as d', 'd.id_cliente', '=', 'c.id_cliente')
                ->where('b.prenda', $prenda)
                ->where('d.id_cliente', $id_cliente)
                ->whereNotNull('e.codigo_medida') // Evita nulos en la lista
                ->select('e.id_medidas', 'e.codigo_medida', 'e.cintura', 'e.cadera', 'e.largo_pant', 'e.rodilla', 'e.campana', 'e.tiro', 'e.muslo')
                ->distinct() // Evita duplicados si la medida se usó en más de un pedido
                ->get();
            if (!$resultados) {
                return ApiResponse::success('las medidas guardas para el cliente no se pueden acceder', 200, response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]));
            } else {
                return ApiResponse::success('Si se encontraron medidas para la prenda', 200, $resultados);
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        }
    }
    public function getMedida($idDetallePedido)
    {
        try {
            $ordenes = OrdenTrabajo::where('id_detalle_pedido', $idDetallePedido)
                ->with(['medida'])
                ->get();
            if (!$ordenes) {
                return ApiResponse::success('las medidas guardas para el cliente no se pueden acceder', 200, response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]));
            } else {
                return ApiResponse::success('Si se encontraron medidas para la prenda', 200, $ordenes);
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        }
    }
    public function cargarOrdenes($id_pedido)
    {
        try {
            $ordenes = OrdenTrabajo::query()
                ->select('orden_trabajos.*', 'pedidos.id_cliente')
                ->join('detalle_pedidos', 'orden_trabajos.id_detalle_pedido', '=', 'detalle_pedidos.id_detalle_pedido')
                ->join('pedidos', 'detalle_pedidos.id_pedido', '=', 'pedidos.id_pedido')
                ->where('detalle_pedidos.id_pedido', $id_pedido)
                ->get();
            if (!$ordenes) {
                return ApiResponse::success('No se encontraron ordenes de trabajo relacionadas a este pedido', 200, response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]));
            } else {
                return ApiResponse::success('Si se encontraron medidas para la prenda', 200, $ordenes);
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        }
    }
    public function index()
    {
        try {
            $orden_trabajo = OrdenTrabajo::from('orden_trabajos as a')
                ->join('detalle_pedidos as b', 'a.id_detalle_pedido', '=', 'b.id_detalle_pedido')
                ->join('pedidos as c', 'b.id_pedido', '=', 'c.id_pedido')
                ->join('empleados as d', 'a.id_empleado', '=', 'd.id_empleado')
                ->select(
                    'b.prenda',
                    'a.fecha_asignacion',
                    'c.fecha_tallaje1',
                    'b.id_pedido',
                    'd.codigo_empleado',
                    'a.estado_orden',
                    'a.id_medidas',
                    'c.id_cliente',
                    'a.id_orden'
                )
                ->get();
            if ($orden_trabajo->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200
                ]);
            } else {
                return ApiResponse::success('¡Exito!', 201, $orden_trabajo);
            }
        } catch (Exception $ex) {
            return ApiResponse::error('Error', 500, $ex->getMessage());
        }
    }
    public function show(int $id)
    {
        try {
            $ordentrabajo = OrdenTrabajo::findOrFail($id);
            return ApiResponse::success('Orden de trabajo encontrado correctamente', 200, $ordentrabajo);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('Error al intentar buscar el registro', 404, $me->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('No se pudo realizar la acción', 500, $e->getMessage());
        }
    }
    public function store(OrdenTrabajoRequest $request)
    {
        try {
            $validate = $request->validated();
            $validate['visibilidad_ordentrabajo'] = true;

            // 1. Crear la orden excluyendo el campo de la imagen
            $ordentrabajo = OrdenTrabajo::create(collect($validate)->except('imagen_diseño')->toArray());

            // 2. Si viene una imagen adjunta, guardarla en storage/app/public/disenos
            if ($request->hasFile('imagen_diseño')) {
                $path = $request->file('imagen_diseño')->store('disenos', 'public');
                $ordentrabajo->imagen_diseño = $path;
                $ordentrabajo->save();
            }

            return ApiResponse::success('La orden de trabajo fue creada con exito', 200, $ordentrabajo);
        } catch (\Throwable $th) {
            return ApiResponse::error('Hay un problema con el proceso para crear', 504, $th->getMessage());
        } catch (Exception $e) {
            return ApiResponse::error('Error al intentar guardar el registro', 500, $e->getMessage());
        }
    }

    public function update(OrdenTrabajoRequest $request, int $id)
    {
        try {
            $ordentrabajo = OrdenTrabajo::findOrFail($id);
            $validaciones = $request->validated();

            // 1. Actualizar los campos regulares excluyendo la imagen
            $ordentrabajo->update(collect($validaciones)->except('imagen_diseño')->toArray());

            // 2. Procesar la nueva imagen si se seleccionó un archivo nuevo desde la PC
            if ($request->hasFile('imagen_diseño') && $request->file('imagen_diseño')->isValid()) {
                if ($ordentrabajo->imagen_diseño && Storage::disk('public')->exists($ordentrabajo->imagen_diseño)) {
                    Storage::disk('public')->delete($ordentrabajo->imagen_diseño);
                }

                $path = $request->file('imagen_diseño')->store('disenos', 'public');
                $ordentrabajo->imagen_diseño = $path;
                $ordentrabajo->save();
            }

            return ApiResponse::success('Orden de trabajo actualizada con éxito', 200, $ordentrabajo);
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontró la orden', 404, $me->getMessage());
        } catch (ValidationException $ve) {
            return ApiResponse::error('Error en validaciones', 422, $ve->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
    public function destroy(int $id)
    {
        try {
            $ordentrabajo = OrdenTrabajo::findOrFail($id);
            $ordentrabajo->visibilidad_ordentrabajo = false;
            $ordentrabajo->save();
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('El pedido seleccionado no existe', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al eliminar', 500, $ex->getMessage());
        }
    }
    public function showByDetalle($id_detalle_pedido)
    {
        try {
            // Cargar la orden con la relación 'medida' mediante Eloquent
            $orden = OrdenTrabajo::with('medida')
                ->where('id_detalle_pedido', $id_detalle_pedido)
                ->first();

            if (!$orden) {
                return response()->json([
                    'success' => false,
                    'message' => 'No existe orden para este detalle'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $orden
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage()
            ], 500);
        }
    }
}
