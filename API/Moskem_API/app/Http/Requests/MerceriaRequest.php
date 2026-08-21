<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MerceriaRequest extends FormRequest
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
        // Detecta el ID si se trata de una actualización (PUT) para ignorarlo en el UNIQUE
        $id = $this->route('merceria') ?? $this->route('id');

        return [
            'tipo_merceria' => [
                'required',
                'string',
                Rule::in(['Botones', 'Ganchos', 'Zipper', 'Agujas', 'Hilos']),
            ],
            'codigo_merceria' => [
                'required',
                'string',
                'max:14',
                Rule::unique('mercerias', 'codigo_merceria')->ignore($id, 'id_merceria'),
            ],
            'stock' => 'required|integer|min:0',
            'color' => 'required|string|max:30',
            // Cambiado a integer para coincidir con la columna en PostgreSQL
            'tamanio_merceria' => 'required|integer|min:0',
            'id_proveedor' => 'required|integer|exists:proveedores,id_proveedor',
            'codigo_merceria_proveedor' => 'required|string|max:255',
            'unidad_medida' => [
                'required',
                'string',
                Rule::in(['pulgadas', 'mm', '#']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_merceria.required' => 'Debe seleccionar una opción para el tipo de mercería.',
            'tipo_merceria.in' => 'El tipo debe ser: Botones, Ganchos, Zipper, Agujas o Hilos.',
            'codigo_merceria.required' => 'Debe colocar un código para la mercería.',
            'codigo_merceria.string' => 'No es el formato correcto para el código de la mercería.',
            'codigo_merceria.max' => 'El código de mercería no debe exceder los 14 caracteres.',
            'codigo_merceria.unique' => 'Este código de mercería ya está registrado.',
            'stock.required' => 'Debe colocar la cantidad de stock para la mercería.',
            'stock.integer' => 'No es el formato correcto para el stock de la mercería.',
            'color.required' => 'Debe colocar un color para la mercería.',
            'color.string' => 'No es el formato correcto para el color de la mercería.',
            'color.max' => 'El color no puede tener más de 30 caracteres.',
            'tamanio_merceria.required' => 'Debe colocar un tamaño para la mercería.',
            'tamanio_merceria.integer' => 'El tamaño de la mercería debe ser un número entero.',
            'id_proveedor.required' => 'Es obligatorio que se defina el proveedor de la mercería.',
            'id_proveedor.integer' => 'No se pudo encontrar el proveedor.',
            'id_proveedor.exists' => 'El proveedor seleccionado no existe en el sistema.',
            'codigo_merceria_proveedor.required' => 'Debe colocar un código para la mercería del proveedor.',
            'codigo_merceria_proveedor.string' => 'No es el formato correcto para el código de la mercería del proveedor.',
            'unidad_medida.required' => 'Debe colocar una unidad de medida para la mercería.',
            'unidad_medida.in' => 'La unidad de medida debe ser: pulgadas, mm o #.',
        ];
    }
}