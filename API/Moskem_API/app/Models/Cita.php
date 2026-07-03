<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;
    protected $primaryKey='id_cita';
    protected $keyType='int';
    protected $fillable=[
        'id_cita',
        'fecha_cita',
        'id_cliente',
        'hora_cita',
        'motivo_cita'
    ];
    public function cliente(){
        return $this->belongsTo(Cliente::class,'id_cliente');
    }
}
