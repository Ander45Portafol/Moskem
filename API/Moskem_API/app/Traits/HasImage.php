<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait HasImage
{
    protected $imagenColumn = 'imagen';

    protected function imagen(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? asset('storage/' . $value) : null,
        );
    }

    public function getImagenColumn(): string
    {
        return $this->imagenColumn ?? 'imagen';
    }
}
