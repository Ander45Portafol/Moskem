<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerceriaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'tipo'=>$this->tipo_merceria,
            'stock'=>$this->stock,
            'color'=>$this->color,
            'tamanio'=>$this->tamanio_merceria,
            'proveedor'=>$this->proveedor->nombre_proveedor,
        ];
    }
}