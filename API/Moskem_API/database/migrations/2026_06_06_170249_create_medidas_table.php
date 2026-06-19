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
            $table->integer('largo');
            $table->integer('pecho');
            $table->integer('cintura');
            $table->integer('cadera') ;
            $table->integer('talle');
            $table->integer('sisa');
            $table->integer('hombro');
            $table->integer('entrepecho');
            $table->integer('largo_manga');
            $table->integer('ancho_manga');
            $table->integer('punio');
            $table->integer('escote');
            $table->integer('cuello');
            $table->integer('largo_pant');
            $table->integer('campana');
            $table->integer('rodilla');
            $table->integer('tiro');
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
