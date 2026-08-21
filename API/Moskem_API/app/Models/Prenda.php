<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Model;

class Prenda extends Model
{
    use HasImage;

    //
    protected $primaryKey = 'id_prenda';
    protected $keyType = 'int';
    protected $fillable = [
        'id_prenda',
        'prenda_paquete',
        'imagen',
        'precio_unitario'
    ];
    public function detalle_paquete(){
        return $this->hasMany(DetallePaquete::class,'id_prenda'); 
    }
}
