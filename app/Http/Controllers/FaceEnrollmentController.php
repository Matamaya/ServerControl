<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FaceEnrollmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile/FaceEnrollment');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
        ]);

        $user = Auth::user();

        // Procesar la imagen Base64
        $imageData = $request->input('image');
        $image = str_replace('data:image/png;base64,', '', $imageData);
        $image = str_replace(' ', '+', $image);
        $imageName = 'face_reference_' . $user->id . '.png';

        // Guardar en el disco 'public'
        Storage::disk('public')->put('faces/' . $imageName, base64_decode($image));

        // Actualizar la ruta en el usuario
        $user->update([
            'face_photo_path' => 'faces/' . $imageName,
        ]);

        return redirect()->back()->with('message', '¡Rostro registrado con éxito!');
    }
}