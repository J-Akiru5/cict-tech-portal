<?php

namespace App\Http\Controllers;

use App\Models\Officer;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * OfficerController
 * 
 * Handles the organizational chart display.
 */
class OfficerController extends Controller
{
    /**
     * Display the organizational chart (Public)
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
            return Inertia::render('Public/OrgChart', [
                'officers' => [],
                'academicYears' => $academicYears,
                'selectedYear' => null,
                'groupedOfficers' => [],
            ]);
        }
        
        // Get officers grouped by hierarchy level
        $officers = Officer::with('academicYear:id,label')
            ->active()
            ->forYear($selectedYear->id)
            ->ordered()
            ->get();
        
        // Group by hierarchy level for frontend rendering
        $groupedOfficers = $officers->groupBy('hierarchy_level')->map(function ($group) {
            return $group->map(function ($officer) {
                return [
                    'id' => $officer->id,
                    'name' => $officer->name,
                    'position' => $officer->position,
                    'position_short' => $officer->position_short,
                    'photo_url' => $officer->photo_url,
                    'course' => $officer->course,
                    'year_level' => $officer->year_level,
                    'motto' => $officer->motto,
                    'email' => $officer->email,
                    'facebook_url' => $officer->facebook_url,
                ];
            });
        });
        
        return Inertia::render('Public/OrgChart', [
            'officers' => $officers,
            'academicYears' => $academicYears,
            'selectedYear' => $selectedYear,
            'groupedOfficers' => $groupedOfficers,
        ]);
    }
}
