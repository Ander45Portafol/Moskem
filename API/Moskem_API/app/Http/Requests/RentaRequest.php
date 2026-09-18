<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RentaRequest extends FormRequest
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
            'id_cliente'=>'required|integer',
            'id_empleado'=>'required|integer',
            'fecha_inicio'=>'required|date',
            'fecha_devolucion'=>'required|date',
            'monto_total'=>'nullable|numeric|min:0',
            'deposito'=>'nullable|numeric|min:0',
            'estado_renta'=>'required',
            'notas_descripcion'=>'nullable|string'
        ];
    }
}
