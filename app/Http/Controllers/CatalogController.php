<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Controlador específico para la vista del jugador
class CatalogController extends Controller
{
    // Muestra la lista de juegos al jugador
    public function index()
    {
        // Filtramos para que solo lleguen los publicados
        $games = Game::where('is_published', true)->latest()->get();

        return Inertia::render('Player/Catalog', [
            'games' => $games
        ]);
    }

    // Carga la vista para jugar a un juego específico
    public function play(Request $request, Game $game)
    {
        // Seguridad extra: si un jugador adivina la URL de un juego oculto, lo bloqueamos
        if (!$game->is_published) {
            abort(403, 'Este juego no está disponible actualmente.');
        }

        // Generamos un token temporal para el consumo de la API desde el juego (Vercel)
        // El token se borrará automáticamente cuando se cierre la sesión de juego
        $token = $request->user()->createToken('game-access')->plainTextToken;

        return Inertia::render('Player/Play', [
            'game' => $game,
            'gameToken' => $token
        ]);
    }
}
