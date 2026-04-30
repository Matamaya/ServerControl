<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Game;
use App\Models\GameSession;
use App\Models\EmotionData;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GameSessionApiController extends Controller
{
    /**
     * Inicia una nueva sesión de juego.
     */
    public function startSession(Request $request, Game $game)
    {
        $user = $request->user();

        // 1. Validaciones básicas
        if (!$game->is_published) {
             return response()->json(['error' => 'Este juego no está disponible.'], 403);
        }

        // 2. Control de acceso simple
        // Solo verificamos rol 'jugador' de forma estricta si no es admin/gestor
        if (!$user->hasRole('jugador') && !$user->hasRole('admin') && !$user->hasRole('gestor')) {
            return response()->json(['error' => 'Permisos insuficientes para registrar partidas.'], 403);
        }

        // 3. Creación de la sesión
        $session = GameSession::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'started_at' => now(),
            'status' => 'active'
        ]);

        return response()->json([
            'status' => 'success',
            'session_id' => $session->id,
            'message' => 'Sesión iniciada correctamente'
        ], 201);
    }

    /**
     * Guarda un dato de emoción detectada por el cliente.
     */
    public function storeEmotion(Request $request, GameSession $session)
    {
        // 1. Seguridad: Verificar que la sesión pertenece al usuario
        if ($session->user_id !== $request->user()->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        if ($session->status !== 'active') {
            return response()->json(['error' => 'La sesión ya ha finalizado'], 400);
        }

        // 2. Validación de datos (Interpretados, no imágenes)
        $validated = $request->validate([
            'emotion'    => 'required|string',
            'confidence' => 'required|numeric|min:0|max:1',
            'game_time'  => 'nullable|integer'
        ]);

        // 3. Control de Frecuencia (Throttling): Máximo 1 dato cada 2 segundos por sesión
        $lastEmotion = EmotionData::where('game_session_id', $session->id)
            ->latest()
            ->first();

        if ($lastEmotion && $lastEmotion->created_at->diffInSeconds(now()) < 2) {
             return response()->json([
                 'status' => 'ignored',
                 'message' => 'Frecuencia de envío demasiado alta'
             ], 200); // Retornamos 200 para no romper el flujo del front, pero ignoramos el dato
        }

        // 4. Persistencia
        $session->emotionData()->create([
            'emotion'    => $validated['emotion'],
            'confidence' => $validated['confidence'],
            'game_time'  => $validated['game_time'] ?? 0,
        ]);

        return response()->json(['status' => 'success']);
    }

    /**
     * Finaliza la sesión de juego.
     */
    public function endSession(Request $request, GameSession $session)
    {
        if ($session->user_id !== $request->user()->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $now = now();
        $duration = $session->started_at->diffInSeconds($now);

        $session->update([
            'finished_at' => $now,
            'duration'    => $duration,
            'score'       => $request->score ?? 0,
            'status'      => 'finished'
        ]);

        // Borramos el token actual de acceso para que no pueda ser reutilizado
        // Esto cumple con el requisito de que el token expire al acabar la sesión
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'   => 'success',
            'duration' => $duration,
            'message'  => 'Sesión finalizada y token revocado'
        ]);
    }
}
