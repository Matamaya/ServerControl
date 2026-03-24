<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreGameRequest;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Buscamos solo los juegos creados por el gestor logueado
        $games = Game::where('creator_id', Auth::id())->latest()->get();

        // Le pasamos esos juegos a una vista de React llamada 'Games/Index'
        return Inertia::render('Games/Index', [
            'games' => $games
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Games/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGameRequest $request)
    {
        // 1. Obtenemos los datos ya validados y limpios
        $validatedData = $request->validated();

        // 2. Le añadimos el ID del gestor que lo está creando
        $validatedData['creator_id'] = Auth::id();

        // 3. Guardamos en la base de datos
        Game::create($validatedData);

        // 4. Redirigimos al panel de juegos con un mensaje de éxito
        return redirect()->route('games.index')->with('message', 'Juego creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
