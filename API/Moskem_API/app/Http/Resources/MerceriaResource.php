<?php

namespace App\Http\Resources;

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
            'id_merceria'=>$this->id_merceria,
            'tipo'=>$this->tipo_merceria,
            'id_proveedor'=>$this->id_proveedor,
            'unidad_medida'=>$this->unidad_medida,
            'codigo'=>$this->codigo_merceria,
            'color'=>$this->color,
            'descripcion'=>$this->descripcion_merceria,
            'tamanio'=>$this->tamanio_merceria,
            'proveedor'=>$this->proveedor->nombre_proveedor,
        ];
    }
} 

                                  