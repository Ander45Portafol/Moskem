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
        Schema::create('medidas', function (Blueprint $table) {
            $table->id('id_medidas');
            // Aquí agregan los campos específicos según el Excel de muestras
            //aun falta color mas
            $table->string('codigo_medida');
            $table->integer('largo')->nullable();
            $table->integer('pecho')->nullable();
            $table->integer('cintura')->nullable();
            $table->integer('cadera')->nullable();
            $table->integer('talle')->nullable();
            $table->integer('sisa')->nullable();
            $table->integer('hombro')->nullable();
            $table->integer('entrepecho')->nullable();
            $table->integer('largo_manga')->nullable();
            $table->integer('ancho_manga')->nullable();
            $table->integer('punio')->nullable();
            $table->integer('escote')->nullable();
            $table->integer('cuello')->nullable();
            $table->integer('largo_pant')->nullable();
            $table->integer('campana')->nullable();
            $table->integer('rodilla')->nullable();
            $table->integer('tiro')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medidas');
    }
};
