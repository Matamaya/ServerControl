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
    public function play(Game $game)
    {
        // Seguridad extra: si un jugador adivina la URL de un juego oculto, lo bloqueamos
        if (!$game->is_published) {
            abort(403, 'Este juego no está disponible actualmente.');
        }

        return Inertia::render('Player/Play', [
            'game' => $game
        ]);
    }
}
