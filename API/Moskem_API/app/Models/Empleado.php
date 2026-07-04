<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    //
    protected $primaryKey = 'id_empleado';
    protected $keyType = 'int';
    protected $fillable = [
        'id_empleado',
        'nombres_empleado',
        'apellidos_empleado',
        'usuario_empleado',
        'clave_empleado',
        'tipo_empleado',
        'documentos_empleado',
        'correo_empleado',
        'visibilidad_empleado',
        'codigo_empleado'
    ];
    public function detalle_pedido(){
        return $this->hasMany(DetalleMerceria::class,'id_empleado','id_empleado');
    }
    public function rentas(){
        return $this->hasMany(Renta::class,'id_empleado','id_empleado');
    }
    public function orden_trabajo(){
        return $this->hasMany(OrdenTrabajo::class,'id_empleado','id_empleado');
    }
}
