<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

/**
 * AuditLogController
 * 
 * Handles viewing and managing audit logs.
 */
class AuditLogController extends Controller
{
    /**
     * Display audit logs.
     */
    public function index(Request $request): Response
    {
        $query = Activity::with('causer:id,name,email')
            ->orderByDesc('created_at');

        // Search by description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('description', 'LIKE', "%{$search}%");
        }

        // Filter by event type
        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        // Filter by causer
        if ($request->filled('causer')) {
            $query->whereHas('causer', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->causer}%");
            });
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $activities = $query->paginate(20)->withQueryString();

        // Get unique event types for filter
        $eventTypes = Activity::distinct()
            ->pluck('event')
            ->filter()
            ->values()
            ->toArray();

        return Inertia::render('Admin/AuditLogs/Index', [
            'activities' => $activities,
            'eventTypes' => $eventTypes,
            'filters' => $request->only(['search', 'event', 'causer', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show a single activity detail.
     */
    public function show(Activity $activity): Response
    {
        $activity->load('causer:id,name,email', 'subject');

        return Inertia::render('Admin/AuditLogs/Show', [
            'activity' => [
                'id' => $activity->id,
                'log_name' => $activity->log_name,
                'description' => $activity->description,
                'event' => $activity->event,
                'subject_type' => $activity->subject_type,
                'subject_id' => $activity->subject_id,
                'causer' => $activity->causer ? [
                    'id' => $activity->causer->id,
                    'name' => $activity->causer->name,
                    'email' => $activity->causer->email,
                ] : null,
                'properties' => $activity->properties,
                'created_at' => $activity->created_at->toISOString(),
            ],
        ]);
    }

    /**
     * Export audit logs to CSV.
     */
    public function export(Request $request)
    {
        $query = Activity::with('causer:id,name')
            ->orderByDesc('created_at');

        // Apply same filters as index
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $activities = $query->limit(1000)->get();

        $filename = 'audit_logs_' . now()->format('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($activities) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Event', 'Description', 'User', 'Subject Type', 'Subject ID', 'Date']);
            
            foreach ($activities as $activity) {
                fputcsv($file, [
                    $activity->id,
                    $activity->event,
                    $activity->description,
                    $activity->causer?->name ?? 'System',
                    $activity->subject_type,
                    $activity->subject_id,
                    $activity->created_at->toDateTimeString(),
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Clear old audit logs (older than specified days).
     */
    public function clear(Request $request)
    {
        $days = $request->input('days', 90);
        
        $deleted = Activity::where('created_at', '<', now()->subDays($days))->delete();

        return redirect()->route('admin.audit-logs.index')
            ->with('success', "Deleted {$deleted} audit logs older than {$days} days.");
    }
}
