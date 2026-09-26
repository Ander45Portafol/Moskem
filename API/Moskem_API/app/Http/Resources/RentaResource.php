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
        return [
            'id_detalle_renta'=>$this->id_detalle_renta,
            'id_renta'          => $this->id_renta,
            'nombre_completo_cliente'=> $this->renta->clientes->nombres_cliente." ". $this->renta->clientes->apellidos_cliente,
            'fecha_inicio'      => $this->renta->fecha_inicio,
            'estado_renta'      => $this->renta->estado_renta,
            'fecha_devolucion'  => $this->renta->fecha_devolucion,
            'producto'=> $this->producto
        ];
    }
}
