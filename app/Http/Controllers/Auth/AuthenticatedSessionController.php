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
            $capturedPhoto = $request->file('foto_webcam');
            
            // Verificamos conectividad antes de proceder (opcional, pero ayuda al debug)
            $response = \Illuminate\Support\Facades\Http::timeout(60) // Aumentado a 60s por si está descargando modelos
                ->attach('img1', file_get_contents($registroPath), 'reg.jpg')
                ->attach('img2', file_get_contents($capturedPhoto), 'web.jpg')
                ->post($url);

            if ($response->failed()) {
                return back()->withErrors(['facial' => 'El servicio de reconocimiento facial no responde. ¿Está el microservicio (Docker) y ngrok/localhost activos?']);
            }

            $respuestaIA = json_decode($response->body(), true);
            \Illuminate\Support\Facades\Log::info('Respuesta Facial AI:', ['response' => $respuestaIA]);

            if (isset($respuestaIA['error'])) {
                // El microservicio respondió pero con un error (ej. no se detectó cara)
                return back()->withErrors(['facial' => 'Fallo en la detección: ' . $respuestaIA['error']]);
            }

            $distance = $respuestaIA['distance'] ?? 1.0;

            // Umbral de Facenet: 0.40 - 0.42 es un buen equilibrio.
            if ($distance < 0.42) {
                Auth::login($user);
                $request->session()->regenerate();
                return redirect()->intended(route('dashboard', absolute: false));
            } else {
                // Guardar para depuración si falla la coincidencia
                $debugName = time() . '_u' . $user->id . '_dist_' . str_replace('.', '', (string)$distance);
                \Illuminate\Support\Facades\Storage::disk('public')->put('debug/' . $debugName . '_webcam.jpg', file_get_contents($capturedPhoto));
                \Illuminate\Support\Facades\Storage::disk('public')->copy($user->face_photo_path, 'debug/' . $debugName . '_reference.jpg');

                return back()->withErrors([
                    'facial' => "Tu identidad no ha podido ser confirmada (Distancia: $distance). Intenta mejorar la iluminación o la posición de tu cara."
                ]);
            }
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            \Illuminate\Support\Facades\Log::error('Error de conexión Facial:', ['msg' => $e->getMessage()]);
            return back()->withErrors(['facial' => 'No se pudo conectar con el servidor de IA. Verifica que el puerto 8181 esté abierto en Docker o que la URL en .env sea correcta.']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error Facial Genérico:', ['msg' => $e->getMessage()]);
            return back()->withErrors(['facial' => 'Ocurrió un error inesperado: ' . $e->getMessage()]);
        }
    }
}
