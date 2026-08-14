<?php


// app/Services/ImagenService.php
namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Model;

class ImagenService
{
public static function actualizar(Model $modelo, UploadedFile $archivo, string $carpeta, ?string $columna = null): string
{
$columna = $columna ?? $modelo->getImagenColumn();

$anterior = $modelo->getRawOriginal($columna);
if ($anterior) {
Storage::disk('public')->delete($anterior);
}

return $archivo->store($carpeta, 'public');
}

public static function eliminar(Model $modelo, ?string $columna = null): void
{
$columna = $columna ?? $modelo->getImagenColumn();

$path = $modelo->getRawOriginal($columna);
if ($path) {
Storage::disk('public')->delete($path);
}
}
}