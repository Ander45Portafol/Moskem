<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detalle_paquetes', function (Blueprint $table) {
            $table->id('id_detalle_paquete');
            $table->foreignId('id_paquete')->constrained('paquetes', 'id_paquete');
            $table->enum('prenda_paquete',['Camisa', 'Chaleco', 'Saco', 'Pantalón','Accesorio','Complemento','Faja', 'Saco tipo pingüino','Guayabera / Camisa de Lino','Tirantes']);
            $table->string('imagen')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_paquete');
    }
};
