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
        // Detecta el ID si se trata de una actualización (PUT/PATCH)
        $id = $this->route('producto') ?? $this->route('id');

        return [
            'tipo_producto' => [
                'required',
                'string',
                Rule::in([
                    'Traje_completo',
                    'Saco',
                    'Pantalon',
                    'Camisa',
                    'Traje_superior',
                    'Corbata',
                    'Zapatos'
                ]),
            ],
            'codigo_producto' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('productos', 'codigo_producto')->ignore($id, 'id_producto'),
            ],
            // Permite string (URL/ruta existente) o un archivo de imagen válido
            'imagen_producto' => 'nullable',
            
            // Color obligatorio SOLO si NO es un producto con tela (es decir, obligatorio si es Zapatos o no tiene tela seleccionada)
            'color' => 'nullable|required_if:tipo_producto,Zapatos|string|max:50',
            
            'talla' => 'required|string|max:10',
            
            // id_tela es OBLIGATORIO para todo excepto si el tipo de producto es 'Zapatos'
            'id_tela' => [
                'nullable',
                'required_unless:tipo_producto,Zapatos',
                'integer',
                'exists:telas,id_tela',
            ],
            
            'costo' => 'required|numeric|min:0',
            'descripcion_producto' => 'nullable|string|max:255',
            'estado_producto' => [
                'required',
                'string',
                Rule::in(['Vendido', 'Disponible', 'Rentado', 'Lavanderia', 'Ajuste']),
            ],
            'visibilidad_producto' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tipo_producto.required' => 'Debe seleccionar un tipo de producto.',
            'tipo_producto.in' => 'El tipo de producto seleccionado no es válido.',
            'codigo_producto.unique' => 'Este código de producto ya está registrado.',
            'color.required_if' => 'El campo color es obligatorio para zapatos.',
            'color.max' => 'El color no debe exceder los 50 caracteres.',
            'talla.required' => 'La talla es obligatoria.',
            'id_tela.required_unless' => 'Debe seleccionar una tela para este tipo de producto.',
            'id_tela.exists' => 'La tela seleccionada no existe en el catálogo.',
            'costo.required' => 'El costo del producto es obligatorio.',
            'costo.numeric' => 'El costo debe ser un valor numérico.',
            'estado_producto.required' => 'El estado del producto es obligatorio.',
            'estado_producto.in' => 'El estado seleccionado no es válido.',
        ];
    }
}