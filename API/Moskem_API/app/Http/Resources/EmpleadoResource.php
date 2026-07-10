<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmpleadoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id'=>$this->id_empleado,
            'nombres'=>$this->nombres_empleado,'apellidos'=>$this->apellidos_empleado,
            'tipo_empleado'=>$this->tipo_empleado,
            'codigo_empleado'=>$this->codigo_empleado,
            'estado_empleado'=>$this->estado_empleado
        ];
    }
}
