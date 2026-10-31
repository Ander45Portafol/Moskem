<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\DetalleRenta;
use App\Models\Producto;
use App\Models\Renta;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DetalleRentaController extends Controller
{
    public function cargarDetalleRenta( int $id_renta){
        try {
            $detalle_rentas=DetalleRenta::with('producto')->where('id_renta',$id_renta)->get();
            if ($detalle_rentas->isEmpty()) {
                return response()->json([
                    'message' => 'No existen registros',
                    'code' => 200,
                    'data' => []
                ], 200);
            }
            return ApiResponse::success('¡Éxito!', 200, $detalle_rentas);
        } catch (Exception $ex) {
            return ApiResponse::error('Error al listar los productos', 500, $ex->getMessage());
        } catch (\Throwable $to) {
            return ApiResponse::error('Error inesperado al listar los productos', 500, $to->getMessage());
        }
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_renta' => 'required|integer|exists:rentas,id_renta',
            'tipo_traje' => 'nullable|in:Traje Formal,Traje Smoking',
            'detalles' => 'required|array|min:1',
            'detalles.*.id_detalle_renta' => 'nullable|integer|exists:detalle_rentas,id_detalle_renta|distinct',
            'detalles.*.id_producto' => 'required|integer|exists:productos,id_producto',
        ]);

        $renta = Renta::findOrFail($validated['id_renta']);

        if (
            array_key_exists('tipo_traje', $validated) &&
            $renta->tipo_paquete !== 'Paquete Full'
        ) {
            return ApiResponse::error(
                'El tipo de traje solo aplica al paquete Full.',
                422,
                ['tipo_traje' => $validated['tipo_traje']]
            );
        }

        $existentes = DetalleRenta::where('id_renta', $renta->id_renta)
            ->get()
            ->keyBy('id_detalle_renta');

        $tipoTraje = $validated['tipo_traje'] ?? $renta->tipo_traje;
        $limite = match ($renta->tipo_paquete) {
            'Saco y Pantalón' => 2,
            'Paquete Full' => $tipoTraje === 'Traje Formal' ? 4 : 6,
            default => null,
        };

        $idsEnviados = collect($validated['detalles'])
            ->pluck('id_detalle_renta')
            ->filter();

        // 1. Validar pertenecía de IDs
        foreach ($idsEnviados as $idDetalle) {
            if (!$existentes->has($idDetalle)) {
                return ApiResponse::error(
                    'El detalle seleccionado no pertenece a esta renta.',
                    422,
                    ['id_detalle_renta' => $idDetalle]
                );
            }
        }

        // 2. Validar límite máximo de prendas
        if ($limite !== null) {
            $existentesSinModificar = $existentes
                ->except($idsEnviados->all())
                ->count();
            $totalResultante = $existentesSinModificar + count($validated['detalles']);

            if ($totalResultante > $limite) {
                return ApiResponse::error(
                    "El paquete {$renta->tipo_paquete} permite un máximo de {$limite} prendas.",
                    422,
                    ['limite' => $limite]
                );
            }
        }

        // 3. Validar reglas de "Saco y Pantalón"
        if ($renta->tipo_paquete === 'Saco y Pantalón') {
            $tipoProductoNormalizado = fn($tipo) => Str::lower(Str::ascii($tipo ?? ''));

            // Obtener todos los IDs de productos involucrados
            $productosIds = $existentes->pluck('id_producto')
                ->merge(collect($validated['detalles'])->pluck('id_producto'))
                ->unique();

            $tiposPorProducto = Producto::whereIn('id_producto', $productosIds)
                ->pluck('tipo_producto', 'id_producto');

            // Construir mapa interactivo de id_detalle_renta => id_producto
            $mapaResultante = $existentes->pluck('id_producto', 'id_detalle_renta')->all();
            $nuevosProductos = [];

            foreach ($validated['detalles'] as $detalle) {
                $idDetalle = $detalle['id_detalle_renta'] ?? null;
                $tipoProducto = $tipoProductoNormalizado(
                    $tiposPorProducto->get($detalle['id_producto'])
                );

                if (!in_array($tipoProducto, ['saco', 'pantalon'], true)) {
                    return ApiResponse::error(
                        'Para el paquete Saco y Pantalón solo se permiten productos de esos tipos.',
                        422,
                        ['tipo_producto' => $tipoProducto]
                    );
                }

                if ($idDetalle) {
                    $mapaResultante[$idDetalle] = $detalle['id_producto'];
                } else {
                    $nuevosProductos[] = $detalle['id_producto'];
                }
            }

            // Evaluar tipos resultantes reales
            $todosLosProductos = array_merge(array_values($mapaResultante), $nuevosProductos);
            $tiposResultantes = collect($todosLosProductos)->map(
                fn($idProd) => $tipoProductoNormalizado($tiposPorProducto->get($idProd))
            );

            $cantidadSacos = $tiposResultantes->filter(fn($t) => $t === 'saco')->count();
            $cantidadPantalones = $tiposResultantes->filter(fn($t) => $t === 'pantalon')->count();

            // Si intenta guardar un pantalón nuevo y el estado resultante no tiene Saco
            if ($cantidadPantalones > 0 && $cantidadSacos === 0) {
                return ApiResponse::error(
                    'Primero debes guardar un producto de tipo Saco.',
                    422,
                    ['tipo_producto' => 'Saco']
                );
            }

            if ($cantidadSacos > 1 || $cantidadPantalones > 1) {
                return ApiResponse::error(
                    'La renta solo puede contener un Saco y un Pantalón.',
                    422,
                    ['orden' => ['Saco', 'Pantalón']]
                );
            }
        }

        // 4. Validar la composición ordenada de "Paquete Full"
        if ($renta->tipo_paquete === 'Paquete Full') {
            $tipoNormalizado = fn($tipo) => Str::lower(Str::ascii($tipo ?? ''));
            $productosIds = $existentes->pluck('id_producto')
                ->merge(collect($validated['detalles'])->pluck('id_producto'))
                ->unique();
            $productosPorId = Producto::whereIn('id_producto', $productosIds)
                ->get(['id_producto', 'tipo_producto', 'categoria_producto'])
                ->keyBy('id_producto');

            $mapaResultante = $existentes->pluck('id_producto', 'id_detalle_renta')->all();
            $nuevosProductos = [];

            foreach ($validated['detalles'] as $detalle) {
                $idDetalle = $detalle['id_detalle_renta'] ?? null;
                if ($idDetalle) {
                    $mapaResultante[$idDetalle] = $detalle['id_producto'];
                } else {
                    $nuevosProductos[] = $detalle['id_producto'];
                }
            }

            $composicion = collect(array_merge(array_values($mapaResultante), $nuevosProductos))
                ->map(function ($idProducto) use ($productosPorId, $tipoNormalizado) {
                    $producto = $productosPorId->get($idProducto);
                    $tipo = $tipoNormalizado($producto?->tipo_producto);
                    $categoria = $tipoNormalizado($producto?->categoria_producto);

                    if (in_array($tipo, ['saco', 'pantalon', 'camisa'], true)) {
                        return $tipo;
                    }

                    return $categoria === 'accesorios' ? 'accesorio' : 'invalido';
                });

            $tiposPermitidos = ['saco', 'pantalon', 'camisa', 'accesorio'];
            if ($composicion->contains(fn($tipo) => !in_array($tipo, $tiposPermitidos, true))) {
                return ApiResponse::error(
                    'Paquete Full solo permite Saco, Pantalón, Camisa y productos de la categoría Accesorios.',
                    422,
                    ['orden' => ['Saco', 'Pantalón', 'Camisa', 'Accesorios']]
                );
            }

            $cantidadSacos = $composicion->filter(fn($tipo) => $tipo === 'saco')->count();
            $cantidadPantalones = $composicion->filter(fn($tipo) => $tipo === 'pantalon')->count();
            $cantidadCamisas = $composicion->filter(fn($tipo) => $tipo === 'camisa')->count();
            $cantidadAccesorios = $composicion->filter(fn($tipo) => $tipo === 'accesorio')->count();

            if ($cantidadSacos > 1 || $cantidadPantalones > 1 || $cantidadCamisas > 1) {
                return ApiResponse::error(
                    'Paquete Full solo permite un Saco, un Pantalón y una Camisa.',
                    422,
                    ['orden' => ['Saco', 'Pantalón', 'Camisa']]
                );
            }

            if ($cantidadPantalones > 0 && $cantidadSacos === 0) {
                return ApiResponse::error(
                    'Primero debes guardar un producto de tipo Saco.',
                    422,
                    ['tipo_producto' => 'Saco']
                );
            }

            if ($cantidadCamisas > 0 && ($cantidadSacos === 0 || $cantidadPantalones === 0)) {
                return ApiResponse::error(
                    'Primero debes guardar el Saco y el Pantalón antes de la Camisa.',
                    422,
                    ['orden' => ['Saco', 'Pantalón', 'Camisa']]
                );
            }

            if ($cantidadAccesorios > 0 && $cantidadCamisas === 0) {
                return ApiResponse::error(
                    'Primero debes guardar la Camisa antes de agregar accesorios.',
                    422,
                    ['tipo_producto' => 'Camisa']
                );
            }
        }

        // 5. Procesar en transacción DB
        $idsGuardados = DB::transaction(function () use ($validated, $renta, $existentes, $tipoTraje) {
            if (array_key_exists('tipo_traje', $validated)) {
                $renta->tipo_traje = $tipoTraje;
                $renta->save();
            }

            $ids = [];

            foreach ($validated['detalles'] as $detalle) {
                $idDetalle = $detalle['id_detalle_renta'] ?? null;

                if ($idDetalle) {
                    $registro = $existentes->get($idDetalle);
                    $registro->update(['id_producto' => $detalle['id_producto']]);
                } else {
                    $registro = DetalleRenta::create([
                        'id_renta' => $renta->id_renta,
                        'id_producto' => $detalle['id_producto'],
                        'cantidad' => 1,
                        'fecha_renta' => $renta->fecha_inicio,
                        'estado_producto_renta' => 'Solicitado',
                    ]);
                }

                $ids[] = $registro->id_detalle_renta;
            }

            return $ids;
        });

        // 6. Consulta unificada y retorno
        $todosLosDetalles = DetalleRenta::with('producto')
            ->where('id_renta', $renta->id_renta)
            ->get();

        $guardados = collect($idsGuardados)
            ->map(fn($id) => $todosLosDetalles->firstWhere('id_detalle_renta', $id))
            ->values();

        return ApiResponse::success(
            'Prendas guardadas correctamente',
            200,
            ['saved' => $guardados, 'details' => $todosLosDetalles]
        );
    }
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id_detalle_renta' => 'required|integer|exists:detalle_rentas,id_detalle_renta',
            'id_medidas' => 'required|integer|exists:medidas,id_medidas',
        ]);

        try {
            $detalleRenta = DetalleRenta::findOrFail($validated['id_detalle_renta']);
            $detalleRenta->update([
                'id_medidas' => $validated['id_medidas'],
            ]);

            return ApiResponse::success(
                'Detalle de renta actualizado con éxito',
                200,
                $detalleRenta
            );
        } catch (ModelNotFoundException $me) {
            return ApiResponse::error('No se encontró el detalle', 404, $me->getMessage());
        } catch (Exception $ex) {
            return ApiResponse::error('Error al intentar actualizar el registro', 500, $ex->getMessage());
        }
    }
}
