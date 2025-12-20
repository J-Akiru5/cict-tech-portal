<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * EnrollmentController
 * 
 * Handles student enrollment for each semester.
 */
class EnrollmentController extends Controller
{
    /**
     * Show enrollment status and form for students
     */
    public function index(): Response
    {
        $user = Auth::user();
        $currentYear = AcademicYear::getCurrentYear();
        
        // Get current enrollment
        $currentEnrollment = $currentYear 
            ? Enrollment::where('user_id', $user->id)
                ->where('academic_year_id', $currentYear->id)
                ->first()
            : null;

        // Get enrollment history
        $enrollmentHistory = Enrollment::where('user_id', $user->id)
            ->with('academicYear')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($enrollment) => [
                'id' => $enrollment->id,
                'semester' => $enrollment->academicYear?->label . ' - ' . $enrollment->academicYear?->semester,
                'course' => $enrollment->course,
                'yearLevel' => $enrollment->year_level,
                'section' => $enrollment->section,
                'fullSection' => $enrollment->full_section,
                'status' => $enrollment->status,
                'statusLabel' => $enrollment->status_label,
                'feePaid' => $enrollment->fee_paid,
                'feeAmount' => $enrollment->formatted_fee,
                'enrolledAt' => $enrollment->enrolled_at?->format('M d, Y'),
            ]);

        return Inertia::render('Student/Enrollment/Index', [
            'currentYear' => $currentYear ? [
                'id' => $currentYear->id,
                'label' => $currentYear->label,
                'semester' => $currentYear->semester,
                'enrollmentStart' => $currentYear->enrollment_start?->format('M d, Y'),
                'enrollmentEnd' => $currentYear->enrollment_end?->format('M d, Y'),
                'isEnrollmentOpen' => $currentYear->enrollment_start && $currentYear->enrollment_end
                    ? now()->between($currentYear->enrollment_start, $currentYear->enrollment_end)
                    : false,
                'departmentFee' => '₱' . number_format($currentYear->department_fee ?? 50, 2),
            ] : null,
            'currentEnrollment' => $currentEnrollment ? [
                'id' => $currentEnrollment->id,
                'course' => $currentEnrollment->course,
                'yearLevel' => $currentEnrollment->year_level,
                'section' => $currentEnrollment->section,
                'status' => $currentEnrollment->status,
                'statusLabel' => $currentEnrollment->status_label,
                'feePaid' => $currentEnrollment->fee_paid,
                'feeAmount' => $currentEnrollment->formatted_fee,
            ] : null,
            'enrollmentHistory' => $enrollmentHistory,
            'courses' => Enrollment::COURSES,
            'yearLevels' => Enrollment::YEAR_LEVELS,
        ]);
    }

    /**
     * Enroll for current semester
     */
    public function enroll(Request $request)
    {
        $currentYear = AcademicYear::getCurrentYear();
        
        if (!$currentYear) {
            return back()->withErrors(['error' => 'No active academic year.']);
        }

        // Check if enrollment is open
        if ($currentYear->enrollment_start && $currentYear->enrollment_end) {
            if (!now()->between($currentYear->enrollment_start, $currentYear->enrollment_end)) {
                return back()->withErrors(['error' => 'Enrollment period is closed.']);
            }
        }

        // Validate
        $validated = $request->validate([
            'course' => ['required', 'in:' . implode(',', array_keys(Enrollment::COURSES))],
            'year_level' => ['required', 'in:' . implode(',', array_keys(Enrollment::YEAR_LEVELS))],
            'section' => ['required', 'string', 'max:10'],
        ]);

        // Check if already enrolled
        $existing = Enrollment::where('user_id', Auth::id())
            ->where('academic_year_id', $currentYear->id)
            ->first();

        if ($existing) {
            // Update existing enrollment
            $existing->update([
                'course' => $validated['course'],
                'year_level' => $validated['year_level'],
                'section' => strtoupper($validated['section']),
            ]);
            
            return back()->with('success', 'Enrollment updated!');
        }

        // Create new enrollment
        Enrollment::create([
            'user_id' => Auth::id(),
            'academic_year_id' => $currentYear->id,
            'course' => $validated['course'],
            'year_level' => $validated['year_level'],
            'section' => strtoupper($validated['section']),
            'status' => 'pending',
            'fee_amount' => $currentYear->department_fee ?? AcademicYear::DEFAULT_DEPARTMENT_FEE,
        ]);

        return back()->with('success', 'Enrollment submitted! Please pay the department fee to complete enrollment.');
    }

    /**
     * Update enrollment (for editing section)
     */
    public function update(Request $request, Enrollment $enrollment)
    {
        // Authorization
        if ($enrollment->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'course' => ['required', 'in:' . implode(',', array_keys(Enrollment::COURSES))],
            'year_level' => ['required', 'in:' . implode(',', array_keys(Enrollment::YEAR_LEVELS))],
            'section' => ['required', 'string', 'max:10'],
        ]);

        $enrollment->update([
            'course' => $validated['course'],
            'year_level' => $validated['year_level'],
            'section' => strtoupper($validated['section']),
        ]);

        return back()->with('success', 'Enrollment updated!');
    }
}
