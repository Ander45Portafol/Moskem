<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetallePedidoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'pedido'=>$this->id_pedido,
            'tela'=>$this->id_tela,
            'empleado'=>$this->id_empleado,
            'paquete'=>$this->id_paquete,
            'prenda'=>$this->prenda,
            'fecha_evento'=>$this->fecha_evento
        ];
    }
}
