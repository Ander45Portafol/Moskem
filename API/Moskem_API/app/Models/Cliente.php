<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    //
    protected $primaryKey='id_cliente';
    protected $keyType='int';
    protected $fillable=[
        'id_cliente',
        'nombres_cliente',
        'apellidos_cliente',
        'tipo_membresia',
        'documento_cliente',
        'codigo_membresia',
        'telefono_contacto',
        'fecha_nacimiento',
        'correo_electronico',
        'documento_cliente',
        'visibilidad_cliente'
    ];
    public function rentas() {
    return $this->hasMany(Renta::class, 'id_cliente', 'id_cliente');
    }
    public function citas(){
        return $this->hasMany(Cita::class, 'id_cliente','id_cliente');
    }
    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'id_cliente', 'id_cliente');
    }
}
