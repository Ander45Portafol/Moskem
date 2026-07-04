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
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id('id_pedido');
            $table->foreignId('id_cliente')->constrained('clientes', 'id_cliente')->onDelete('cascade');
            $table->integer('cantidad_pedido');
            $table->enum('tipo_pedido', ['Prenda unica','Traje completo']); // Ej: "Traje completo", "Saco ejecutivo"
            $table->enum('estado_pedido', ['Anotado','Revisado','En proceso','Finalizado','Entregado']);
            $table->string('nota_pedido')->nullable();
            $table->string('imagen_referencia', 255)->nullable();
            $table->decimal('anticipo',10,2);
            $table->decimal('costo_total',10,2);
            $table->decimal('restante',10,2);
            $table->date('fecha_tallaje1');
            $table->date('fecha_tallaje2');
            $table->date('fecha_entrega');
            $table->boolean('visibilidad_pedido')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
