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
Schema::create('mercerias', function (Blueprint $table) {
            $table->id('id_merceria');
            $table->enum('tipo_merceria', ['Botones','Ganchos','Zipper','Agujas','Hilos']);
            $table->string('codigo_merceria',14)->unique();
            $table->integer('stock');
            $table->string('color', 30);
            $table->enum('medida_stock', ['Pulgadas', 'Yardas', 'Unidad']);
            $table->foreignId('id_proveedor')
            ->constrained('proveedores', 'id_proveedor')->onDelete('cascade');
            $table->string('codigo_merceria_proveedor');
            $table->string('descripcion_merceria');
            $table->boolean('visibilidad_merceria')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accesorios');
    }
};
