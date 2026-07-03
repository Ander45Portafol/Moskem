<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orden_Trabajo extends Model
{
    //
    public function medida() {
    return $this->belongsTo(Medida::class, 'id_medidas', 'id_medidas');
    }
}
