<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medida extends Model
{
    //
    protected $primaryKey = 'id_medida';
    protected $keyType = 'int';
    protected $fillable = [
        'id_medida',
        'largo',
        'pecho',
        'cintura',
        'cadera',
        'talle',
        'sisa',
        'hombro',
        'entrepecho',
        'largo_manga',
        'ancho_manga',
        'punio',
        'escote',
        'cuello',
        'largo_pant',
        'campana',
        'rodilla',
        'tiro'
    ];
    public function ordenTrabajo() {
    return $this->hasOne(OrdenTrabajo::class, 'id_medidas', 'id_medidas');
    }
}
