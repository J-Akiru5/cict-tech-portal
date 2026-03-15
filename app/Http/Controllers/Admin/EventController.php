<?php

namespace App\Http\Controllers\Admin;

use App\Models\Event;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

/**
 * EventController
 * 
 * Admin CRUD for university calendar events.
 * Uses Spatie Activity Log for audit trailing.
 */
class EventController extends Controller
{
    /**
     * Display the admin calendar with all events.
     */
    public function index(Request $request): Response
    {
        $events = Event::query()
            ->with('academicYear')
            ->orderBy('event_date', 'desc')
            ->get()
            ->map(fn($event) => $this->formatEventForCalendar($event));

        $academicYears = AcademicYear::orderByDesc('year_start')->get();

        return Inertia::render('Admin/Calendar/Index', [
            'events' => $events,
            'eventTypes' => Event::TYPES,
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Store a new event.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:seminar,workshop,meeting,social,competition,other'],
            'event_date' => ['required', 'date'],
            'start_time' => ['nullable', 'string'],
            'end_time' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_online' => ['boolean'],
            'meeting_link' => ['nullable', 'url', 'max:500'],
            'requires_registration' => ['boolean'],
            'max_attendees' => ['nullable', 'integer', 'min:1'],
            'registration_deadline' => ['nullable', 'date'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
            'cover_image' => ['nullable', 'image', 'max:10240'], // 10MB Max
            'gallery_images.*' => ['image', 'max:10240'], // 10MB Max per image
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);

        // Handle Cover Image Upload to R2
        $coverUploaded = false;
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('events/covers', 'r2');
            $validated['cover_image'] = $path;
            $coverUploaded = true;
        }

        // Handle Gallery Images Upload to R2
        $galleryCount = 0;
        if ($request->hasFile('gallery_images')) {
            $galleryPaths = [];
            foreach ($request->file('gallery_images') as $image) {
                $galleryPaths[] = $image->store('events/gallery', 'r2');
                $galleryCount++;
            }
            $validated['gallery_images'] = $galleryPaths; // Eloquent casts array to JSON
        }

        $event = Event::create($validated);

        activity()
            ->performedOn($event)
            ->causedBy(auth()->user())
            ->withProperties(['title' => $event->title])
            ->log('created event');

        $message = 'Event created successfully.';
        if ($coverUploaded && $galleryCount > 0) {
            $message .= " Cover image and {$galleryCount} gallery images uploaded to cloud storage.";
        } elseif ($coverUploaded) {
            $message .= ' Cover image uploaded to cloud storage.';
        } elseif ($galleryCount > 0) {
            $message .= " {$galleryCount} gallery images uploaded to cloud storage.";
        }
        
        return back()->with('success', $message);
    }

    /**
     * Update an existing event.
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:seminar,workshop,meeting,social,competition,other'],
            'event_date' => ['required', 'date'],
            'start_time' => ['nullable', 'string'],
            'end_time' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'is_online' => ['boolean'],
            'meeting_link' => ['nullable', 'url', 'max:500'],
            'requires_registration' => ['boolean'],
            'max_attendees' => ['nullable', 'integer', 'min:1'],
            'registration_deadline' => ['nullable', 'date'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'academic_year_id' => ['nullable', 'exists:academic_years,id'],
            'cover_image' => ['nullable', 'image', 'max:10240'], // 10MB Max
            'gallery_images.*' => ['image', 'max:10240'], // 10MB Max per image
        ]);

        // Handle Cover Image Upload to R2
        $coverUploaded = false;
        if ($request->hasFile('cover_image')) {
            // Delete old image from R2 if exists
            if ($event->cover_image) {
                Storage::disk('r2')->delete($event->cover_image);
            }
            $path = $request->file('cover_image')->store('events/covers', 'r2');
            $validated['cover_image'] = $path;
            $coverUploaded = true;
        }

        // Handle Gallery Images Upload to R2
        $galleryCount = 0;
        if ($request->hasFile('gallery_images')) {
            // Delete old images from R2
            if ($event->gallery_images) {
                foreach ($event->gallery_images as $oldImage) {
                    Storage::disk('r2')->delete($oldImage);
                }
            }

            $galleryPaths = [];
            foreach ($request->file('gallery_images') as $image) {
                $galleryPaths[] = $image->store('events/gallery', 'r2');
                $galleryCount++;
            }
            $validated['gallery_images'] = $galleryPaths;
        }

        $event->update($validated);

        activity()
            ->performedOn($event)
            ->causedBy(auth()->user())
            ->withProperties(['title' => $event->title])
            ->log('updated event');

        $message = 'Event updated successfully.';
        if ($coverUploaded && $galleryCount > 0) {
            $message .= " New cover image and {$galleryCount} gallery images uploaded to cloud storage.";
        } elseif ($coverUploaded) {
            $message .= ' New cover image uploaded to cloud storage.';
        } elseif ($galleryCount > 0) {
            $message .= " {$galleryCount} new gallery images uploaded to cloud storage.";
        }
        
        return back()->with('success', $message);
    }

    /**
     * Delete an event (soft delete).
     */
    public function destroy(Event $event)
    {
        $title = $event->title;
        $event->delete();

        activity()
            ->causedBy(auth()->user())
            ->withProperties(['title' => $title])
            ->log('deleted event');

        return back()->with('success', 'Event deleted successfully.');
    }

    /**
     * Get events for a specific date range (AJAX).
     */
    public function fetchEvents(Request $request)
    {
        $start = $request->get('start');
        $end = $request->get('end');

        $events = Event::query()
            ->where('is_active', true)
            ->when($start, fn($q) => $q->where('event_date', '>=', $start))
            ->when($end, fn($q) => $q->where('event_date', '<=', $end))
            ->get()
            ->map(fn($event) => $this->formatEventForCalendar($event));

        return response()->json($events);
    }

    /**
     * Format event for FullCalendar.
     */
    private function formatEventForCalendar(Event $event): array
    {
        $colors = [
            'seminar' => ['background' => '#d4a017', 'border' => '#b8860b'],
            'workshop' => ['background' => '#3b82f6', 'border' => '#2563eb'],
            'meeting' => ['background' => '#8b5cf6', 'border' => '#7c3aed'],
            'social' => ['background' => '#ec4899', 'border' => '#db2777'],
            'competition' => ['background' => '#22c55e', 'border' => '#16a34a'],
            'other' => ['background' => '#7f1d1d', 'border' => '#991b1b'],
        ];

        $typeColors = $colors[$event->type] ?? $colors['other'];

        return [
            'id' => (string) $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'start' => $event->event_date->format('Y-m-d') . ($event->start_time ? 'T' . $event->start_time : ''),
            'end' => $event->event_date->format('Y-m-d') . ($event->end_time ? 'T' . $event->end_time : ''),
            'allDay' => !$event->start_time,
            'backgroundColor' => $typeColors['background'],
            'borderColor' => $typeColors['border'],
            'textColor' => '#ffffff',
            'extendedProps' => [
                'type' => $event->type,
                'type_label' => $event->type_label,
                'location' => $event->location,
                'is_online' => $event->is_online,
                'meeting_link' => $event->meeting_link,
                'requires_registration' => $event->requires_registration,
                'max_attendees' => $event->max_attendees,
                'is_featured' => $event->is_featured,
                'is_active' => $event->is_active,
                'slug' => $event->slug,
                'academic_year_id' => $event->academic_year_id,
                'registration_deadline' => $event->registration_deadline?->format('Y-m-d'),
                'cover_image' => $event->cover_image,
                'gallery_images' => $event->gallery_images,
            ],
        ];
    }
}
