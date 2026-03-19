<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    // Campos que permitimos rellenar (Mass Assignment)
    protected $fillable = [
        'title',
        'description',
        'is_published',
        'url_path',
        'creator_id'
    ];

    // Convertimos 'is_published' automáticamente a booleano
    protected $casts = [
        'is_published' => 'boolean',
    ];

    // Relación: Un juego pertenece a un creador (que es un User)
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
