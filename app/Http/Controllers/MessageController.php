<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSend;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{

    // Mostrar la vista del chat y enviar el historial
    public function index()
    {
        // Traemos los últimos 50 mensajes con el nombre del usuario
        $messages = Message::with('user')->latest()->take(50)->get()->reverse()->values();

        return Inertia::render('Chat/Chat', [
            'initialMessages' => $messages
        ]);
    }


    public function store(Request $request)
    {
        // 1. Validamos y guardamos el resultado en una variable
        $validated = $request->validate([
            'content' => 'required|string|min:1'
        ]);

        // 2. Usamos el array validado en lugar de $request->content
        $message = Message::create([
            'content' => $validated['content'],
            'user_id' => Auth::id(),
        ]);

        // 3. Disparamos el evento (cargando el usuario para que el frontend sepa el nombre)
        broadcast(new MessageSend($message->load('user')))->toOthers();

        return redirect()->back();
    }

    public function destroyAll()
    {
        // Solo el administrador puede borrar todo
        if (!Auth::user()->hasRole('administrador')) {
            abort(403);
        }

        Message::truncate();
        return redirect()->back();
    }
}
