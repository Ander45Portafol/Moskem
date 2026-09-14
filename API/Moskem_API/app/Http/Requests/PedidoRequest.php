<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id_cliente'     => $this->id_cliente ? (int) $this->id_cliente : null,
            'anticipo'       => $this->anticipo !== null && $this->anticipo !== '' ? (float) $this->anticipo : 0,
            'costo_total'    => $this->costo_total !== null && $this->costo_total !== '' ? (float) $this->costo_total : 0,
            'restante'       => $this->restante !== null && $this->restante !== '' ? (float) $this->restante : 0,
            'nota_pedido'    => $this->nota_pedido ?? '',
            'fecha_tallaje1' => $this->fecha_tallaje1 ?: null,
            'fecha_tallaje2' => $this->fecha_tallaje2 ?: null,
            'fecha_entrega'  => $this->fecha_entrega ?: null,
            'evento_traje'   => $this->evento_traje ?: null,
        ]);
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH') || $this->has('_method');

        // Arreglo de validación base según si es actualización o creación
        $requiredRule = $isUpdate ? ['sometimes', 'required'] : ['required'];

        return [
            'id_cliente'        => array_merge($requiredRule, ['integer']),
            'estado_pedido'     => array_merge($requiredRule, ['string']),
            'nota_pedido'       => ['nullable', 'string'],
            'anticipo'          => ['nullable', 'numeric', 'min:0'],
            'costo_total'       => ['nullable', 'numeric', 'min:0'],
            'restante'          => ['nullable', 'numeric', 'min:0'],
            'fecha_tallaje1'    => ['nullable', 'date'],
            'fecha_tallaje2'    => ['nullable', 'date'],
            'fecha_entrega'     => array_merge($requiredRule, ['date']),
            'evento_traje'      => array_merge($requiredRule, ['date']),
            'tipo_evento'       => array_merge($requiredRule, ['string']),
            'tipo_entalle'      => ['nullable', 'string'],
            'imagen_referencia' => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'id_cliente.required'    => 'Es obligatorio que se defina el cliente del pedido',
            'id_cliente.integer'     => 'No se pudo encontrar el cliente',
            'estado_pedido.required' => 'Debe seleccionar una opción para el estado del pedido',
            'nota_pedido.string'     => 'No es el formato correcto para la nota',
            'anticipo.numeric'       => 'Debe colocar el formato correcto para el anticipo',
            'costo_total.numeric'    => 'Debe colocar el formato correcto para el costo total',
            'restante.numeric'       => 'Debe colocar el formato correcto para el restante',
            'fecha_tallaje1.date'    => 'El registro no cumple con el formato correcto para las fechas',
            'fecha_tallaje2.date'    => 'El registro no cumple con el formato correcto para las fechas',
            'fecha_entrega.required' => 'Debe colocar una fecha de entrega',
            'fecha_entrega.date'     => 'El registro no cumple con el formato correcto para las fechas',
            'tipo_evento.required'   => 'Debe seleccionar un tipo de evento',
            'tipo_entalle.required'  => 'Debe seleccionar un tipo de entalle',
            'evento_traje.required'  => 'Debe colocar una fecha para el evento que se utilizará el pedido',
            'evento_traje.date'      => 'El registro no cumple con el formato correcto para las fechas',
        ];
    }
}
