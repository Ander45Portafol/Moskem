<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merceria extends Model
{
    //
    protected $primaryKey = 'id_merceria';
    protected $keyType = 'int';
    protected $fillable = [
        'id_merceria',
        'tipo_merceria',
        'codigo_merceria',
        'stock',
        'color',
        'tamanio_merceria',
        'id_proveedor',
        'visibilidad_merceria'
    ];
    public function proveedor(){
        return $this->belongsTo(Proveedore::class,'id_proveedor','id_proveedor');
    }
    public function detalle_merceria(){
        return $this->hasMany(Detalle_Merceria::class,'id_detalle-');
    }
}
