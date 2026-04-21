<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmotionData extends Model
{
    protected $fillable = ['game_session_id', 'emotion', 'confidence', 'game_time'];

    public function gameSession()
    {
        return $this->belongsTo(GameSession::class);
    }
}
