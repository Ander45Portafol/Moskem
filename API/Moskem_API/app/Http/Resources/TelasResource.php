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
            'id'=>$this->id_tela,
            'codigo'=>$this->codigo_tela,
            'color'=>$this->color_tela,
            'cantidad'=>$this->cantidad_stock,
            'categoria'=>$this->categoria_tela,
            'proveedor'=>$this->proveedor->nombre_proveedor,
            'imagen_telas'=>$this->imagen_telas,
            'fecha_ingreso' => $this->fecha_ingreso_tela?->format('d/m/Y'),
            'codigo_proveedor'=>$this->codigo_tela_proveedor,
        ];
    }
}  
