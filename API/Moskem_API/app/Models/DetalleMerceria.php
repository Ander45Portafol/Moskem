<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class DetalleMerceria extends Model
{
    //
    protected $primaryKey = 'id_detalle_merceria';
    protected $keyType = 'int';
    protected $fillable = [
        'id_detalle_merceria',
        'id_detalle_pedidos',
        'id_mercerias',
        'cantidad_merceria'
    ];
    public function detalle_pedidos(){
        return $this->belongsTo(DetallePedido::class,'id_detalle_pedidos','id_detalle_pedidos');
    }
    public function mercerias(){
        return $this->belongsTo(Merceria::class,'id_merceria','id_merceria');
    }
    protected function nombreCompleto(): Attribute
    {
        return Attribute::make(
            get: fn() => trim("{$this->nombres_cliente} {$this->apellidos_cliente}"),
        );
    }
}
