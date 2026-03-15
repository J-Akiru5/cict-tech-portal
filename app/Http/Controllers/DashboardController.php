<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * DashboardController
 * 
 * Handles role-based dashboard routing and views.
 */
class DashboardController extends Controller
{
    /**
     * Redirect to appropriate dashboard based on user role
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        // Redirect based on role
        if ($user->hasRole('main-admin')) {
            return redirect()->route('admin.dashboard');
        }
        
        if ($user->hasAnyRole(['sc-president', 'sc-officer', 'sc-secretary', 'sc-treasurer', 'sc-adviser', 'dean'])) {
            return redirect()->route('officer.dashboard');
        }
        
        return redirect()->route('student.dashboard');
    }

    /**
     * Admin Dashboard
     */
    public function adminDashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->getAdminStats(),
            'userGrowth' => $this->getUserGrowthData(),
            'enrollmentByProgram' => $this->getEnrollmentByProgram(),
            'enrollmentByYearLevel' => $this->getEnrollmentByYearLevel(),
            'paymentStatus' => $this->getPaymentStatus(),
            'eventStats' => $this->getEventStats(),
            'dutyStats' => $this->getDutyStats(),
            'recentActivity' => $this->getRecentActivity(),
        ]);
    }

    /**
     * Officer Dashboard
     */
    public function officerDashboard(Request $request): Response
    {
        $user = $request->user();
        
        return Inertia::render('Officer/Dashboard', [
            'user' => [
                'name' => $user->name,
                'roles' => $user->getRoleNames(),
                'photo_url' => $user->photo_url,
            ],
            'stats' => $this->getOfficerStats($user),
        ]);
    }

    /**
     * Student Dashboard
     */
    public function studentDashboard(Request $request): Response
    {
        $user = $request->user();
        
        // Get vital metrics
        $enrollment = $user->currentEnrollment();
        
        return Inertia::render('Student/Dashboard', [
            'user' => [
                'name' => $user->name,
                'student_id' => $user->student_id,
                'course' => $user->course,
                'year_level' => $user->year_level,
                'section' => $user->section,
                'photo_url' => $user->photo_url,
                'callcard_background' => $user->callcard_background ?? 'default',
            ],
            'vitalMetrics' => [
                'enrollment_status' => $enrollment?->status ?? 'not_enrolled',
                'absences' => $user->required_event_absences,
                'total_required_events' => $user->total_required_events,
                'outstanding_balance' => $user->outstanding_balance,
                'fee_paid' => $enrollment?->fee_paid ?? false,
            ],
            'announcements' => $this->getLatestAnnouncements(),
            'dutyOfficer' => $this->getTodayDutyOfficer(),
        ]);
    }

    /**
     * Helpers
     */
    private function getAdminStats(): array
    {
        return Cache::remember('dashboard:admin:stats', 300, function () {
            // Single optimized query instead of 6 separate queries
            $stats = DB::selectOne("
                SELECT 
                    (SELECT COUNT(*) FROM users) as total_users,
                    (SELECT COUNT(*) FROM officers) as total_officers,
                    (SELECT COUNT(*) FROM announcements) as total_announcements,
                    (SELECT COUNT(*) FROM payment_records WHERE status = 'pending') as pending_payments,
                    (SELECT COUNT(*) FROM enrollments WHERE status = 'enrolled') as enrolled_students
            ");

            return [
                'total_users' => $stats->total_users ?? 0,
                'total_officers' => $stats->total_officers ?? 0,
                'total_announcements' => $stats->total_announcements ?? 0,
                'active_academic_year' => \App\Models\AcademicYear::getCurrentYear()?->label ?? 'Not set',
                'pending_payments' => $stats->pending_payments ?? 0,
                'enrolled_students' => $stats->enrolled_students ?? 0,
            ];
        });
    }

    private function getUserGrowthData(): array
    {
        return Cache::remember('dashboard:admin:user_growth', 600, function () {
            // Single query with date aggregation instead of 6 separate queries
            $results = DB::select("
                SELECT 
                    TO_CHAR(created_at, 'Mon') as month,
                    TO_CHAR(created_at, 'YYYY-MM') as month_key,
                    COUNT(*) as users
                FROM users
                WHERE created_at >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR(created_at, 'Mon'), TO_CHAR(created_at, 'YYYY-MM')
                ORDER BY month_key ASC
            ");

            return array_map(fn($row) => [
                'month' => $row->month,
                'users' => (int) $row->users,
            ], $results);
        });
    }

    private function getEnrollmentByProgram(): array
    {
        return Cache::remember('dashboard:admin:enrollment_by_program', 600, function () {
            return \App\Models\User::whereNotNull('course')
                ->select('course')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('course')
                ->orderByDesc('count')
                ->limit(5)
                ->get()
                ->map(fn($item) => ['program' => $item->course ?? 'Other', 'count' => $item->count])
                ->toArray();
        });
    }

    /**
     * Enrollment statistics by year level
     */
    private function getEnrollmentByYearLevel(): array
    {
        return Cache::remember('dashboard:admin:enrollment_by_year', 600, function () {
            return \App\Models\User::whereNotNull('year_level')
                ->select('year_level')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('year_level')
                ->orderBy('year_level')
                ->get()
                ->map(fn($item) => [
                    'year_level' => $this->formatYearLevel($item->year_level),
                    'count' => $item->count
                ])
                ->toArray();
        });
    }

    /**
     * Format year level for display
     */
    private function formatYearLevel($year): string
    {
        $labels = [1 => '1st Year', 2 => '2nd Year', 3 => '3rd Year', 4 => '4th Year', 5 => '5th Year'];
        return $labels[$year] ?? "Year {$year}";
    }

    /**
     * Event statistics - total, upcoming, by type
     */
    private function getEventStats(): array
    {
        return Cache::remember('dashboard:admin:event_stats', 300, function () {
            $upcoming = \App\Models\Event::where('is_active', true)
                ->where('event_date', '>=', now())
                ->count();
            
            $completed = \App\Models\Event::where('is_active', true)
                ->where('event_date', '<', now())
                ->count();

            $byType = \App\Models\Event::where('is_active', true)
                ->select('type')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('type')
                ->get()
                ->map(fn($item) => [
                    'type' => ucfirst($item->type ?? 'Other'),
                    'count' => $item->count
                ])
                ->toArray();

            $totalAttendance = DB::selectOne("
                SELECT 
                    COUNT(DISTINCT event_id) as events_with_attendance,
                    COUNT(*) as total_attendees,
                    AVG(attendee_count) as avg_attendance
                FROM (
                    SELECT event_id, COUNT(*) as attendee_count
                    FROM event_attendances
                    GROUP BY event_id
                ) sub
            ");

            return [
                'total' => $upcoming + $completed,
                'upcoming' => $upcoming,
                'completed' => $completed,
                'by_type' => $byType,
                'avg_attendance' => round($totalAttendance->avg_attendance ?? 0),
            ];
        });
    }

    /**
     * Duty officer attendance statistics
     */
    private function getDutyStats(): array
    {
        return Cache::remember('dashboard:admin:duty_stats', 300, function () {
            $totalDuties = \App\Models\OfficerDuty::currentYear()->active()->count();
            
            $attendanceStats = \App\Models\DutyAttendance::whereHas('officerDuty', function ($q) {
                $q->currentYear();
            })
            ->select('status')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(fn($item) => [
                'status' => ucfirst(str_replace('_', ' ', $item->status)),
                'count' => $item->count
            ])
            ->toArray();

            return [
                'total_duties' => $totalDuties,
                'attendance' => $attendanceStats,
            ];
        });
    }

    private function getPaymentStatus(): array
    {
        return Cache::remember('dashboard:admin:payment_status', 300, function () {
            $statuses = \App\Models\PaymentRecord::select('status')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->map(fn($item) => ['status' => ucfirst($item->status), 'count' => $item->count])
                ->toArray();
            
            return empty($statuses) ? [
                ['status' => 'No data', 'count' => 1]
            ] : $statuses;
        });
    }

    private function getRecentActivity(): array
    {
        // Check if activity_log table exists and has data
        if (class_exists(\Spatie\Activitylog\Models\Activity::class)) {
            try {
                return \Spatie\Activitylog\Models\Activity::with('causer:id,name')
                    ->orderByDesc('created_at')
                    ->limit(10)
                    ->get()
                    ->map(fn($activity) => [
                        'id' => $activity->id,
                        'description' => $activity->description,
                        'causer' => $activity->causer ? ['name' => $activity->causer->name] : null,
                        'created_at' => $activity->created_at->toISOString(),
                    ])
                    ->toArray();
            } catch (\Exception $e) {
                return [];
            }
        }
        return [];
    }

    private function getOfficerStats($user): array
    {
        return [
            'pending_announcements' => \App\Models\Announcement::where('is_published', false)->count(),
            'upcoming_duties' => 0, // TODO: Calculate from OfficerDuty
        ];
    }

    private function getLatestAnnouncements(): array
    {
        return Cache::remember('dashboard:announcements:latest', 300, function () {
            return \App\Models\Announcement::published()
                ->orderByDesc('is_pinned')
                ->orderByDesc('published_at')
                ->limit(5)
                ->get(['id', 'title', 'slug', 'excerpt', 'category', 'published_at'])
                ->toArray();
        });
    }

    private function getTodayDutyOfficer(): ?array
    {
        $todayIndex = (int) date('w');
        $dayIndex = $todayIndex === 0 ? 6 : $todayIndex - 1; // Convert to Mon=0
        
        $duty = \App\Models\OfficerDuty::with('officer:id,name,position,photo')
            ->currentYear()
            ->active()
            ->where('day_of_week', $dayIndex)
            ->where('start_time', '<=', now()->format('H:i:s'))
            ->where('end_time', '>=', now()->format('H:i:s'))
            ->first();
        
        if (!$duty) {
            return null;
        }

        return [
            'name' => $duty->officer->name,
            'position' => $duty->officer->position,
            'photo_url' => $duty->officer->photo_url,
            'time' => date('g:i A', strtotime($duty->start_time)) . ' - ' . date('g:i A', strtotime($duty->end_time)),
        ];
    }
}
