<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail;
use App\Mail\EventRegistrationConfirmed;
use App\Notifications\EventRegistrationNotification;

/**
 * EventController
 * 
 * Handles event listing, registration, and attendance for students.
 */
class EventController extends Controller
{
    /**
     * List upcoming events
     */
    public function index(Request $request): Response
    {
        $type = $request->get('type');
        $user = $request->user();
        
        $query = Event::upcoming()->with(['academicYear']);
        
        if ($type) {
            $query->where('type', $type);
        }
        
        $events = $query->get()->map(function ($event) use ($user) {
            $isRegistered = $user ? $event->attendees()->where('user_id', $user->id)->exists() : false;
            
            return [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'description' => $event->description,
                'type' => $event->type,
                'typeLabel' => $event->type_label,
                'eventDate' => $event->event_date->format('M d, Y'),
                'formattedTime' => $event->formatted_time,
                'location' => $event->location,
                'isOnline' => $event->is_online,
                'isToday' => $event->is_today,
                'isFeatured' => $event->is_featured,
                'requiresRegistration' => $event->requires_registration,
                'isRegistrationOpen' => $event->is_registration_open,
                'availableSlots' => $event->available_slots,
                'isRegistered' => $isRegistered,
            ];
        });

        return Inertia::render('Student/Events/Index', [
            'events' => $events,
            'types' => Event::TYPES,
            'selectedType' => $type,
        ]);
    }

    /**
     * Show single event
     */
    public function show(Event $event): Response
    {
        $user = Auth::user();
        $isRegistered = $user ? $event->attendees()->where('user_id', $user->id)->exists() : false;
        $attendance = $isRegistered 
            ? $event->attendees()->where('user_id', $user->id)->first()?->pivot 
            : null;

        return Inertia::render('Student/Events/Show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'type' => $event->type,
                'typeLabel' => $event->type_label,
                'eventDate' => $event->event_date->format('l, F d, Y'),
                'formattedTime' => $event->formatted_time,
                'location' => $event->location,
                'isOnline' => $event->is_online,
                'meetingLink' => $event->meeting_link,
                'requiresRegistration' => $event->requires_registration,
                'isRegistrationOpen' => $event->is_registration_open,
                'registrationDeadline' => $event->registration_deadline?->format('M d, Y g:i A'),
                'maxAttendees' => $event->max_attendees,
                'availableSlots' => $event->available_slots,
                'attendeeCount' => $event->attendees()->count(),
                'coverImage' => $event->cover_image,
                'galleryImages' => $event->gallery_images,
            ],
            'isRegistered' => $isRegistered,
            'attendance' => $attendance ? [
                'status' => $attendance->status,
                'checkedInAt' => $attendance->checked_in_at?->format('M d, Y g:i A'),
            ] : null,
        ]);
    }

    /**
     * Register for an event
     */
    public function register(Event $event)
    {
        $user = Auth::user();

        // Check if registration is open
        if (!$event->is_registration_open) {
            return back()->with('error', 'Registration is closed for this event.');
        }

        // Check if already registered
        if ($event->attendees()->where('user_id', $user->id)->exists()) {
            return back()->with('error', 'You are already registered for this event.');
        }

        // Register
        $event->attendees()->attach($user->id, ['status' => 'registered']);

        // Send In-App Notification
        $user->notify(new EventRegistrationNotification($event));

        // Send Confirmation Email
        try {
            Mail::to($user)->send(new EventRegistrationConfirmed($event, $user));
        } catch (\Exception $e) {
            // Log error but don't fail registration
            \Illuminate\Support\Facades\Log::error('Failed to send registration email: ' . $e->getMessage());
        }

        return back()->with('success', 'You have successfully registered for this event!');
    }

    /**
     * Cancel registration
     */
    public function unregister(Event $event)
    {
        $user = Auth::user();
        
        $event->attendees()->detach($user->id);

        return back()->with('success', 'Your registration has been cancelled.');
    }

    /**
     * My registered events
     */
    public function myEvents(Request $request): Response
    {
        $user = $request->user();
        
        $registeredEvents = $user->events()
            ->orderBy('event_date')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'slug' => $event->slug,
                    'type' => $event->type,
                    'typeLabel' => $event->type_label,
                    'eventDate' => $event->event_date->format('M d, Y'),
                    'formattedTime' => $event->formatted_time,
                    'location' => $event->location,
                    'isToday' => $event->is_today,
                    'isPast' => !$event->is_upcoming,
                    'status' => $event->pivot->status,
                    'checkedInAt' => $event->pivot->checked_in_at,
                ];
            });

        return Inertia::render('Student/Events/MyEvents', [
            'events' => $registeredEvents,
        ]);
    }
}
