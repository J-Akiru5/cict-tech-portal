<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\OfficerController;
use App\Http\Controllers\OfficerDutyController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Public/Landing');
})->name('home');

// Announcements (Public)
Route::prefix('announcements')->name('announcements.')->group(function () {
    Route::get('/', [AnnouncementController::class, 'index'])->name('index');
    Route::get('/{slug}', [AnnouncementController::class, 'show'])->name('show');
});

// Other public pages
Route::get('/org-chart', [OfficerController::class, 'index'])->name('org-chart');
Route::get('/schedule', [OfficerDutyController::class, 'index'])->name('schedule');
Route::get('/bulletin', [AchievementController::class, 'index'])->name('bulletin');
Route::get('/cbl', fn() => Inertia::render('Public/CBL'))->name('cbl');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

// Main dashboard - redirects based on role
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

use App\Http\Controllers\FeedbackController;

use App\Http\Controllers\EventController;

use App\Http\Controllers\PaymentController;

// Student Dashboard
Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'studentDashboard'])->name('dashboard');
    
    // Feedback
    Route::get('/feedback', [FeedbackController::class, 'index'])->name('feedback.index');
    Route::get('/feedback/create', [FeedbackController::class, 'create'])->name('feedback.create');
    Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');
    Route::get('/feedback/{feedback}', [FeedbackController::class, 'show'])->name('feedback.show');
    
    // Events
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::get('/events/my', [EventController::class, 'myEvents'])->name('events.my');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
    Route::post('/events/{event}/register', [EventController::class, 'register'])->name('events.register');
    Route::delete('/events/{event}/unregister', [EventController::class, 'unregister'])->name('events.unregister');
    
    // Payments
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments', [PaymentController::class, 'submit'])->name('payments.submit');
    
    // Enrollment
    Route::get('/enrollment', [\App\Http\Controllers\EnrollmentController::class, 'index'])->name('enrollment.index');
    Route::post('/enrollment', [\App\Http\Controllers\EnrollmentController::class, 'enroll'])->name('enrollment.enroll');
    Route::put('/enrollment/{enrollment}', [\App\Http\Controllers\EnrollmentController::class, 'update'])->name('enrollment.update');
});

use App\Http\Controllers\Officer\SecretaryController;
use App\Http\Controllers\Officer\TreasurerController;

// Officer Dashboard
Route::middleware(['auth', 'verified', 'role:sc-president,sc-officer,sc-secretary,sc-treasurer,sc-adviser,dean'])
    ->prefix('officer')
    ->name('officer.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'officerDashboard'])->name('dashboard');
        
        // Secretary - Meeting Notes
        Route::prefix('secretary')->name('secretary.')->group(function () {
            Route::get('/', [SecretaryController::class, 'index'])->name('index');
            Route::get('/create', [SecretaryController::class, 'create'])->name('create');
            Route::post('/', [SecretaryController::class, 'store'])->name('store');
            Route::get('/{meeting}', [SecretaryController::class, 'show'])->name('show');
            Route::get('/{meeting}/edit', [SecretaryController::class, 'edit'])->name('edit');
            Route::put('/{meeting}', [SecretaryController::class, 'update'])->name('update');
            Route::post('/{meeting}/submit', [SecretaryController::class, 'submit'])->name('submit');
            Route::post('/{meeting}/approve', [SecretaryController::class, 'approve'])->name('approve');
        });
        
        // Treasurer - Financial Records
        Route::prefix('treasurer')->name('treasurer.')->group(function () {
            Route::get('/', [TreasurerController::class, 'index'])->name('index');
            Route::post('/{payment}/verify', [TreasurerController::class, 'verify'])->name('verify');
            Route::post('/{payment}/reject', [TreasurerController::class, 'reject'])->name('reject');
            Route::get('/officer-fees', [TreasurerController::class, 'officerFees'])->name('officer-fees');
        });
        
        // Attendance - Duty Check-in
        Route::prefix('attendance')->name('attendance.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Officer\AttendanceController::class, 'index'])->name('index');
            Route::post('/{attendance}/check-in', [\App\Http\Controllers\Officer\AttendanceController::class, 'checkIn'])->name('check-in');
            Route::post('/{attendance}/check-out', [\App\Http\Controllers\Officer\AttendanceController::class, 'checkOut'])->name('check-out');
            Route::post('/{attendance}/absent', [\App\Http\Controllers\Officer\AttendanceController::class, 'markAbsent'])->name('absent');
            Route::post('/{attendance}/excuse', [\App\Http\Controllers\Officer\AttendanceController::class, 'submitExcuse'])->name('excuse');
            Route::post('/{attendance}/approve-excuse', [\App\Http\Controllers\Officer\AttendanceController::class, 'approveExcuse'])->name('approve-excuse');
            Route::get('/report', [\App\Http\Controllers\Officer\AttendanceController::class, 'report'])->name('report');
        });
    });

// Admin Dashboard
Route::middleware(['auth', 'verified', 'role:main-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'adminDashboard'])->name('dashboard');
        
        // Enrollment Management
        Route::get('/enrollment', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'index'])->name('enrollment.index');
        Route::put('/enrollment/{academicYear}/period', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'updatePeriod'])->name('enrollment.update-period');
        Route::get('/enrollment/students', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'students'])->name('enrollment.students');
        Route::post('/enrollment/{enrollment}/mark-paid', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'markPaid'])->name('enrollment.mark-paid');
    });

// Enrollment Admin (also for Adviser and President)
Route::middleware(['auth', 'verified', 'role:main-admin,sc-adviser,sc-president'])
    ->prefix('manage/enrollment')
    ->name('manage.enrollment.')
    ->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'index'])->name('index');
        Route::put('/{academicYear}/period', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'updatePeriod'])->name('update-period');
        Route::get('/students', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'students'])->name('students');
        Route::post('/{enrollment}/mark-paid', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'markPaid'])->name('mark-paid');
    });

// Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
