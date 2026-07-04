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
        Schema::create('orden_trabajos', function (Blueprint $table) {
            $table->id('id_orden');
            $table->foreignId('id_detalle_pedido')->constrained('detalle_pedidos', 'id_detalle_pedido'); // Asumiendo que ya existe 'pedidos'
            $table->foreignId('id_empleado')->constrained('empleados', 'id_empleado');
            
            // RELACIÓN 1:1 REFORZADA CON unique()
            $table->foreignId('id_medidas')
                  ->unique() 
                  ->constrained('medidas', 'id_medidas')
                  ->onDelete('cascade');
            $table->boolean('visibilidad_ordentrabajo');
            $table->date('fecha_asignacion');
            $table->enum('estado_orden', ['Anotado','Revision','En proceso','Finalizado','Entregado']);
            $table->time('tiempo_sastre');
            $table->string('imagen_diseño',255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_trabajo');
    }
};
