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
        'nombre_producto',
        'codigo_producto',
        'imagen_producto',
        'descripcion_producto',
        'fecha_ingreso_producto',
        'categoria_producto',
        'cantidad_stock',
        'color',
        'talla',
        'id_tela',
        'costo',
        'estado_producto',
        'visibilidad_producto'
    ];
    // En tu modelo Eloquent (ej. Producto.php)
    protected function casts(): array
    {
        return [
            'fecha_ingreso_producto' => 'date', // o 'datetime'
        ];
    }
    public function detalle_renta(){
        return $this->hasMany(DetalleRenta::class, 'id_producto');
    }

    public function tela(){
        return $this->belongsTo(Tela::class, 'id_tela', 'id_tela');
    }
}