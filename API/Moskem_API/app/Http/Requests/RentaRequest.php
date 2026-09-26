<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class RentaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'fecha_evento'=>'required|date',
            'monto_total'=>'nullable|numeric|min:0',
            'deposito'=>'nullable|numeric|min:0',
            'estado_renta'=>'required',
            'notas_descripcion'=>'nullable|string'
        ];
    }
    public function messages():array
    {
        return [
           'id_cliente.required'=>'Es obligatorio que se defina el cliente de la renta',
           'id_cliente.integer'=>'No se pudo encontrar el cliente',
           'íd_empleado.required'=>'Es obligatorio que se defina el empleado que registro la renta',
           'id.empleado.integer'=>'No se pudo encontrar al empleado',
           'fecha_inicio.required'=>'Debe colocar una fecha de inicio',
           'fecha_inicio.date'=>'El regisitro no cumple con el formato correcto',
            'fecha_evento.required' => 'Debe colocar una fecha del evento',
            'fecha_evento.date' => 'El regisitro no cumple con el formato correcto',
            'fecha_devolucion.required' => 'Debe colocar una fecha de devolucion',
            'fecha_devolucion.date' => 'El regisitro no cumple con el formato correcto',
            'monto_total.numeric'=>'El registro no cumple con el formato correcto',
            'deposito.numeric'=>'El registro no cumple con el formato correcto',
            'estado_renta.required'=>'Debe seleccionar una opcion para el estado de la renta',
            'notas_descripcion.string'=>'El registro no cumple el formato correcto'
        ];
    }
}
