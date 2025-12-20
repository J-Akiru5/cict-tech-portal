<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
        
        return Inertia::render('Student/Dashboard', [
            'user' => [
                'name' => $user->name,
                'student_id' => $user->student_id,
                'course' => $user->course,
                'year_level' => $user->year_level,
                'photo_url' => $user->photo_url,
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
        return [
            'total_users' => \App\Models\User::count(),
            'total_officers' => \App\Models\Officer::count(),
            'total_announcements' => \App\Models\Announcement::count(),
            'active_academic_year' => \App\Models\AcademicYear::getCurrentYear()?->label ?? 'Not set',
        ];
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
        return \App\Models\Announcement::published()
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'excerpt', 'category', 'published_at'])
            ->toArray();
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
