<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * AcademicYearAdminController
 * 
 * Handles CRUD operations for academic year management in the admin panel.
 */
class AcademicYearAdminController extends Controller
{
    /**
     * Display a listing of academic years.
     */
    public function index()
    {
        $academicYears = AcademicYear::orderBy('year_start', 'desc')
            ->withCount('officers')
            ->get();

        return Inertia::render('Admin/AcademicYears/Index', [
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Show the form for creating a new academic year.
     */
    public function create()
    {
        return Inertia::render('Admin/AcademicYears/Create');
    }

    /**
     * Store a newly created academic year in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'year_start' => ['required', 'string', 'size:4'],
            'year_end' => ['required', 'string', 'size:4'],
            'label' => ['nullable', 'string', 'max:255'],
            'theme' => ['nullable', 'string', 'max:255'],
            'semester' => ['required', 'string', 'in:1st,2nd,full'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'enrollment_start' => ['nullable', 'date'],
            'enrollment_end' => ['nullable', 'date', 'after:enrollment_start'],
            'department_fee' => ['nullable', 'numeric', 'min:0'],
            'is_current' => ['boolean'],
        ]);

        $academicYear = AcademicYear::create($validated);

        return redirect()->route('admin.academic-years.index')
            ->with('success', 'Academic year created successfully.');
    }

    /**
     * Show the form for editing the specified academic year.
     */
    public function edit(AcademicYear $academicYear)
    {
        return Inertia::render('Admin/AcademicYears/Edit', [
            'academicYear' => $academicYear,
        ]);
    }

    /**
     * Update the specified academic year in storage.
     */
    public function update(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'year_start' => ['required', 'string', 'size:4'],
            'year_end' => ['required', 'string', 'size:4'],
            'label' => ['nullable', 'string', 'max:255'],
            'theme' => ['nullable', 'string', 'max:255'],
            'semester' => ['required', 'string', 'in:1st,2nd,full'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
            'enrollment_start' => ['nullable', 'date'],
            'enrollment_end' => ['nullable', 'date', 'after:enrollment_start'],
            'department_fee' => ['nullable', 'numeric', 'min:0'],
            'is_current' => ['boolean'],
        ]);

        $academicYear->update($validated);

        return redirect()->route('admin.academic-years.index')
            ->with('success', 'Academic year updated successfully.');
    }

    /**
     * Remove the specified academic year from storage.
     */
    public function destroy(AcademicYear $academicYear)
    {
        // Prevent deletion if it's the current year
        if ($academicYear->is_current) {
            return back()->with('error', 'Cannot delete the current academic year.');
        }

        // Prevent deletion if it has officers
        if ($academicYear->officers()->count() > 0) {
            return back()->with('error', 'Cannot delete academic year with associated officers.');
        }

        $academicYear->delete();

        return redirect()->route('admin.academic-years.index')
            ->with('success', 'Academic year deleted successfully.');
    }

    /**
     * Set the specified academic year as current.
     */
    public function setCurrent(AcademicYear $academicYear)
    {
        // This will automatically unset other current years due to model boot
        $academicYear->update(['is_current' => true]);

        return back()->with('success', 'Academic year set as current.');
    }
}
