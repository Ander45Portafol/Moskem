<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    //
    protected $primaryKey = 'id_pedido';
    protected $keyType = 'int';
    protected $fillable = [
        'id_pedido',
        'id_cliente',
        'cantidad_pedido',
        'tipo_pedido',
        'estado_pedido',
        'nota_pedido',
        'imagen_referencia',
        'anticipo',
        'costo_total',
        'restante',
        'fecha_tallaje1',
        'fecha_tallaje2',
        'fecha_entrega',
        'visibilidad_pedido'
    ];
    protected function cliente(){
        return $this->belongsTo(Cliente::class,'id_cliente','id_cliente');
    }
    protected function detalle_pedido(){
        return $this->hasMany(DetallePedido::class,'id_pedido','id_pedido');
    }
}
