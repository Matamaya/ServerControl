<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = ['name', 'description'];

    // Relación: Un rol pertenece a muchos usuarios
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
