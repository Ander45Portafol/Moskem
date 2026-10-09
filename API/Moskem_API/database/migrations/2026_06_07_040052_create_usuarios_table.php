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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->foreignId('id_empleado')->constrained('empleados', 'id_empleado');  
            $table->integer('cantidad_intentos');
            $table->string('usuario');
            $table->enum('tipo_usuario', ['Administrador', 'Sastre', 'Vendedor', 'root', 'Diseñador', 'Pasantes']);
            $table->boolean('estado_usuario')->default(true);
            $table->string('clave');         
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
