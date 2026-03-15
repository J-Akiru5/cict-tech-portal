<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ProfileController
 * 
 * Handles user profile display, updates, and photo uploads.
 */
class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'course' => $user->course,
                'year_level' => $user->year_level,
                'section' => $user->section,
                'phone' => $user->phone,
                'emergency_contact' => $user->emergency_contact,
                'emergency_phone' => $user->emergency_phone,
                'bio' => $user->bio,
                'facebook_url' => $user->facebook_url,
                'photo_url' => $user->photo_url,
            ],
            'courses' => User::COURSES,
            'yearLevels' => User::YEAR_LEVELS,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Handle photo upload to R2 cloud storage
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photo) {
                Storage::disk('r2')->delete($user->photo);
            }
            
            $path = $request->file('photo')->store('profile-photos', 'r2');
            $validated['photo'] = $path;
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Delete profile photo
        if ($user->photo) {
            Storage::disk('r2')->delete($user->photo);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Update the user's callcard background preference.
     */
    public function updateCallcardBackground(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'callcard_background' => ['required', 'string', 'in:default,gold_marble,tech_circuit,dark_honeycomb,galaxy'],
        ]);

        $request->user()->update([
            'callcard_background' => $validated['callcard_background'],
        ]);

        return back();
    }
}
