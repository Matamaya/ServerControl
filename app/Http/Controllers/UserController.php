<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Inertia\Inertia;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Traemos todos los usuarios y cargamos la relación 'roles'
        $users = User::with('roles')->latest()->get();

        // Traemos todos los roles disponibles (Admin, Gestor, Jugador)
        $roles = Role::all();

        return Inertia::render('Admin/Index', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Le pasamos los roles a la vista para rellenar el <select>
        $roles = Role::all();

        return Inertia::render('Admin/Create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // 1. Creamos el usuario con los datos validados y encriptamos la contraseña
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 2. Le asignamos el rol que el administrador ha elegido en el formulario
        $user->roles()->attach($request->role_id);

        // 3. Redirigimos al panel de usuarios
        return redirect()->route('users.index')->with('message', 'Usuario creado y rol asignado correctamente.');
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
    public function edit(User $user)
    {
        $roles = Role::all();

        // Cargamos los roles que ya tiene el usuario para marcarlos en el formulario
        $user->load('roles');

        return Inertia::render('Admin/Edit', [
            'userToEdit' => $user, // Le llamamos userToEdit para no confundirlo con el auth.user (el admin)
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // 1. Actualizamos los datos básicos
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // 2. Sincronizamos los roles. 
        // El método sync() borra los roles anteriores y pone el nuevo automáticamente.
        $user->roles()->sync([$request->role_id]);

        return redirect()->route('users.index')->with('message', 'Usuario actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Regla de oro: Un admin no puede borrarse a sí mismo
        if ($user->id === Auth::id()) {
            abort(403, 'No puedes eliminar tu propia cuenta de administrador.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('message', 'Usuario eliminado correctamente.');
    }
}
