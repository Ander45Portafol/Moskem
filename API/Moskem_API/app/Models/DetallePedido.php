<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetallePedido extends Model
{
    //
    protected $primaryKey = 'id_detalle_pedido';
    protected $keyType = 'int';
    protected $fillable = [
        'id_detalle_pedido',
        'id_pedido',
        'id_tela',
        'id_empleado',
        'id_paquete',
        'cantidad_tela',
        'tipo_pedido',
        'numero_pedido',
        'prenda',
    ];

    public function pedidos(){
        return $this->belongsTo(Pedido::class,'id_pedido','id_pedido');
    }
    public function telas(){
        return $this->belongsTo(Tela::class,'id_tela','id_tela');
    }
    public function empleados(){
        return $this->belongsTo(Empleado::class,'id_empleado','id_empleado');
    }
    public function detalle_merceria(){
        return $this->hasMany(DetalleMerceria::class,'id_detalle_pedido','id_detalle_pedido');
    }
    public function paquetes(){
        return $this->belongsTo(Paquete::class,'id_paquete','id_paquete');
    }
}
