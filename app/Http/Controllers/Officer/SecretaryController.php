<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\MeetingNote;
use App\Models\Officer;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * SecretaryController
 * 
 * Handles meeting notes management for the Secretary role.
 */
class SecretaryController extends Controller
{
    /**
     * List all meeting notes
     */
    public function index(Request $request): Response
    {
        $status = $request->get('status');
        
        $query = MeetingNote::with(['author', 'academicYear'])
            ->recent();
        
        if ($status) {
            $query->where('status', $status);
        }
        
        $meetings = $query->get()->map(fn($meeting) => [
            'id' => $meeting->id,
            'title' => $meeting->title,
            'slug' => $meeting->slug,
            'type' => $meeting->type,
            'typeLabel' => $meeting->type_label,
            'meetingDate' => $meeting->meeting_date->format('M d, Y'),
            'formattedTime' => $meeting->formatted_time,
            'venue' => $meeting->venue,
            'status' => $meeting->status,
            'statusLabel' => $meeting->status_label,
            'authorName' => $meeting->author?->name,
            'attendeeCount' => $meeting->attendees()->count(),
        ]);

        return Inertia::render('Officer/Secretary/Index', [
            'meetings' => $meetings,
            'statuses' => MeetingNote::STATUSES,
            'selectedStatus' => $status,
        ]);
    }

    /**
     * Show create form
     */
    public function create(): Response
    {
        $officers = Officer::currentYear()
            ->with('user')
            ->get()
            ->map(fn($officer) => [
                'id' => $officer->id,
                'name' => $officer->name,
                'position' => $officer->position,
            ]);

        return Inertia::render('Officer/Secretary/Create', [
            'types' => MeetingNote::TYPES,
            'officers' => $officers,
        ]);
    }

    /**
     * Store a new meeting note
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:regular,emergency,special,committee'],
            'meeting_date' => ['required', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'venue' => ['nullable', 'string', 'max:255'],
            'agenda' => ['nullable', 'string'],
            'minutes' => ['nullable', 'string'],
            'resolutions' => ['nullable', 'string'],
            'action_items' => ['nullable', 'string'],
            'attendees' => ['nullable', 'array'],
            'attendees.*.officer_id' => ['required', 'exists:officers,id'],
            'attendees.*.status' => ['required', 'in:present,absent,late,excused'],
        ]);

        $meeting = MeetingNote::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'meeting_date' => $validated['meeting_date'],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'venue' => $validated['venue'] ?? null,
            'agenda' => $validated['agenda'] ?? null,
            'minutes' => $validated['minutes'] ?? null,
            'resolutions' => $validated['resolutions'] ?? null,
            'action_items' => $validated['action_items'] ?? null,
            'created_by' => Auth::id(),
            'status' => 'draft',
            'academic_year_id' => AcademicYear::getCurrentYear()?->id,
        ]);

        // Attach attendees
        if (!empty($validated['attendees'])) {
            foreach ($validated['attendees'] as $attendee) {
                $meeting->attendees()->attach($attendee['officer_id'], [
                    'status' => $attendee['status'],
                ]);
            }
        }

        return redirect()->route('officer.secretary.index')
            ->with('success', 'Meeting note created successfully!');
    }

    /**
     * Show a meeting note
     */
    public function show(MeetingNote $meeting): Response
    {
        $meeting->load(['author', 'approver', 'attendees.user']);

        return Inertia::render('Officer/Secretary/Show', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'type' => $meeting->type,
                'typeLabel' => $meeting->type_label,
                'meetingDate' => $meeting->meeting_date->format('l, F d, Y'),
                'formattedTime' => $meeting->formatted_time,
                'venue' => $meeting->venue,
                'agenda' => $meeting->agenda,
                'minutes' => $meeting->minutes,
                'resolutions' => $meeting->resolutions,
                'actionItems' => $meeting->action_items,
                'status' => $meeting->status,
                'statusLabel' => $meeting->status_label,
                'authorName' => $meeting->author?->name,
                'approverName' => $meeting->approver?->name,
                'approvedAt' => $meeting->approved_at?->format('M d, Y g:i A'),
                'createdAt' => $meeting->created_at->format('M d, Y'),
                'attendees' => $meeting->attendees->map(fn($officer) => [
                    'id' => $officer->id,
                    'name' => $officer->name,
                    'position' => $officer->position,
                    'status' => $officer->pivot->status,
                    'photoUrl' => $officer->photo_url,
                ]),
            ],
        ]);
    }

    /**
     * Edit form
     */
    public function edit(MeetingNote $meeting): Response
    {
        $officers = Officer::currentYear()
            ->with('user')
            ->get()
            ->map(fn($officer) => [
                'id' => $officer->id,
                'name' => $officer->name,
                'position' => $officer->position,
            ]);

        $existingAttendees = $meeting->attendees->map(fn($officer) => [
            'officer_id' => $officer->id,
            'status' => $officer->pivot->status,
        ]);

        return Inertia::render('Officer/Secretary/Edit', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'type' => $meeting->type,
                'meeting_date' => $meeting->meeting_date->format('Y-m-d'),
                'start_time' => $meeting->start_time,
                'end_time' => $meeting->end_time,
                'venue' => $meeting->venue,
                'agenda' => $meeting->agenda,
                'minutes' => $meeting->minutes,
                'resolutions' => $meeting->resolutions,
                'action_items' => $meeting->action_items,
                'status' => $meeting->status,
                'attendees' => $existingAttendees,
            ],
            'types' => MeetingNote::TYPES,
            'officers' => $officers,
        ]);
    }

    /**
     * Update a meeting note
     */
    public function update(Request $request, MeetingNote $meeting)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:regular,emergency,special,committee'],
            'meeting_date' => ['required', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'venue' => ['nullable', 'string', 'max:255'],
            'agenda' => ['nullable', 'string'],
            'minutes' => ['nullable', 'string'],
            'resolutions' => ['nullable', 'string'],
            'action_items' => ['nullable', 'string'],
            'attendees' => ['nullable', 'array'],
        ]);

        $meeting->update($validated);

        // Sync attendees
        if (isset($validated['attendees'])) {
            $syncData = [];
            foreach ($validated['attendees'] as $attendee) {
                $syncData[$attendee['officer_id']] = ['status' => $attendee['status']];
            }
            $meeting->attendees()->sync($syncData);
        }

        return redirect()->route('officer.secretary.show', $meeting)
            ->with('success', 'Meeting note updated!');
    }

    /**
     * Submit for approval
     */
    public function submit(MeetingNote $meeting)
    {
        $meeting->update(['status' => 'pending_approval']);
        
        return back()->with('success', 'Meeting note submitted for approval.');
    }

    /**
     * Approve a meeting note (President/Adviser only)
     */
    public function approve(MeetingNote $meeting)
    {
        $meeting->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);
        
        return back()->with('success', 'Meeting note approved!');
    }
}
