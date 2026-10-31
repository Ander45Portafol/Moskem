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
        $cliente = $this->cliente;

        return [
            'id_renta' => $this->id_renta,
            'id_cliente' => $this->id_cliente,
            'nombre_completo_cliente' => trim(
                ($cliente?->nombres_cliente ?? '') . ' ' .
                ($cliente?->apellidos_cliente ?? '')
            ),
            'fecha_inicio' => $this->fecha_inicio,
            'fecha_evento' => $this->fecha_evento,
            'fecha_devolucion' => $this->fecha_devolucion,
            'estado_renta' => $this->estado_renta,
            'tipo_paquete' => $this->tipo_paquete,
            'tipo_traje' => $this->tipo_traje,
            'monto_total' => $this->monto_total,
            'deposito' => $this->deposito,
            'notas_descripcion' => $this->notas_descripcion,
        ];
    }
}
