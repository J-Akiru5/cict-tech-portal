<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * EnrollmentAdminController
 * 
 * Manages enrollment periods and views enrollment records.
 * Access: Admin, SC Adviser, SC President
 */
class EnrollmentAdminController extends Controller
{
    /**
     * Dashboard showing enrollment stats and period management
     */
    public function index(): Response
    {
        $currentYear = AcademicYear::getCurrentYear();
        
        // Get all academic years for management
        $academicYears = AcademicYear::orderByDesc('year_start')
            ->orderByDesc('semester')
            ->get()
            ->map(fn($year) => [
                'id' => $year->id,
                'label' => $year->label,
                'semester' => $year->semester,
                'isCurrent' => $year->is_current,
                'enrollmentStart' => $year->enrollment_start?->format('Y-m-d'),
                'enrollmentEnd' => $year->enrollment_end?->format('Y-m-d'),
                'enrollmentStartFormatted' => $year->enrollment_start?->format('M d, Y'),
                'enrollmentEndFormatted' => $year->enrollment_end?->format('M d, Y'),
                'departmentFee' => $year->department_fee ?? 50,
                'isEnrollmentOpen' => $year->enrollment_start && $year->enrollment_end
                    ? now()->between($year->enrollment_start, $year->enrollment_end)
                    : false,
            ]);

        // Stats for current semester
        $stats = $currentYear ? [
            'totalEnrolled' => Enrollment::where('academic_year_id', $currentYear->id)->enrolled()->count(),
            'pendingPayment' => Enrollment::where('academic_year_id', $currentYear->id)->unpaid()->count(),
            'totalPaid' => Enrollment::where('academic_year_id', $currentYear->id)->paid()->count(),
            'totalCollected' => '₱' . number_format(
                Enrollment::where('academic_year_id', $currentYear->id)->paid()->sum('fee_amount'), 2
            ),
        ] : null;

        return Inertia::render('Admin/Enrollment/Index', [
            'academicYears' => $academicYears,
            'currentYearId' => $currentYear?->id,
            'stats' => $stats,
        ]);
    }

    /**
     * Update enrollment period for an academic year
     */
    public function updatePeriod(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'enrollment_start' => ['nullable', 'date'],
            'enrollment_end' => ['nullable', 'date', 'after_or_equal:enrollment_start'],
            'department_fee' => ['nullable', 'numeric', 'min:0'],
        ]);

        $academicYear->update([
            'enrollment_start' => $validated['enrollment_start'],
            'enrollment_end' => $validated['enrollment_end'],
            'department_fee' => $validated['department_fee'] ?? 50,
        ]);

        return back()->with('success', 'Enrollment period updated!');
    }

    /**
     * View enrolled students for a specific academic year
     */
    public function students(Request $request): Response
    {
        $yearId = $request->get('year_id', AcademicYear::getCurrentYear()?->id);
        $status = $request->get('status');
        $paid = $request->get('paid');

        $query = Enrollment::with(['user', 'academicYear'])
            ->when($yearId, fn($q) => $q->where('academic_year_id', $yearId))
            ->orderByDesc('created_at');

        if ($status) {
            $query->where('status', $status);
        }

        if ($paid !== null) {
            $query->where('fee_paid', $paid === 'true');
        }

        $enrollments = $query->get()->map(fn($enrollment) => [
            'id' => $enrollment->id,
            'userId' => $enrollment->user_id,
            'userName' => $enrollment->user?->name,
            'userEmail' => $enrollment->user?->email,
            'userStudentId' => $enrollment->user?->student_id,
            'userPhotoUrl' => $enrollment->user?->photo_url,
            'course' => $enrollment->course,
            'yearLevel' => $enrollment->year_level,
            'section' => $enrollment->section,
            'fullSection' => $enrollment->full_section,
            'status' => $enrollment->status,
            'statusLabel' => $enrollment->status_label,
            'feePaid' => $enrollment->fee_paid,
            'feeAmount' => $enrollment->formatted_fee,
            'enrolledAt' => $enrollment->enrolled_at?->format('M d, Y'),
            'createdAt' => $enrollment->created_at->format('M d, Y H:i'),
        ]);

        $academicYears = AcademicYear::orderByDesc('year_start')
            ->orderByDesc('semester')
            ->get()
            ->map(fn($year) => [
                'id' => $year->id,
                'label' => $year->label . ' - ' . $year->semester,
            ]);

        return Inertia::render('Admin/Enrollment/Students', [
            'enrollments' => $enrollments,
            'academicYears' => $academicYears,
            'selectedYearId' => (int) $yearId,
            'selectedStatus' => $status,
            'selectedPaid' => $paid,
            'statuses' => Enrollment::STATUSES,
        ]);
    }

    /**
     * Mark enrollment fee as paid (for treasurer)
     */
    public function markPaid(Enrollment $enrollment)
    {
        $enrollment->markAsPaid();
        
        return back()->with('success', 'Enrollment fee marked as paid!');
    }
}
