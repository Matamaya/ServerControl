<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreGameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ponemos esto a true porque la autorización ya la hace nuestro Middleware CheckRole
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url_path' => ['nullable', 'string', 'max:255'], // URL donde vivirá el juego en Vercel/Netlify
            'is_published' => ['boolean'], // Se enviará como true o false
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título del juego es obligatorio.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
        ];
    }
}
