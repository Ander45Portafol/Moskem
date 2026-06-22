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
        Schema::create('rentas', function (Blueprint $table) {
            $table->id('id_renta');
            // Relación 1:M con Clientes
            $table->foreignId('id_cliente')
                  ->constrained('clientes', 'id_cliente')
                  ->onDelete('cascade');
                  
            $table->foreignId('id_empleado')->constrained('empleados', 'id_empleado'); // Asumiendo que ya existe 'empleados'
            
            $table->date('fecha_inicio');
            $table->date('fecha_devolucion');
            $table->decimal('monto_total', 10, 2);
            $table->decimal('deposito', 10, 2)->default(0.00);
            $table->enum('estado_renta', ['Entregado','En proceso','Finalizado']);
            $table->string('notas_descripcion',300)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentas');
    }
};
