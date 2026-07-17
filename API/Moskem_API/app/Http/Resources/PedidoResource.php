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
        return[
            'id'=>$this->id_pedido,
            'cliente'=>$this->cliente->nombres_cliente.' '.$this->cliente->apellidos_cliente,
            'cantidad_total'=>$this->costo_total,
            'anticipo'=>$this->anticipo,
            'restante'=>$this->restante,
            'fecha_entrega'=>$this->fecha_entrega,
            'estado_pedido'=>$this->estado_pedido,
            'tipo_pedido' => $this->whenLoaded('detalle_pedidos', function () {
                return $this->detalle_pedido->tipo_pedido;
            }),
        ];
    }
}
