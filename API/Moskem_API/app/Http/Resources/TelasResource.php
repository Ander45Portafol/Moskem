<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TelasResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'codigo'=>$this->codigo_tela,
            'color'=>$this->color,
            'cantidad'=>$this->cantidad_stock,
            'proveedor'=>$this->proveedor->nombre_proveedor,
            'fecha_ingreso'=>$this->created_at,
        ];
    }
}  