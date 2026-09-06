<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class ProductoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_producto'=>$this->id_producto,
            'tipo_producto'=>$this->tipo_producto,
            'color'=>$this->color,
            'talla'=>$this->tamanio_producto,
            'id_tela'=>$this->id_tela,
            'estado_producto'=>$this->estado_producto,
        ];
    }
}