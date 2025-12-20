<?php

namespace App\Http\Controllers;

use App\Models\OfficerDuty;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * OfficerDutyController
 * 
 * Handles the officer duty schedule display.
 */
class OfficerDutyController extends Controller
{
    /**
     * Display the weekly schedule (Public)
     */
    public function index(Request $request): Response
    {
        $yearId = $request->get('year');
        
        // Get all academic years for filter
        $academicYears = AcademicYear::orderByDesc('year_start')->get(['id', 'label', 'is_current']);
        
        // Determine which year to show
        if ($yearId) {
            $selectedYear = AcademicYear::find($yearId);
        } else {
            $selectedYear = AcademicYear::getCurrentYear();
        }
        
        if (!$selectedYear) {
            return Inertia::render('Public/Schedule', [
                'schedule' => [],
                'academicYears' => $academicYears,
                'selectedYear' => null,
                'todayIndex' => $this->getTodayIndex(),
            ]);
        }
        
        // Get weekly schedule
        $duties = OfficerDuty::with('officer:id,name,position,photo')
            ->active()
            ->forYear($selectedYear->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
        
        // Group by day
        $schedule = [];
        foreach (OfficerDuty::DAY_NAMES as $dayNum => $dayName) {
            $dayDuties = $duties->where('day_of_week', $dayNum)->values();
            $schedule[] = [
                'dayIndex' => $dayNum,
                'name' => $dayName,
                'shortName' => substr($dayName, 0, 3),
                'duties' => $dayDuties->map(function ($duty) {
                    return [
                        'id' => $duty->id,
                        'startTime' => date('g:i A', strtotime($duty->start_time)),
                        'endTime' => date('g:i A', strtotime($duty->end_time)),
                        'location' => $duty->location,
                        'officer' => [
                            'id' => $duty->officer->id,
                            'name' => $duty->officer->name,
                            'position' => $duty->officer->position,
                            'photoUrl' => $duty->officer->photo_url,
                        ],
                    ];
                })->toArray(),
            ];
        }
        
        return Inertia::render('Public/Schedule', [
            'schedule' => $schedule,
            'academicYears' => $academicYears,
            'selectedYear' => $selectedYear,
            'todayIndex' => $this->getTodayIndex(),
        ]);
    }

    /**
     * Get today's day index (0 = Monday)
     */
    private function getTodayIndex(): int
    {
        // PHP: Sunday = 0, Monday = 1, ... Saturday = 6
        // We want: Monday = 0, ... Sunday = 6
        $phpDay = (int) date('w');
        return $phpDay === 0 ? 6 : $phpDay - 1;
    }
}
