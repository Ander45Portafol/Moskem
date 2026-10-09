<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    // 1. Nombre de la tabla en tu base de datos
    protected $table = 'usuarios';

    // 2. Si tu llave primaria no es "id", especifícala aquí (ej. 'id_usuario')
    protected $primaryKey = 'id_usuario';

    // 3. Campos que se pueden llenar masivamente
    protected $fillable = [
        'id_usuario',
        'id_empleado',
        'cantidad_intentos',
        'usuario',
        'estado_usuario',
        'tipo_usuario',
        'clave',
    ];

    // 4. Ocultar la contraseña en las respuestas JSON
    protected $hidden = [
        'clave',
    ];


    // 6. Relación con la tabla de empleados
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_empleado');
    }
    //Este metodo sobreescribe el nombre del campo password por defecto de Laravel Auth
    public function getAuthPassword()
    {
        return $this->clave;
    }
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Retornar un array clave-valor con custom claims para añadir al JWT.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
