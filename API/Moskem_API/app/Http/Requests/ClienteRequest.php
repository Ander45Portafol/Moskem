<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ClienteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //Se cambia para permitir el acceso a las reglas
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    //En esta funcion se configuran todas las validaciones que debe cumplir el paquete de datos que viene en formato json
    public function rules(): array
    {
        return [
            'nombres_cliente'    => 'required|string|max:150',
            'apellidos_cliente'  => 'required|string|max:150',
            'tipo_membresia'     => 'required',
            'documento_cliente'  => 'required|string|max:20|unique:clientes,documento_cliente',
            'codigo_membresia'   => 'nullable|string|max:50|unique:clientes,codigo_membresia',
            'telefono_contacto'  => 'required|string|max:20',
            'fecha_nacimiento'   => 'required|date',
            'correo_electronico' => 'required|email|max:150'
        ];
    }
    public function messages(){
        return[
            'nombres_cliente.required'=>'Debe ingresar los nombres de el cliente',
            'nombres_cliente.string'=>'Verificar los datos que se están ingresando',
            'nombres_cliente.max'=>'Ha sobrepasado la cantidad maxima de caracteres',
            'apellidos_cliente.required' => 'Debe ingresar los apellidos de el cliente',
            'apellidos_cliente.string' => 'Verificar los datos que se están ingresando',
            'apellidos_cliente.max' => 'Ha sobrepasado la cantidad maxima de caracteres',
            'tipo_membresia.required'=>'Debe seleccionar una opción',
            'documento_cliente.required'=>'De ingresar el documento del cliente',
            'documento_cliente.unique'=>'Documento repetido',
            'codigo_membresia.unique'=>'No se puede repetir el codigo',
            'telefono_contacto.required'=>'Debe ingresar un número de celular',
            'fecha_nacimiento.required'=>'Debe ingresar una fecha de nacimiento para el cliente',
            'correo_electronico.required'=>'Debe ingresar un correo electronico del cliente',
            'correo_electronico.email'=>'El formato del correo no es el correcto'
       ];
    }
}
