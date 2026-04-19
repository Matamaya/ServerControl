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

        // Procesar la imagen Base64 genérica
        $imageData = $request->input('image');
        
        $imageParts = explode(";base64,", $imageData);
        $imageTypeAux = explode("image/", $imageParts[0]);
        $imageType = $imageTypeAux[1] ?? 'jpg';
        
        $imageBase64 = base64_decode($imageParts[1]);
        $imageName = 'face_reference_' . $user->id . '.' . $imageType;

        // Guardar en el disco 'public'
        Storage::disk('public')->put('faces/' . $imageName, $imageBase64);

        // Actualizar la ruta en el usuario
        $user->update([
            'face_photo_path' => 'faces/' . $imageName,
        ]);

        return redirect()->back()->with('message', '¡Rostro registrado con éxito!');
    }
}