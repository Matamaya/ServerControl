<?php
namespace App\Http\Controllers;

use App\Models\GameSession;
use Inertia\Inertia;

class GameSessionController extends Controller
{
    public function latest()
    {
        $session = GameSession::with(['emotionData', 'user'])->latest('id')->first();

        return Inertia::render('Sessions/showStats', [
            'session' => $session
        ]);
    }

    public function show(GameSession $session)
    {
        // Cargamos la sesión con sus emociones y el usuario que jugó
        $session->load(['emotionData', 'user']);

        return Inertia::render('Sessions/showStats', [
            'session' => $session
        ]);
    }
}

?>