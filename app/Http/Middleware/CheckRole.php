<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // 1. Usamos la Facade Auth, que los editores reconocen perfectamente
        if (!Auth::check()) {
            return redirect('/login');
        }

        /** @var \App\Models\User $user */
        $user = $request->user();

        // 2. Comprobamos si NO tiene el rol requerido
        if (!$user->hasRole($role)) {
            abort(403, 'Acceso denegado. No tienes permisos de ' . $role . ' para ver esta página.');
        }

        return $next($request);
    }
}
