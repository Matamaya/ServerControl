<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GameController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas exclusivas para el ADMINISTRADOR
Route::middleware(['auth', 'role:administrador'])->group(function () {
    Route::get('/panel-usuarios', function () {
        return 'Aquí el admin podrá crear, borrar y asignar roles a los usuarios.';
    });
});

// Rutas del CRUD de Juegos exclusivas para el GESTOR
Route::middleware(['auth', 'role:gestor'])->group(function () {
    // Esto crea automáticamente las rutas /games, /games/create, etc.
    Route::resource('games', GameController::class);
});


// Rutas solo para JUGADORES
Route::middleware(['auth', 'role:jugador'])->group(function () {
    Route::get('/mis-juegos', function () {
        return '¡Hola Jugador! Aquí verás la lista de juegos publicados.';
    });
});

require __DIR__ . '/auth.php';
