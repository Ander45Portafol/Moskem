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
        Schema::create('telas', function (Blueprint $table) {
            $table->id('id_tela');
            $table->string('codigo_tela', 50)->unique();
            $table->string('color_tela', 50);
            $table->integer('cantidad_stock');
            $table->enum('categoria_tela',['Elite','Elite +','Premium']);
            $table->foreignId('id_proveedor')->constrained('proveedores', 'id_proveedor')->onDelete('cascade');
            $table->boolean('visibilidad_tela');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telas');
    }
};
