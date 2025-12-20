<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * ProfileUpdateRequest
 * 
 * Validates profile update form data including extended student fields.
 */
class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Core fields
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            
            // Student info
            'student_id' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'course' => ['nullable', 'string', 'max:10'],
            'year_level' => ['nullable', 'string', 'max:10'],
            'section' => ['nullable', 'string', 'max:10'],
            
            // Contact info
            'phone' => ['nullable', 'string', 'max:20'],
            'emergency_contact' => ['nullable', 'string', 'max:255'],
            'emergency_phone' => ['nullable', 'string', 'max:20'],
            
            // Profile
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:500'],
            
            // Social
            'facebook_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    /**
     * Custom attribute names for validation messages.
     */
    public function attributes(): array
    {
        return [
            'student_id' => 'student ID',
            'year_level' => 'year level',
            'emergency_contact' => 'emergency contact name',
            'emergency_phone' => 'emergency contact phone',
            'facebook_url' => 'Facebook URL',
        ];
    }
}
