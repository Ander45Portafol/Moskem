<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    //
    public function rentas() {
    return $this->hasMany(Renta::class, 'id_cliente', 'id_cliente');
    }
}
