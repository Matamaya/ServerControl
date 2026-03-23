<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear los 3 Roles obligatorios de la práctica
        $adminRole = Role::create(['name' => 'administrador', 'description' => 'Administrador del sistema']);
        $gestorRole = Role::create(['name' => 'gestor', 'description' => 'Gestor de juegos']);
        $jugadorRole = Role::create(['name' => 'jugador', 'description' => 'Jugador de la plataforma']);

        // 2. Crear un usuario Administrador y asignarle su rol
        $admin = User::create([
            'name' => 'Admin Jefe',
            'email' => 'admin@correo.com',
            'password' => Hash::make('password123'),
        ]);
        $admin->roles()->attach($adminRole);

        // 3. Crear un usuario Gestor y asignarle su rol
        $gestor = User::create([
            'name' => 'Gestor de Juegos',
            'email' => 'gestor@correo.com',
            'password' => Hash::make('password123'),
        ]);
        $gestor->roles()->attach($gestorRole);

        // 4. Crear un usuario Jugador y asignarle su rol
        $jugador = User::create([
            'name' => 'Jugador Pro',
            'email' => 'jugador@correo.com',
            'password' => Hash::make('password123'),
        ]);
        $jugador->roles()->attach($jugadorRole);
    }
}
