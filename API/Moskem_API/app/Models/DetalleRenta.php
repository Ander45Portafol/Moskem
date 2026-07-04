<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleRenta extends Model
{
    //
    protected $primaryKey = 'id_detalle_renta';
    protected $keyType = 'int';
    protected $fillable = [
        'id_detalle_renta',
        'id_renta',
        'id_producto',
        'cantidad',
        'fecha_renta',
        'estado_producto_renta'
    ];
    public function renta(){
        return $this->belongsTo(Renta::class,'id_renta','id_renta');
    }
    public function producto(){
        return $this->belongsTo(Productos::class,'id_producto','id_producto');
    }
    
}
