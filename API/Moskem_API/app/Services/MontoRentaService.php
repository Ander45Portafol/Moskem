<?php

namespace App\Services;

use App\Models\DetalleRenta;
use App\Models\Renta;

class MontoRentaService
{
    public function calcular(Renta $renta): float
    {
        $detalles = DetalleRenta::query()
            ->with('producto:id_producto,costo')
            ->where('id_renta', $renta->id_renta)
            ->orderBy('id_detalle_renta')
            ->get();

        $costosEnCentavos = $detalles->map(function (DetalleRenta $detalle): int {
            $costoUnitario = (float) ($detalle->producto?->costo ?? 0);
            $cantidad = max(1, (int) ($detalle->cantidad ?? 1));

            return (int) round($costoUnitario * $cantidad * 100);
        })->values();

        if ($renta->tipo_paquete === 'Prenda') {
            return round($costosEnCentavos->sum() / 100, 2);
        }

        [$precioBase, $prendasIncluidas] = match ($renta->tipo_paquete) {
            'Saco y Pantalón' => [12000, 2],
            'Paquete Full' => [18000, 4],
            default => [0, 0],
        };

        $costoExtras = $costosEnCentavos
            ->slice($prendasIncluidas)
            ->sum();

        return round(($precioBase + $costoExtras) / 100, 2);
    }
}
