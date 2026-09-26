<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Renta extends Model
{
    //
    protected $primaryKey = 'id_renta';
    protected $KeyType = 'int';
    protected $fillable = [
        'id_renta',
        'id_cliente',
        'id_empleado',
        'fecha_inicio',
        'fecha_devolucion',
        'monto_total',
        'deposito',
        'estado_renta',
        'notas_descripcion',
        'visibilidad_renta'
    ];
    public function detalle_renta(){
        return $this->hasMany(DetalleRenta::class,foreignKey:'id_renta');
    }
    public function cliente(){
        return $this->belongsTo(Cliente::class,'id_cliente','id_cliente');
    }
    public function empleado(){
        return $this->belongsTo(Empleado::class,'id_empleado','id_empleado');
    }
}
