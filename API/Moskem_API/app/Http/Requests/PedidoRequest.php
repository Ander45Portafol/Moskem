<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PedidoRequest extends FormRequest
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
            'cantidad_pedido'=>'required|integer',
            'tipo_pedido'=>'required',
            'estado_pedido'=>'required',
            'nota_pedido'=>'string',
            'anticipo'=>'required|decimal:0,2',
            'costo_total'=>'required|decimal:0,2',
            'restante'=>'required|decimal:0,2',
            'fecha_tallaje1'=>'required|date',
            'fecha_tallaje2'=>'required|date',
            'fecha_entrega'=>'required|date'
        ];
    }
    public function messages(){
        return[
            'id_cliente.required'=>'Es obligatorio que se defina el cliente del pedido',
            'id_cliente.integer'=>'No se pudo encontrar el cliente',
            'cantidad_pedido.required'=>'Debe colocar la cantidad del pedido',
            'cantidad_pedido.integer'=>'No es el formato correcto para la cantidad del pedido',
            'tipo_pedido.required'=>'Debe seleccionar una opción para el tipo de pedido',
            'estado_pedido.required'=>'Debe seleccionar una opción para el estado del pedido',
            'nota_pedido.string'=>'No es el formato correcto para la nota',
            'anticipo.required'=>'Debe ingresar el anticipo para el pedido',
            'anticipo.decimal'=>'Debe colocar el formato correcto para el anticipo',
            'costo_total.required' => 'Debe ingresar el costo total para el pedido',
            'costo_total.decimal' => 'Debe colocar el formato correcto para el costo total',
            'restante.required' => 'Debe ingresar el restante para el pedido',
            'restante.decimal' => 'Debe colocar el formato correcto para el restante',
            'fecha_tallaje1.required'=>'Debe colocar una fecha para el primer tallaje',
            'fecha_tallaje1.date'=>'El registro no cumple con el formato correcto para las fechas',
            'fecha_tallaje2.required' => 'Debe colocar una fecha para el primer tallaje',
            'fecha_tallaje2.date' => 'El registro no cumple con el formato correcto para las fechas',
            'fecha_entrega.required' => 'Debe colocar una fecha para el segundo tallaje',
            'fecha_entrega.date' => 'El registro no cumple con el formato correcto para las fechas'
        ];
    }
}
