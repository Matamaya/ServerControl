<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GameController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\UserController;

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
    // Panel principal de gestión de usuarios
    Route::resource('users', UserController::class);
});

// Rutas del CRUD de Juegos exclusivas para el GESTOR
Route::middleware(['auth', 'role:gestor'])->group(function () {
    // Esto crea automáticamente las rutas /games, /games/create, etc.
    Route::resource('games', GameController::class);
});

// Rutas solo para JUGADORES
Route::middleware(['auth', 'role:jugador'])->group(function () {
    Route::get('/catalogo', [CatalogController::class, 'index'])->name('catalog.index');
    Route::get('/jugar/{game}', [CatalogController::class, 'play'])->name('catalog.play');
});

require __DIR__ . '/auth.php';
