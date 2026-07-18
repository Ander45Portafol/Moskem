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
        Schema::create('paquetes', function (Blueprint $table) {
            $table->id('id_paquete');
            $table->enum('tipo_paquete',['Boda','Graducación','Bautizo']);
            $table->string('nombre_paquete');
            $table->integer('cantidad_prendas')->nullable();
            $table->enum('categoria_paquete',['Niño', 'Adulto', 'Tercera edad']);
            $table->enum('seccion_paquete',['Menswear','Renta']);
            $table->string('descripcion_paquete');
            $table->decimal('precio_paquete', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paquetes');
    }
};
