<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas de la API (si las hubiera en el futuro)
Route::get('/ping', function () {
    return response()->json(['message' => 'API de la Plataforma de Juegos funcionando correctamente.']);
});

// Rutas protegidas de la API (Solo para usuarios autenticados que estén jugando)
Route::middleware('auth:sanctum')->group(function () {

    // Aquí el juego enviará una petición POST cuando el jugador le dé a "Start"
    Route::post('/games/{game}/start-session', function ($game) {
        // En el futuro, aquí crearemos la sesión en la base de datos
        // y devolveremos el ID de la sesión al juego.
        return response()->json([
            'status' => 'success',
            'message' => 'Sesión de juego iniciada correctamente para el juego ID: ' . $game,
            'session_id' => uniqid() // Simulamos un ID de sesión por ahora
        ]);
    });
});
