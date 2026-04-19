<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSend implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    // Pasamos el mensaje recién creado al evento
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    // Definimos por qué canal de Reverb va a viajar este evento
    public function broadcastOn(): array
    {
        return [
            new Channel('chat.general'), // Usaremos un canal público llamado 'chat.general' de momento
        ];
    }
}