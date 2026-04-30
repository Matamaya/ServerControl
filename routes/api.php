<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GameSessionApiController;

// Rutas públicas de la API
Route::get('/ping', function () {
    return response()->json(['message' => 'API de la Plataforma de Juegos funcionando correctamente.']);
});

// Rutas protegidas de la API (Solo para usuarios autenticados que estén jugando)
Route::middleware('auth:sanctum')->group(function () {
    
    // Gestión de Sesiones de Juego
    Route::post('/games/{game}/start-session', [GameSessionApiController::class, 'startSession']);
    Route::post('/sessions/{session}/emotions', [GameSessionApiController::class, 'storeEmotion']);
    Route::post('/sessions/{session}/end', [GameSessionApiController::class, 'endSession']);

});