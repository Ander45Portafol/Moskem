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
        Schema::create('orden_compra',function(Blueprint $table){
            $table->id('id_orden_compra');
            $table->foreignId('id_merceria')->constrained('merceria','id_merceria');
            $table->integer('cantidad_faltante');
            $table->integer('cantidad_comprada')->nullable();
            $table->date('fecha_compra')->nullable();
            $table->date('fecha_orden');
            $table->enum('estado_compra',['En camino','Entregado','Sin realizar']);
            $table->foreignId('id_tela')->constrained('telas','id_tela');
            $table->boolean('visibilidad_ordencompra');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_compra');
    }
};
