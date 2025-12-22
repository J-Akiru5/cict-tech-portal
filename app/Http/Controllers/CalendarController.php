<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

/**
 * CalendarController
 * 
 * Handles university calendar views including month grid,
 * tunnel timeline, and parallax timeline visualizations.
 */
class CalendarController extends Controller
{
    /**
     * Display the calendar month view.
     */
    public function index(Request $request): Response
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);
        
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();
        
        $events = Event::query()
            ->where('is_active', true)
            ->whereBetween('event_date', [$startOfMonth, $endOfMonth])
            ->orderBy('event_date')
            ->orderBy('start_time')
            ->get()
            ->map(fn($event) => $this->formatEvent($event));

        // Get upcoming featured events
        $featuredEvents = Event::featured()
            ->upcoming()
            ->limit(5)
            ->get()
            ->map(fn($event) => $this->formatEvent($event));

        return Inertia::render('Calendar/Index', [
            'events' => $events,
            'featuredEvents' => $featuredEvents,
            'currentMonth' => $month,
            'currentYear' => $year,
            'monthName' => Carbon::create($year, $month, 1)->format('F Y'),
            'eventTypes' => Event::TYPES,
        ]);
    }

    /**
     * Display the tunnel timeline view.
     */
    public function timeline(Request $request): Response
    {
        $year = $request->get('year', now()->year);
        
        $events = Event::query()
            ->where('is_active', true)
            ->whereYear('event_date', $year)
            ->orderBy('event_date')
            ->get()
            ->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'date' => $event->event_date->format('M d, Y'),
                'month' => $event->event_date->format('F'),
                'day' => $event->event_date->day,
                'type' => $event->type,
                'type_label' => $event->type_label,
                'location' => $event->location,
                'time' => $event->formatted_time,
                'is_featured' => $event->is_featured,
                'is_upcoming' => $event->is_upcoming,
                'slug' => $event->slug,
                'color' => $this->getEventColor($event->type),
            ]);

        // Group events by month
        $eventsByMonth = $events->groupBy('month');

        $availableYears = Event::query()
            ->selectRaw('EXTRACT(YEAR FROM event_date)::integer as year')
            ->distinct()
            ->orderByRaw('year DESC')
            ->pluck('year');

        return Inertia::render('Calendar/Timeline', [
            'events' => $events,
            'eventsByMonth' => $eventsByMonth,
            'currentYear' => $year,
            'availableYears' => $availableYears,
        ]);
    }

    /**
     * Display the parallax timeline view.
     */
    public function parallax(Request $request): Response
    {
        $year = $request->get('year', now()->year);
        
        $events = Event::query()
            ->where('is_active', true)
            ->whereYear('event_date', $year)
            ->orderBy('event_date')
            ->get()
            ->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'date' => $event->event_date->format('M d, Y'),
                'month' => $event->event_date->format('F'),
                'monthShort' => $event->event_date->format('M'),
                'day' => $event->event_date->day,
                'year' => $event->event_date->year,
                'type' => $event->type,
                'type_label' => $event->type_label,
                'location' => $event->location,
                'time' => $event->formatted_time,
                'is_featured' => $event->is_featured,
                'is_online' => $event->is_online,
                'slug' => $event->slug,
                'color' => $this->getEventColor($event->type),
            ]);

        $availableYears = Event::query()
            ->selectRaw('EXTRACT(YEAR FROM event_date)::integer as year')
            ->distinct()
            ->orderByRaw('year DESC')
            ->pluck('year');

        return Inertia::render('Calendar/Parallax', [
            'events' => $events,
            'currentYear' => $year,
            'availableYears' => $availableYears,
        ]);
    }

    /**
     * Display a single event.
     */
    public function show(Event $event): Response
    {
        $event->load('attendees');

        return Inertia::render('Calendar/Event', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'date' => $event->event_date->format('l, F d, Y'),
                'time' => $event->formatted_time,
                'location' => $event->location,
                'is_online' => $event->is_online,
                'meeting_link' => $event->meeting_link,
                'type' => $event->type,
                'type_label' => $event->type_label,
                'is_featured' => $event->is_featured,
                'requires_registration' => $event->requires_registration,
                'registration_open' => $event->is_registration_open,
                'max_attendees' => $event->max_attendees,
                'available_slots' => $event->available_slots,
                'attendees_count' => $event->attendees->count(),
                'slug' => $event->slug,
            ],
            'relatedEvents' => Event::where('type', $event->type)
                ->where('id', '!=', $event->id)
                ->upcoming()
                ->limit(3)
                ->get()
                ->map(fn($e) => $this->formatEvent($e)),
        ]);
    }

    /**
     * Register for an event.
     */
    public function register(Request $request, Event $event)
    {
        if (!$event->is_registration_open) {
            return back()->with('error', 'Registration is closed for this event.');
        }

        $user = $request->user();
        
        // Check if already registered
        if ($event->attendees()->where('user_id', $user->id)->exists()) {
            return back()->with('error', 'You are already registered for this event.');
        }

        $event->attendees()->attach($user->id, [
            'status' => 'registered',
        ]);

        return back()->with('success', 'Successfully registered for ' . $event->title);
    }

    /**
     * Format event for frontend.
     */
    private function formatEvent(Event $event): array
    {
        return [
            'id' => $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'date' => $event->event_date->format('Y-m-d'),
            'displayDate' => $event->event_date->format('M d, Y'),
            'day' => $event->event_date->day,
            'time' => $event->formatted_time,
            'location' => $event->location,
            'type' => $event->type,
            'type_label' => $event->type_label,
            'is_featured' => $event->is_featured,
            'is_today' => $event->is_today,
            'is_upcoming' => $event->is_upcoming,
            'slug' => $event->slug,
            'color' => $this->getEventColor($event->type),
        ];
    }

    /**
     * Get color based on event type.
     */
    private function getEventColor(string $type): string
    {
        return match($type) {
            'seminar' => 'gold',
            'workshop' => 'blue',
            'meeting' => 'purple',
            'social' => 'pink',
            'competition' => 'green',
            default => 'maroon',
        };
    }
}
