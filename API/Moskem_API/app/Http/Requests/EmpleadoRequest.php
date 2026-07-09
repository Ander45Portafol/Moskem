<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EmpleadoRequest extends FormRequest
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
            'nombres_empleado' => 'required|string',
            'apellidos_empleado' => 'required|string',
            'usuario_empleado' => 'required|string',
            'tipo_empleado' => 'required',
            'documentos_empleados' => [
                'required',
                'string',
                'regex:/^\d{8}-\d$/'
            ],
            'correo_empleado' => 'required|email|max:200',
            'codigo_empleado' => 'string'
        ];
    }
    public function messages()
    {
        return [
            'nombres_empleado.required' => 'El nombre del empleado no puede quedar vacio',
            'nombres_empleado.string' => 'El nombre del empleado no cumple con el formato correcto',
            'apellidos_empleado.required' => 'El apellido del empleado no puede quedar vacio',
            'apellidos_empleado.string' => 'El apellidos del empleado no cumple con el formato correcto',
            'usuario_empleado.required' => 'Debe ingresar un usuario para el empleado',
            'usuario_empleado.string' => 'El usuario del empleado no cumple con el formato correcto',
            'tipo_empleado.required' => 'Debe seleccionar un tipo de empleado',
            'documentos_empleados.required' => 'Debe ingresar un documento de identificación del empleado',
            'documentos_empleados.regex' => 'El documento del empleado, no cumple con el formato indicado',
            'codigo_empleado.string' => 'El formato ingresado para el codigo de empelado, no es el correcto'
        ];
    }
}
