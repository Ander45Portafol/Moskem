<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pedido extends Model
{
    //
    protected $primaryKey = 'id_pedido';
    protected $keyType = 'int';
    protected $fillable = [
        'id_pedido',
        'id_cliente',
        'cantidad_pedido',
        'estado_pedido',
        'nota_pedido',
        'imagen_referencia',
        'anticipo',
        'costo_total',
        'restante',
        'fecha_tallaje1',
        'fecha_tallaje2',
        'evento_traje',
        'fecha_entrega',
        'id_paquete',
        'fecha_evento',
        'tipo_entalle',
        'tipo_evento',
        'visibilidad_pedido'
    ];
    public function cliente():BelongsTo{
        return $this->belongsTo(Cliente::class,'id_cliente','id_cliente');
    }
    protected function detalle_pedido(){
        return $this->hasMany(DetallePedido::class,'id_pedido','id_pedido');
    }
    public function paquetes()
    {
        return $this->belongsTo(Paquete::class, 'id_paquete', 'id_paquete');
    }
}
