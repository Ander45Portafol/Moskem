<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductoRequest extends FormRequest
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
        $id = $this->route('producto') ?? $this->route('id');

        return [
            'nombre_producto' => 'required|string|max:255',
            'codigo_producto' => [
                'required',
                'string',
                'max:14',
                Rule::unique('productos', 'codigo_producto')->ignore($id, 'id_producto'),
            ],
            'stock' => 'required|integer|min:0',
            'color' => 'required|string|max:30',
            // Cambiado a integer para coincidir con la columna en PostgreSQL
            'tamanio_producto' => 'required|integer|min:0',
            'id_proveedor' => 'required|integer|exists:proveedores,id_proveedor',
            'codigo_producto_proveedor' => 'required|string|max:255',
            'medida_stock' => [
                'required',
                'string',
                Rule::in(['Pulgadas', 'Yardas', 'Unidad']),
            ],
            'descripcion_producto' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_producto.required' => 'Debe seleccionar una opción para el tipo de producto.',
            'tipo_producto.in' => 'El tipo debe ser: Tela, Forro, Cierre, Botones, Ganchos, Zipper, Agujas o Hilos.',
            'color.required' => 'El color es obligatorio.',
            'color.max' => 'El color no debe exceder los 30 caracteres.',
            'color.string' => 'El color debe ser una cadena de texto.',
            'talla.required' => 'La talla es obligatoria.',
            'talla.integer' => 'La talla debe ser un número entero.',
            'id_tela.required' => 'Debe seleccionar una tela.',
            'id_tela.integer' => 'El ID de la tela debe ser un número entero.',
            'id_tela.exists' => 'La tela seleccionada no existe.',
            'codigo_tela.required' => 'El código de la tela es obligatorio.',
            'codigo_tela.string' => 'El código de la tela debe ser una cadena de texto.',
            'codigo_tela.max' => 'El código de la tela no debe exceder los 14 caracteres.',
            'codigo_tela.unique' => 'Este código de tela ya está registrado.',
            'tela.required' => 'Debe seleccionar una tela.',
            'tela.string' => 'La tela debe ser una cadena de texto.',
            'costo.required' => 'El costo es obligatorio.',
            'costo.numeric' => 'El costo debe ser un número.',
            'estado_producto.required' => 'Debe seleccionar un estado para el producto.',
            'estado_producto.in' => 'El estado debe ser: Disponible, Agotado o Descontinuado.',
        ];
    }
}