<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proveedore extends Model
{
    //
    protected $primaryKey = 'id_proveedor';
    protected $keyType = 'int';
    protected $fillable = [
        'id_proveedor',
        'nombre_proveedor',
        'codigo_proveedor'
    ];
    public function telas(){
        return $this->hasMany(Tela::class,'id_proveedor','id_proveedor');
    }
    public function merseria()
    {
        return $this->hasMany(Merceria::class, 'id_proveedor', 'id_proveedor');
    }
}
