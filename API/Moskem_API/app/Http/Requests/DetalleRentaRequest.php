<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DetalleRentaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_renta'=>'required|integer',
            'id_producto' => 'required|integer',
            'id_medidas' => 'integer',
            'cantidad' => 'required|integer',
            'fecha_renta' => 'required|date',
            'estado_producto_renta' => 'required',
            'id_paquete' => 'integer',
            'id_cupon'=>'integer'
        ];
    }
    public function messages(){
        return[
            'id_renta.required'=>'No es posible encontrar el registro de la renta',
           'id_renta.integer'=>'El formato del registro de la renta, no es el necesario',
            'id_producto.required' => 'No es posible encontrar el registro del producto',
            'id_producto.integer' => 'El formato del registro del producto, no es el necesario',
            'id_medidas.integer' => 'El formato del registro de las medidas, no es el necesario',
            'cantidad.required' => 'no se permiten valores vacios para la cantidad de productos',
            'cantidad.integer' => 'Solo se permiten números enteros',
            'fecha_entrega.required' => 'No se permiten valores vacios, debe seleccionar una fecha para la entrega',
            'fecha_entrega.date' => 'El formato del registro de fecha, no es el necesario',
            'estado_producto_renta.required'=>'Debe escoger una opción valida',
            'id_paquete.integer'=>'El formato del registor de paquete, no es el correcto',
            'id_cupon.integer'=>'No es posible encontrar este cupón'
        ];
    }
}
