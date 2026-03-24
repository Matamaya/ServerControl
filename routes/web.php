<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// Rutas solo para GESTORES (y podríamos añadir admins luego)
Route::middleware(['auth', 'role:gestor'])->group(function () {
    Route::get('/panel-juegos', function () {
        return '¡Hola Gestor! Aquí irá tu CRUD de juegos de React/Inertia.';
    });
});


// Rutas solo para JUGADORES
Route::middleware(['auth', 'role:jugador'])->group(function () {
    Route::get('/mis-juegos', function () {
        return '¡Hola Jugador! Aquí verás la lista de juegos publicados.';
    });
});

require __DIR__ . '/auth.php';
