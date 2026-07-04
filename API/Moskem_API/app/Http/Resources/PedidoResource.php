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
            'tipo_pedido'=>$this->tipo_pedido,
            'cantidad_total'=>$this->costo_total,
            'anticipo'=>$this->anticipo,
            'restante'=>$this->restante
        ];
    }
}
