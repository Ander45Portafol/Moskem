<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'tipo_merceria'=>'required',
            'codigo_merceria'=>'required|string',
            'stock'=>'required|integer',
            'color'=>'required|string',
            'tamanio_merceria'=>'required|string',
            'id_proveedor'=>'required|integer'
        ];
    }
    public function messages(){
        return[
            'tipo_merceria.required'=>'Debe seleccionar una opción para el tipo de mercería',
            'codigo_merceria.required'=>'Debe colocar un código para la mercería',
            'codigo_merceria.string'=>'No es el formato correcto para el código de la mercería',
            'stock.required'=>'Debe colocar la cantidad de stock para la mercería',
            'stock.integer'=>'No es el formato correcto para el stock de la mercería',
            'color.required'=>'Debe colocar un color para la mercería',
            'color.string'=>'No es el formato correcto para el color de la mercería',
            'tamanio_merceria.required'=>'Debe colocar un tamaño para la mercería',
            'tamanio_merceria.string'=>'No es el formato correcto para el tamaño de la mercería',
            'id_proveedor.required'=>'Es obligatorio que se defina el proveedor de la mercería',
            'id_proveedor.integer'=>'No se pudo encontrar el proveedor'
        ];
    }
}