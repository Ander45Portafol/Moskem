<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class DetallePedidoRequest extends FormRequest
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
            //
            'id_pedido'=>'required',
            'id_tela'=>'required',
            'id_empleado'=>'required',
            'id_paquete'=>'required',
            'tipo_entalle'=>'required|string',
            'evento_traje'=>'required|date',
        ];
    }
    public function messages()
    {
        return [
            'id_pedido.required'=>'No se pudo encontrar el pedido seleccionado',
            'id_tela.required' => 'No se pudo encontrar la tela selecccionada',
            'id_empleado.required' => 'No se pudo encontrar el empelado seleccionado',
            'id_paquete.required' => 'No se pudo encontrar el paquete seleccionado',
            'tipo_entalle.required'=>'Debe seleccionar un tipo de entalle para el pedido',
            'tipo_entalle.string'=>'El tipo de entalle no cumple con el formato correcto',
            'evento_traje.required'=>'Debe seleccionar la fecha del evento al que ocupará el traje',
            'evento_traje.date'=>'EL formato para la fecha del evento no es el correcto'
        ];
    }
}
