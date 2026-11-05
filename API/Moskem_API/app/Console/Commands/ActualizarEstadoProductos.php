<?php

namespace App\Console\Commands;

use App\Services\EstadoProductoRentaService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('rentas:actualizar-estados-productos')]
#[Description('Actualiza el estado de los productos según las fechas de sus rentas')]
class ActualizarEstadoProductos extends Command
{
    public function handle(EstadoProductoRentaService $estadoProductoRentaService): int
    {
        $actualizados = $estadoProductoRentaService->actualizarEstados();

        $this->info("Productos en estado Ajuste: {$actualizados['ajuste']}.");
        $this->info("Productos en estado Rentado: {$actualizados['rentado']}.");
        $this->info("Productos en estado Lavanderia: {$actualizados['lavanderia']}.");

        return self::SUCCESS;
    }
}
