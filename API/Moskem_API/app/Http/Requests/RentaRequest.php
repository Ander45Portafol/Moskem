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
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (!$this->filled('monto_total')) {
            $this->merge(['monto_total' => 0]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_cliente'        => 'required|integer',
            'id_empleado'       => 'required|integer',
            'fecha_inicio'      => 'required|date',
            'fecha_devolucion'  => 'required|date|after_or_equal:fecha_inicio',
            'fecha_evento'      => 'required|date|after_or_equal:fecha_inicio|before_or_equal:fecha_devolucion',
            'monto_total'       => 'nullable|numeric|min:0',
            'deposito'          => 'nullable|numeric|min:0',
            'tipo_paquete'      => 'required',
            'estado_renta'      => 'required',
            'notas_descripcion' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'id_cliente.required'  => 'Es obligatorio que se defina el cliente de la renta',
            'id_cliente.integer'   => 'No se pudo encontrar el cliente',
            'id_empleado.required' => 'Es obligatorio que se defina el empleado que registró la renta',
            'id_empleado.integer'  => 'No se pudo encontrar al empleado',

            'fecha_inicio.required' => 'Debe colocar una fecha de inicio',
            'fecha_inicio.date'     => 'El registro no cumple con el formato correcto',

            'fecha_devolucion.required'       => 'Debe colocar una fecha de devolución',
            'fecha_devolucion.date'           => 'El registro no cumple con el formato correcto',
            'fecha_devolucion.after_or_equal' => 'La fecha de devolución no puede ser anterior a la fecha de inicio',

            'fecha_evento.required'        => 'Debe colocar una fecha del evento',
            'fecha_evento.date'            => 'El registro no cumple con el formato correcto',
            'fecha_evento.after_or_equal'  => 'La fecha del evento debe ser igual o posterior a la fecha de inicio',
            'fecha_evento.before_or_equal' => 'La fecha del evento debe ser igual o anterior a la fecha de devolución',

            'monto_total.numeric' => 'El registro no cumple con el formato correcto',
            'deposito.numeric'    => 'El registro no cumple con el formato correcto',
            'estado_renta.required' => 'Debe seleccionar una opción para el estado de la renta',
            'notas_descripcion.string' => 'El registro no cumple el formato correcto'
        ];
    }
}
