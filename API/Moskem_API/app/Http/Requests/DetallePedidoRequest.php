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
            'tipo_pedido'=>'required',
            'numero_pedido'=>'required',
            'categoria_pedido'=>'required',
            'precio_detalle'=>'required',
            'prenda'=>'required'
        ];
    }
    public function messages()
    {
        return [
            'id_pedido.required'=>'No se pudo encontrar el pedido seleccionado',
            'id_tela.required' => 'No se pudo encontrar la tela selecccionada',
            'id_empleado.required' => 'No se pudo encontrar el empelado seleccionado',
            'id_paquete.required' => 'No se pudo encontrar el paquete seleccionado',
        ];
    }
}
