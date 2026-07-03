<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orden_Compra extends Model
{
    //
    protected $primaryKey = 'id_orden_compra';
    protected $keyType = 'int';
    protected $fillable = [
        'id_orden_compra',
        'id_merceria',
        'cantidad_faltante',
        'cantidad_comprada',
        'fecha_compra',
        'fecha_orden',
        'estado_compra',
        'id_tela',
        'visibilidad_ordencompra'
    ];
    public function merceria(){
        return $this->belongsTo(Merceria::class,'id_merceria','id_merceria');
    }
    public function tela(){
        return $this->belongsTo(Tela::class,'id_tela','id_tela');
    }
}
