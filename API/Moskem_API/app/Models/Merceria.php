<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merceria extends Model
{
    protected $table = 'mercerias';
    protected $primaryKey = 'id_merceria';
    protected $keyType = 'int';

    protected $fillable = [
        'tipo_merceria',
        'tamanio_merceria',
        'codigo_merceria',
        'stock',
        'color',
        'descripcion_merceria',
        'unidad_medida',
        'id_proveedor',
        'codigo_merceria_proveedor',
        'visibilidad_merceria',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedore::class, 'id_proveedor', 'id_proveedor');
    }

    public function detalle_merceria()
    {
        return $this->hasMany(DetalleMerceria::class, 'id_merceria', 'id_merceria');
    }
}
