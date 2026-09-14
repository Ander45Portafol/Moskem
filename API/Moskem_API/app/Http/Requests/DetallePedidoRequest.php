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
            'id_pedido'        => 'sometimes|required',
            'id_tela'          => 'sometimes|required',
            'id_empleado'      => 'sometimes|required',
            'tipo_pedido'      => 'sometimes|required',
            'id_paquete'       => 'nullable|integer',
            'cantidad_tela'    => 'nullable|numeric',
            'numero_pedido'    => 'sometimes|required',
            'categoria_pedido' => 'sometimes|required',
            'precio_detalle'   => 'sometimes|required',
            'prenda'           => 'sometimes|required'
        ];
    }
    public function messages()
    {
        return [
            'id_pedido.required' => 'No se pudo encontrar el pedido seleccionado',
            'id_tela.required' => 'No se pudo encontrar la tela selecccionada',
            'id_empleado.required' => 'No se pudo encontrar el empelado seleccionado'
        ];
    }
}
