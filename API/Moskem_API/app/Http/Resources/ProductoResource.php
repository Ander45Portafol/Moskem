<?php

namespace App\Http\Resources;

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
            'id_producto'          => $this->id_producto,
            'tipo_producto'        => $this->tipo_producto,
            'codigo_producto'      => $this->codigo_producto,
            'imagen_producto'      => $this->imagen_producto 
                                        ? asset('storage/' . $this->imagen_producto) 
                                        : null,
            // Si tiene tela asignada, podemos tomar el color de la tela; si no (ej. Zapatos), tomamos $this->color
            'color'                => $this->id_tela && $this->relationLoaded('tela') 
                                        ? ($this->tela->color_tela ?? $this->color) 
                                        : $this->color,
            'talla'                => $this->talla,
            'costo'                => $this->costo,
            'descripcion_producto' => $this->descripcion_producto,
            'estado_producto'      => $this->estado_producto,
            'visibilidad_producto' => $this->visibilidad_producto,
            
            // Datos de la relación Tela (null en caso de Zapatos)
            'id_tela'              => $this->id_tela,
            'tela'                 => $this->whenLoaded('tela', function () {
                return $this->tela ? [
                    'id_tela'     => $this->tela->id_tela,
                    'nombre_tela' => $this->tela->nombre_tela ?? $this->tela->color_tela ?? null,
                    'codigo_tela' => $this->tela->codigo_tela ?? null,
                ] : null;
            }),
        ];
    }
}