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
Schema::create('detalle_pedidos', function (Blueprint $table) {
            $table->id('id_detalle_pedido');
            // 1. PRIMERO CREAMOS LAS COLUMNAS QUE SE CONECTAN CON OTRAS TABLAS
            $table->unsignedBigInteger('id_pedido');
            $table->unsignedBigInteger('id_tela');
            $table->unsignedBigInteger('id_empleado');
            $table->unsignedBigInteger('id_paquete');
            //LUEGO CREAMOS LAS DEMAS COLUMNAS QUE SERAN PARTE DE LA TABLA
            $table->decimal('cantidad_tela',8,2)->nullable();
            $table->date('evento_traje');
            $table->enum('prenda',['Camisa','Chaleco','Saco','Pantalón']);
            //POR ULTIMO REALIZAMOS LA RELACIONES ENTRE LAS TABLAS
            $table->foreign('id_pedido')->references('id_pedido')->on('pedidos')->onDelete('cascade');
            $table->foreign('id_tela')->references('id_tela')->on('telas');
            $table->foreign('id_empleado')->references('id_empleado')->on('empleados');
            $table->foreign('id_paquete')->references('id_paquete')->on('paquetes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_pedidos');
    }
};
