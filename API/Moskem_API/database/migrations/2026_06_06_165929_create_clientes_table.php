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
        Schema::create('clientes', function (Blueprint $table) {
            $table->id('id_cliente');
            $table->string('nombres_cliente', 100);
            $table->string('apellidos_cliente', 100);
            $table->string('documento_cliente', 10)->unique();
            $table->string('telefono_contacto', 10)->nullable();
            $table->boolean('visibilidad_cliente')->default(true);
            $table->string('correo_electronico', 150);
            $table->string('codigo_membresia',10)->nullable();
            $table->enum('tipo_membresia', ['Normal','Platinum','Elite']);
            $table->date('fecha_nacimiento');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
