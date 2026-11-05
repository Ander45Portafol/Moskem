<?php

namespace App\Services;

use App\Models\DetalleRenta;
use App\Models\Producto;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class EstadoProductoRentaService
{
    /**
     * Actualiza los productos según las fechas de sus rentas.
     * Una renta creada cuyo inicio está a más de tres días pone sus productos en Ajuste.
     * Un producto permanece Rentado hasta que cumple tres días desde su devolución.
     * Una renta próxima (en los siguientes tres días) también mantiene el producto Rentado.
     *
     * @return array{ajuste: int, rentado: int, lavanderia: int}
     */
    public function actualizarEstados(?Carbon $fechaActual = null): array
    {
        $ahora = ($fechaActual ?? now())->copy();
        $hoy = $ahora->copy()->startOfDay();
        $limiteInicio = $hoy->copy()->addDays(3)->toDateString();
        $limiteDevolucion = $hoy->copy()->subDays(3)->toDateString();

        return DB::transaction(function () use ($ahora, $limiteInicio, $limiteDevolucion): array {
            $productosRentados = DetalleRenta::query()
                ->whereNotNull('id_producto')
                ->whereHas('renta', function ($query) use ($limiteInicio, $limiteDevolucion): void {
                    $query->where('visibilidad_renta', true)
                        ->whereDate('fecha_inicio', '<=', $limiteInicio)
                        ->whereDate('fecha_devolucion', '>', $limiteDevolucion);
                })
                ->distinct()
                ->pluck('id_producto');

            $productosEnAjuste = DetalleRenta::query()
                ->whereNotNull('id_producto')
                ->whereHas('renta', function ($query) use ($ahora, $limiteInicio): void {
                    $query->where('visibilidad_renta', true)
                        ->where('created_at', '<=', $ahora)
                        ->whereDate('fecha_inicio', '>', $limiteInicio);
                })
                ->distinct()
                ->pluck('id_producto')
                ->diff($productosRentados)
                ->values();

            $productosParaLavanderia = DetalleRenta::query()
                ->whereNotNull('id_producto')
                ->whereHas('renta', function ($query) use ($limiteDevolucion): void {
                    $query->where('visibilidad_renta', true)
                        ->whereDate('fecha_devolucion', '<=', $limiteDevolucion);
                })
                ->distinct()
                ->pluck('id_producto')
                ->diff($productosRentados)
                ->diff($productosEnAjuste)
                ->values();

            $cantidadRentados = $productosRentados->isEmpty()
                ? 0
                : Producto::query()
                    ->whereIn('id_producto', $productosRentados)
                    ->where('estado_producto', '!=', 'Rentado')
                    ->update(['estado_producto' => 'Rentado']);

            $cantidadAjuste = $productosEnAjuste->isEmpty()
                ? 0
                : Producto::query()
                    ->whereIn('id_producto', $productosEnAjuste)
                    ->where('estado_producto', '!=', 'Ajuste')
                    ->update(['estado_producto' => 'Ajuste']);

            $cantidadLavanderia = $productosParaLavanderia->isEmpty()
                ? 0
                : Producto::query()
                    ->whereIn('id_producto', $productosParaLavanderia)
                    ->where('estado_producto', 'Rentado')
                    ->update(['estado_producto' => 'Lavanderia']);

            return [
                'ajuste' => $cantidadAjuste,
                'rentado' => $cantidadRentados,
                'lavanderia' => $cantidadLavanderia,
            ];
        });
    }
}
