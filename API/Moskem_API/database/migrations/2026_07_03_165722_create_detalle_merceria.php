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
        Schema::create('detalle_mercerias', function (Blueprint $table) {
            $table->id('id_detalle_merceria');
            $table->foreignId('id_detalle_pedido')->constrained('detalle_pedidos', 'id_detalle_pedido');
            $table->foreignId('id_merceria')->constrained('merceria', 'id_merceria');
            $table->integer('cantidad_merceria');            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_merceria');
    }
};
