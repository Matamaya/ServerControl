<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\GameSession;
use App\Models\EmotionData;
use Carbon\Carbon;

// Rutas públicas de la API (si las hubiera en el futuro)
Route::get('/ping', function () {
    return response()->json(['message' => 'API de la Plataforma de Juegos funcionando correctamente.']);
});

// Rutas protegidas de la API (Solo para usuarios autenticados que estén jugando)
Route::middleware('auth:sanctum')->group(function () {
});


// ¡CUIDADO! Estas rutas están FUERA del middleware auth:sanctum
Route::post('/games/{game}/start-session', function (Request $request, $gameId) {
    // Simulamos que el usuario es el ID 1 por ahora para poder probar
    $session = GameSession::create([
        'user_id' => 1,
        'game_id' => $gameId,
        'started_at' => Carbon::now(),
    ]);
    return response()->json([
        'status' => 'success',
        'session_id' => $session->id
    ]);
});
// El juego envía una emoción detectada en la webcam (por la librería de JS)
Route::post('/sessions/{session}/emotions', function (Request $request, $sessionId) {
    $data = EmotionData::create([
        'game_session_id' => $sessionId,
        'emotion' => $request->emocion,
        'confidence' => $request->confianza,
        'game_time' => $request->time ?? 0,
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Emoción guardada en DB'
    ]);
});