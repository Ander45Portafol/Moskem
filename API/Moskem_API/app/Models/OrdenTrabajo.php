<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenTrabajo extends Model
{
    //
    protected $primaryKey = 'id_orden';
    protected $keyType = 'int';
    protected $fillable = [
        'id_orden',
        'id_detalle_pedido',
        'id_empleado',
        'id_medidas',
        'visibilidad_ordentrabajo',
        'fecha_asignacion',
        'estado_orden',
        'tiempo_sastre',
        'imagen_diseño',
    ];
    public function detalle_pedido(){
        return $this->belongsTo(DetallePedido::class,'id_detalle_pedido','id_detalle_pedido');
    }
    public function empleado(){
        return $this->belongsTo(Empleado::class,'id_empleado','id_empleado');
    }
    public function medida() {
    return $this->belongsTo(Medida::class, 'id_medidas', 'id_medidas');
    }
}
