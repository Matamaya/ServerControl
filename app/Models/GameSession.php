<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    // Añade esta línea:
    protected $fillable = ['user_id', 'game_id', 'started_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function emotionData()
    {
        return $this->hasMany(EmotionData::class);
    }
}
