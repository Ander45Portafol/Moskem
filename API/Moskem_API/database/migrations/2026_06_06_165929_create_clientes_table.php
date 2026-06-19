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
            $table->string('nombres_cliente', 100)->nullable();
            $table->string('apellidos_cliente', 100)->nullable();
            $table->string('documento_cliente', 10)->unique()->nullable();
            $table->string('telefono_contacto', 10)->nullable()->nullable();
            $table->string('correo_electronico', 150)->unique()->nullable();
            $table->integer('codigo_membresia')->nullable();
            $table->string('tipo_membresia', 75)->nullable();
            $table->date('fecha_nacimiento')->nullable();
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
