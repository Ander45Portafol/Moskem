<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class OrdenTrabajoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_detalle_pedido'=>'required|integer',
            'id_empleado'=>'required|integer',
            'id_medidas'=>'required|required',
            'fecha_asignacion'=>'required|date',
            'estado_orden'=>'required',
            'tiempo_sastre'=>'required'
        ];
    }
}
