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
        Schema::create('empleados', function (Blueprint $table) {
            $table->id('id_empleado');
            $table->string('nombres_empleado', 100)->nullable();
            $table->string('apellidos_empleado', 100)->nullable();
            $table->string('usuario_empleado', 50)->unique();
            $table->string('clave_empleado',200)->nullable(); // Hash de contraseña
            $table->enum('tipo_empleado', ['Administrador', 'Sastre','Vendedor','root','Diseñador','Pasantes'])->nullable(); // Ej: Administrador, Sastre, Vendedor
            $table->string('documentos_empleados', 10)->nullable(); // Ruta de archivos
            $table->string('correo_empleado',200)->nullable();
            $table->string('codigo_empleado',8)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
