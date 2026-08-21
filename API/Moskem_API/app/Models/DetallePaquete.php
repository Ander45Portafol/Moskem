<?php

namespace App\Models;

use App\Traits\HasImage;
use Illuminate\Database\Eloquent\Model;

class DetallePaquete extends Model
{
    use HasImage;
    //
    protected $primaryKey = 'id_detalle_paquete';
    protected $keyType = 'int';
    protected $fillable = [
        'id_detalle_pedido',
        'id_paquete',
        'prenda_paquete',
        'imagen'
    ];
    public function paquetes(){
        return $this->belongsTo(Paquete::class,'id_paquete','id_paquete');
    }
    public function prenda()
    {
        return $this->belongsTo(Prenda::class, 'id_prenda');
    }
}
