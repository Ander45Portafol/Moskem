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
            $table->enum('tipo_producto', [
                'Traje_completo',
                'Saco',
                'Pantalon',
                'Camisa',
                'Traje_superior',
                'Corbata',
                'Zapatos'
            ]);
            $table->string('codigo_producto')->nullable();
            $table->string('imagen_producto', 255)->nullable();
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