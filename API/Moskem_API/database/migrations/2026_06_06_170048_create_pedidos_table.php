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
            //Campo y referencia de conexion con los clientes
            $table->foreignId('id_cliente')->constrained('clientes', 'id_cliente')->onDelete('cascade');
            //Campo para seleccionar el estado del pedido y con eso gestionar cuando la información ya esta completada
            $table->enum('estado_pedido', ['Anotado','Revisado','En proceso','Finalizado','Entregado']);
            //Campo para almacenar las notas de los pedidos
            $table->string('nota_pedido')->nullable();
            $table->string('imagen_referencia', 255)->nullable();
            //Campo para guardar la fecha del evento
            $table->date('evento_traje')->nullable();
            //Seleccion del tipo de entalle con el que se trabajrá el traje
            $table->enum('tipo_entalle', ['Slim fit', 'Regular fit'])->nullable();
            //Campo para almacenar el anticipo que el cliente da para le pedido
            $table->decimal('anticipo',10,2)->nullable();
            //Campo para guardar el costo total del pedido y en base a esto generar el restante
            $table->decimal('costo_total',10,2)->nullable();
            //Campo para guardar cuanto será el restante a pagar por el pedido
            $table->decimal('restante',10,2)->nullable();
            //Campo para almacenar la primera fecha de tallaje
            $table->date('fecha_tallaje1');
            //Campo para almacenar la segunda fecha de tallaje
            $table->date('fecha_tallaje2');
            //Campo para guardar la fecha de entrega del pedido que normalmente es un mes antes de la fecha del evento
            $table->date('fecha_entrega');
            //Campo para seleccionar el tipo de evento
            $table->enum('tipo_evento',['Boda','Graduación', 'Bautizo','Cumpleaños','otro']);
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
