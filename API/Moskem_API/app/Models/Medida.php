<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medida extends Model
{
    //
    public function ordenTrabajo() {
    return $this->hasOne(OrdenTrabajo::class, 'id_medidas', 'id_medidas');
    }
}
