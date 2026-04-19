<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Handle an incoming authentication request via Facial Recognition.
     */
    public function storeFacial(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'foto_webcam' => 'required|file',
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'Usuario no encontrado.']);
        }

        if (!$user->face_photo_path) {
            return back()->withErrors(['facial' => 'El usuario no tiene una foto de registro facial configurada.']);
        }

        $url = env('FACIAL_SERVICE_URL', 'http://10.72.103.250:8181/verify');
        $registroPath = \Illuminate\Support\Facades\Storage::disk('public')->path($user->face_photo_path);

        if (!file_exists($registroPath)) {
            return back()->withErrors(['facial' => 'No se encuentra tu foto de referencia en el servidor.']);
        }

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(60)
                ->attach('img1', file_get_contents($registroPath), 'reg.jpg')
                ->attach('img2', file_get_contents($request->file('foto_webcam')), 'web.jpg')
                ->post($url);

            $respuestaIA = json_decode($response->body(), true);

            if (isset($respuestaIA['error'])) {
                return back()->withErrors(['facial' => 'Error en el servicio de IA: ' . $respuestaIA['error']]);
            }

            if (isset($respuestaIA['distance']) && $respuestaIA['distance'] < 0.35) {
                Auth::login($user);
                $request->session()->regenerate();
                return redirect()->intended(route('dashboard', absolute: false));
            } else {
                return back()->withErrors(['facial' => 'Identidad no confirmada. Las fotos no coinciden.']);
            }
        } catch (\Exception $e) {
            return back()->withErrors(['facial' => 'Error de conexión con IA: ' . $e->getMessage()]);
        }
    }
}
