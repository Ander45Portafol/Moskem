<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_pedido'          => $this->id_pedido,
            'id_cliente'         => $this->id_cliente,
            'cliente'            => $this->cliente
                ? "{$this->cliente->nombres_cliente} {$this->cliente->apellidos_cliente}"
                : 'Cliente no asignado',
            'estado_pedido'      => $this->estado_pedido,
            'nota_pedido'        => $this->nota_pedido,
            'imagen_referencia'  => $this->imagen_referencia,
            'evento_traje'       => $this->evento_traje,
            'tipo_entalle'       => $this->tipo_entalle,
            'anticipo'           => $this->anticipo,
            'costo_total'        => $this->costo_total,
            'restante'           => $this->restante,
            'fecha_tallaje1'     => $this->fecha_tallaje1,
            'fecha_tallaje2'     => $this->fecha_tallaje2,
            'fecha_entrega'      => $this->fecha_entrega,
            'detalles'           => $this->detalle_pedido, // Muestra la lista de detalles
            'tipo_evento'        => $this->tipo_evento,
            'visibilidad_pedido' => $this->visibilidad_pedido,
            'created_at'         => $this->created_at,
            'updated_at'         => $this->updated_at,
        ];
    }
}
