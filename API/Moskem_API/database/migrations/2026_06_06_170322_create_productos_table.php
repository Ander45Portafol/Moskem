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
        Schema::create('productos', function (Blueprint $table) {
            $table->id('id_producto');
            $table->enum('categoria_producto', [
                'Vestimenta',
                'Zapatos',
                'Accesorios'
            ]);
            $table->string('nombre_producto');
            $table->string('codigo_producto')->nullable();
            $table->string('imagen_producto', 255)->nullable();
            $table->enum('tipo_producto',['Saco','Pantalón','Camisa','Chaqué (tipo saco)','Frac (tipo saco)','Blazer','Faja','Corbatin (Bow tie)','Mancuernilla','Zapatos','Pañuelo','Traje de colección','Chaleco','Corbata','Tirantes']);
            $table->integer('cantidad_stock')->default(1);
            $table->date('fecha_ingreso_producto');
            $table->string('color', 50)->nullable(); // Se hace nullable porque cuando hay Tela, el color se toma de ella
            $table->string('talla', 10);
            
            // OBLIGATORIO: nullable() para permitir Zapatos que no llevan tela
            $table->foreignId('id_tela')
                  ->nullable()
                  ->constrained('telas', 'id_tela')
                  ->nullOnDelete();
                  
            $table->decimal('costo', 10, 2);
            $table->string('descripcion_producto', 255)->nullable();
            $table->enum('estado_producto', ['Vendido', 'Disponible', 'Rentado', 'Lavanderia', 'Ajuste']);
            
            $table->boolean('visibilidad_producto')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};