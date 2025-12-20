<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\DutyAttendance;
use App\Models\OfficerDuty;
use App\Models\Officer;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * AttendanceController
 * 
 * Handles officer duty check-in/out and attendance tracking.
 */
class AttendanceController extends Controller
{
    /**
     * Show today's attendance and check-in interface
     */
    public function index(): Response
    {
        $today = now();
        $dayOfWeek = $today->dayOfWeek;
        
        // Get today's scheduled duties
        $todayDuties = OfficerDuty::where('day_of_week', $dayOfWeek)
            ->with(['officer.user'])
            ->get()
            ->map(function ($duty) use ($today) {
                // Get or create attendance record for today
                $attendance = DutyAttendance::firstOrCreate([
                    'officer_duty_id' => $duty->id,
                    'officer_id' => $duty->officer_id,
                    'duty_date' => $today->toDateString(),
                ], [
                    'academic_year_id' => AcademicYear::getCurrentYear()?->id,
                ]);

                return [
                    'dutyId' => $duty->id,
                    'attendanceId' => $attendance->id,
                    'officerId' => $duty->officer_id,
                    'officerName' => $duty->officer?->name,
                    'officerPhoto' => $duty->officer?->photo_url,
                    'position' => $duty->officer?->position,
                    'startTime' => $duty->start_time ? date('g:i A', strtotime($duty->start_time)) : null,
                    'endTime' => $duty->end_time ? date('g:i A', strtotime($duty->end_time)) : null,
                    'location' => $duty->location,
                    'status' => $attendance->status,
                    'statusLabel' => $attendance->status_label,
                    'checkedIn' => $attendance->formatted_check_in,
                    'checkedOut' => $attendance->formatted_check_out,
                    'lateMinutes' => $attendance->late_minutes,
                    'hasFine' => $attendance->has_fine,
                    'fineAmount' => $attendance->formatted_fine,
                ];
            });

        // Stats for this week
        $weekStart = $today->copy()->startOfWeek();
        $weekEnd = $today->copy()->endOfWeek();
        
        $weekStats = [
            'present' => DutyAttendance::whereBetween('duty_date', [$weekStart, $weekEnd])->where('status', 'present')->count(),
            'late' => DutyAttendance::whereBetween('duty_date', [$weekStart, $weekEnd])->where('status', 'late')->count(),
            'absent' => DutyAttendance::whereBetween('duty_date', [$weekStart, $weekEnd])->where('status', 'absent')->count(),
            'excused' => DutyAttendance::whereBetween('duty_date', [$weekStart, $weekEnd])->where('status', 'excused')->count(),
        ];

        return Inertia::render('Officer/Attendance/Index', [
            'todayDuties' => $todayDuties,
            'weekStats' => $weekStats,
            'todayDate' => $today->format('l, F d, Y'),
            'isWeekend' => $today->isWeekend(),
        ]);
    }

    /**
     * Check in an officer
     */
    public function checkIn(DutyAttendance $attendance)
    {
        $attendance->checkIn();
        
        return back()->with('success', 'Checked in successfully!');
    }

    /**
     * Check out an officer
     */
    public function checkOut(DutyAttendance $attendance)
    {
        $attendance->checkOut();
        
        return back()->with('success', 'Checked out successfully!');
    }

    /**
     * Mark as absent
     */
    public function markAbsent(DutyAttendance $attendance)
    {
        $attendance->update([
            'status' => 'absent',
            'has_fine' => true,
            'fine_amount' => DutyAttendance::FINE_PER_ABSENT,
        ]);
        
        return back()->with('success', 'Marked as absent.');
    }

    /**
     * Submit excuse
     */
    public function submitExcuse(Request $request, DutyAttendance $attendance)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $attendance->update([
            'excuse_reason' => $request->reason,
            'status' => 'excused', // Temporarily until approved/rejected
        ]);
        
        return back()->with('success', 'Excuse submitted for review.');
    }

    /**
     * Approve excuse (President/Adviser only)
     */
    public function approveExcuse(DutyAttendance $attendance)
    {
        $attendance->update([
            'excuse_approved' => true,
            'excuse_approved_by' => Auth::id(),
            'status' => 'excused',
            'has_fine' => false,
            'fine_amount' => null,
        ]);
        
        return back()->with('success', 'Excuse approved.');
    }

    /**
     * Attendance report
     */
    public function report(Request $request): Response
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $startDate = now()->setYear($year)->setMonth($month)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // Get all officers with their attendance summary
        $officers = Officer::currentYear()
            ->with('user')
            ->get()
            ->map(function ($officer) use ($startDate, $endDate) {
                $attendances = DutyAttendance::where('officer_id', $officer->id)
                    ->whereBetween('duty_date', [$startDate, $endDate])
                    ->get();

                $summary = [
                    'present' => $attendances->where('status', 'present')->count(),
                    'late' => $attendances->where('status', 'late')->count(),
                    'absent' => $attendances->where('status', 'absent')->count(),
                    'excused' => $attendances->where('status', 'excused')->count(),
                ];

                $totalFines = $attendances->where('has_fine', true)->sum('fine_amount');
                $unpaidFines = $attendances->where('has_fine', true)->where('fine_paid', false)->sum('fine_amount');

                return [
                    'id' => $officer->id,
                    'name' => $officer->name,
                    'position' => $officer->position,
                    'photoUrl' => $officer->photo_url,
                    'summary' => $summary,
                    'totalDuties' => $summary['present'] + $summary['late'] + $summary['absent'] + $summary['excused'],
                    'attendanceRate' => $summary['present'] + $summary['late'] > 0 
                        ? round((($summary['present'] + $summary['late']) / max($summary['present'] + $summary['late'] + $summary['absent'], 1)) * 100)
                        : 0,
                    'totalFines' => '₱' . number_format($totalFines, 2),
                    'unpaidFines' => '₱' . number_format($unpaidFines, 2),
                    'hasUnpaidFines' => $unpaidFines > 0,
                ];
            });

        return Inertia::render('Officer/Attendance/Report', [
            'officers' => $officers,
            'month' => $month,
            'year' => $year,
            'monthLabel' => $startDate->format('F Y'),
        ]);
    }
}
