<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tela extends Model
{
    //
    protected $primaryKey  = 'id_tela';
    protected $keyType = 'int';
    protected $fillable = [
        'id_tela',
        'codigo_tela',
        'color_tela',
        'cantidad_stock',
        'categoria_tela',
        'id_proveedor',
        'visibilidad_tela'
    ];
    public function detalle_pedidos()
    {
        return $this->hasMany(Detalle_Pedido::class, 'id_tela', 'id_tela');
    }
    public function orden_compra(){
        return $this->hasMany(orden_compra::class,'id_tela','id_tela');
    }
    public function proveedor(){
        return $this->belongsTo(Proveedore::class,'id_proveedor','id_proveedor');
    }
}
