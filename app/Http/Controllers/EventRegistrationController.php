<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/**
 * EventRegistrationController
 * 
 * Handles event registration for students.
 */
class EventRegistrationController extends Controller
{
    /**
     * Register for an event
     */
    public function register(Event $event)
    {
        $user = Auth::user();

        // Check if event requires registration
        if (!$event->requires_registration) {
            return back()->with('error', 'This event does not require registration.');
        }

        // Check if registration is open
        if (!$event->is_registration_open) {
            return back()->with('error', 'Registration for this event is closed.');
        }

        // Check if already registered
        $existing = EventRegistration::where('user_id', $user->id)
            ->where('event_id', $event->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existing) {
            return back()->with('error', 'You are already registered for this event.');
        }

        // Check if event is full
        if ($event->max_attendees && $event->activeRegistrations()->count() >= $event->max_attendees) {
            return back()->with('error', 'This event is full.');
        }

        // Create registration
        EventRegistration::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'status' => 'registered',
            'registered_at' => now(),
        ]);

        return back()->with('success', 'Successfully registered for ' . $event->title . '!');
    }

    /**
     * Cancel registration
     */
    public function cancel(EventRegistration $registration)
    {
        $user = Auth::user();

        // Ensure user owns this registration
        if ($registration->user_id !== $user->id) {
            abort(403);
        }

        // Check if event hasn't started yet
        if (!$registration->event->is_upcoming) {
            return back()->with('error', 'Cannot cancel registration for past events.');
        }

        $registration->cancel();

        return back()->with('success', 'Registration cancelled.');
    }

    /**
     * Show user's registered events
     */
    public function myRegistrations(): Response
    {
        $user = Auth::user();

        $registrations = EventRegistration::where('user_id', $user->id)
            ->with('event')
            ->orderByDesc('registered_at')
            ->get()
            ->map(fn($registration) => [
                'id' => $registration->id,
                'status' => $registration->status,
                'registeredAt' => $registration->registered_at->format('M d, Y'),
                'event' => [
                    'id' => $registration->event->id,
                    'title' => $registration->event->title,
                    'slug' => $registration->event->slug,
                    'type' => $registration->event->type,
                    'typeLabel' => $registration->event->type_label,
                    'eventDate' => $registration->event->event_date->format('M d, Y'),
                    'formattedTime' => $registration->event->formatted_time,
                    'location' => $registration->event->location,
                    'coverImage' => $registration->event->cover_image,
                ],
            ]);

        return Inertia::render('Student/Events/MyEvents', [
            'registrations' => $registrations,
        ]);
    }

    /**
     * Mark attendee as attended (admin/officer only)
     */
    public function checkIn(EventRegistration $registration)
    {
        Gate::authorize('manage-events');

        $registration->markAsAttended();

        return back()->with('success', 'Attendee marked as present.');
    }
}
