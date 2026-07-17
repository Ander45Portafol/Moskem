<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TelasRequest extends FormRequest
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
            'codigo_tela'=>'required|string',
            'color_tela'=>'required|string',
            'cantidad_stock'=>'required|integer',
            'categoria_tela'=>'required|string',
            'id_proveedor'=>'required|integer'
        ];
    }
    public function messages(){
        return[
            'codigo_tela.required'=>'Debe colocar un código para la tela',
            'codigo_tela.string'=>'No es el formato correcto para el código de la tela',
            'color_tela.required'=>'Debe colocar un color para la tela',
            'color_tela.string'=>'No es el formato correcto para el color de la tela',
            'cantidad_stock.required'=>'Debe colocar la cantidad de stock para la tela',
            'cantidad_stock.integer'=>'No es el formato correcto para el stock de la tela',
            'categoria_tela.required'=>'Debe colocar una categoría para la tela',
            'categoria_tela.string'=>'No es el formato correcto para la categoría de la tela',
            'id_proveedor.required'=>'Es obligatorio que se defina el proveedor de la tela',
            'id_proveedor.integer'=>'No se pudo encontrar el proveedor'
        ];
    }
}   