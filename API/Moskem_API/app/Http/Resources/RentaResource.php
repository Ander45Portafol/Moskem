<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $renta = $this->renta ?? $this;
        $cliente = $renta->cliente;
        return [
            'id_detalle_renta'        => $this->id_detalle_renta ?? null,
            'id_renta'                => $renta->id_renta ?? null,
            'nombre_completo_cliente' => trim(($cliente?->nombres_cliente ?? $cliente?->nombres ?? '') . ' ' . ($cliente?->apellidos_cliente ?? $cliente?->apellidos ?? '')),
            'fecha_inicio'            => $renta->fecha_inicio ?? null,
            'estado_renta'            => $renta->estado_renta ?? null,
            'fecha_devolucion'        => $renta->fecha_devolucion ?? null,
            'producto'                => $this->producto ?? null
        ];
    }
}
