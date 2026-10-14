<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable; // 1. Importar Notifiable

class Empleado extends Model
{
    use Notifiable; // 2. Usar Notifiable para habilitar el envío de correos

    protected $primaryKey = 'id_empleado';
    protected $keyType = 'int';

    protected $fillable = [
        'id_empleado',
        'nombres_empleado',
        'apellidos_empleado',
        'tipo_empleado',
        'documentos_empleados',
        'correo_empleado',
        'visibilidad_empleado',
        'codigo_empleado',
        'estado_empleado',
    ];

    /**
     * Le indica a Laravel que use 'correo_empleado' como la dirección de destino de los emails.
     */
    public function routeNotificationForMail($notification)
    {
        return $this->correo_empleado;
    }

    public function detalle_pedido()
    {
        return $this->hasMany(DetalleMerceria::class, 'id_empleado', 'id_empleado');
    }

    public function rentas()
    {
        return $this->hasMany(Renta::class, 'id_empleado', 'id_empleado');
    }

    public function orden_trabajo()
    {
        return $this->hasMany(OrdenTrabajo::class, 'id_empleado', 'id_empleado');
    }

    /**
     * Relación con Usuario.
     * La llave foránea en la tabla 'usuarios' es 'id_empleado'.
     */
    public function usuario()
    {
        return $this->hasOne(Usuario::class, 'id_empleado', 'id_empleado');
    }
}
