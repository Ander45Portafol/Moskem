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
        Schema::create('detalle_renta', function (Blueprint $table) {
            $table->id('id_detalle_renta');
            $table->foreignId('id_renta')->constrained('rentas', 'id_renta')->onDelete('cascade');
            $table->foreignId('id_producto')->constrained('productos', 'id_producto');
            $table->integer('cantidad')->default(1);
            $table->date('fecha_renta');
            $table->enum('estado_producto_renta', ['Solicitado','Entregado','Devuelto']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_renta');
    }
};
