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

    public function detalle_pedido(){
        return $this->hasMany(DetallePedido::class,'id_detalle_pedido','id_detalle_pedido');
    }
}
