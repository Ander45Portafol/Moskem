<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paquete extends Model
{
    protected $primaryKey = 'id_paquete';
    protected $keyType = 'int';
    protected $fillable = [
        'id_paquete',
        'tipo_paquete',
        'nombre_paquete',
        'detalles_paquete'
    ];

    public function detalle_pedidos(){
        return $this->hasMany(Pedido::class,'id_paquete','id_paquete');
    }
    public function detalle_rentas(){
        return $this->hasMany(DetalleRenta::class,'id_paquete','id_paquete');
    }
}
