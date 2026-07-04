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
            $table->enum('tipo_producto', ['Traje_completo','Saco','Pantalon','Camisa','Traje superior','corbata']);
            $table->string('color', 50);
            $table->string('talla', 10);
            $table->foreignId('id_tela')->constrained('telas', 'id_tela')->onDelete('cascade');
            $table->decimal('costo', 10, 2);
            $table->enum('estado_producto', ['Disponible','Agotado']); // Ej: "Disponible", "Rentado", "Mantenimiento"
            $table->boolean('visibilidad_producto');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
