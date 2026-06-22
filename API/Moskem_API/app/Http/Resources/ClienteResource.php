<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClienteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    //En esta funcion se moldea la peticion JSON para personalizar que se mostrará al frontend
    public function toArray(Request $request): array
    {
return [
            'nombres' => $this->nombres_cliente,
            'apellidos' => $this->apellidos_cliente,
            'nombre_completo' => "{$this->nombres_cliente} {$this->apellidos_cliente}",
            'tipo_membresia' => $this->tipo_membresia,
            'correo' => $this->correo_electronico,
            'fecha_nacimiento'=>$this->fecha_nacimiento
            // Como cargar las relaciones que tiene esta tabla, no las usaremos solo quedaran como ejemplo por si se utilizan para otra tabla
            /*'rentas' => RentaResource::collection($this->whenLoaded('rentas')),
            'citas' => CitaResource::collection($this->whenLoaded('citas')),*/
        ];
    }
}
