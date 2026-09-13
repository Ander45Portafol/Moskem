<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model // <-- Cambiado de Productos a Producto
{
    protected $table = 'productos';
    protected $primaryKey = 'id_producto';
    protected $keyType = 'int';

    protected $fillable = [
        'id_producto',
        'tipo_producto',
        'color',
        'talla',
        'id_tela',
        'costo',
        'estado_producto',
        'visibilidad_producto'
    ];

    public function detalle_renta(){
        return $this->hasMany(DetalleRenta::class, 'id_producto');
    }

    public function telas(){
        return $this->belongsTo(Tela::class, 'id_tela', 'id_tela');
    }
}