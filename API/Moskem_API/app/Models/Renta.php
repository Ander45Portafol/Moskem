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
    public function detalle_orden(){
        return $this->hasMany(Detalle_Renta::class,foreignKey:'id_renta');
    }
    public function clientes(){
        return $this->belongsTo(Cliente::class,'id_cliente','id_cliente');
    }
    public function empleados(){
        return $this->belongsTo(Empleados::class,'id_empleado','id_empleado');
    }
}
