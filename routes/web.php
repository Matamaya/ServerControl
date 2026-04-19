<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FaceEnrollmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GameController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

// Rutas para el registro facial de soporte
Route::middleware('auth')->group(function () {
    Route::get('/profile/face-enrollment', [FaceEnrollmentController::class, 'index'])->name('face.enrollment');
    Route::post('/profile/face-enrollment', [FaceEnrollmentController::class, 'store'])->name('face.enrollment.store');
});

// Ruta GET: Sirve para MOSTRAR la página con el formulario y la cámara
Route::get('/test-facial', function () {
    return view('test-facial'); // Asegúrate de que tu archivo se llama test-facial.blade.php
});

// Ruta POST: Sirve para PROCESAR las fotos cuando el usuario le da a "Enviar"
Route::post('/test-facial', function (Request $request) {
    // 1. Verificación básica
    if (!$request->hasFile('foto_registro') || !$request->hasFile('foto_webcam')) {
        return back()->withErrors(['Faltan imágenes o superan el límite de PHP.']);
    }

    $url = env('FACIAL_SERVICE_URL', 'http://10.72.103.250:8181/verify');

    try {
        // 2. Comunicación con el microservicio Docker
        $response = Http::timeout(60)
            ->attach('img1', file_get_contents($request->file('foto_registro')), 'reg.jpg')
            ->attach('img2', file_get_contents($request->file('foto_webcam')), 'web.jpg')
            ->post($url);

        // 3. Devolución de resultados a la vista
        // Decodificamos la respuesta de la IA a un array de PHP
        $respuestaIA = json_decode($response->body(), true);

        // Se lo pasamos a la vista
        return view('test-facial', ['respuesta' => $respuestaIA]);
    } catch (\Exception $e) {
        return back()->withErrors(['Error de conexión con Docker: ' . $e->getMessage()]);
    }
});

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
