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
    $upcomingEvents = \App\Models\Event::where('is_active', true)
        ->where('event_date', '>=', now())
        ->orderBy('event_date')
        ->limit(4)
        ->get();

    return Inertia::render('Public/Landing', [
        'upcomingEvents' => $upcomingEvents,
    ]);
})->name('home');

// Announcements (Public)
Route::prefix('announcements')->name('announcements.')->group(function () {
    Route::get('/', [AnnouncementController::class, 'index'])->name('index');
    Route::get('/{slug}', [AnnouncementController::class, 'show'])->name('show');
});

// Achievement Feed (Public viewing, authenticated actions)
use App\Http\Controllers\AchievementPostController;
Route::get('/achievements', [AchievementPostController::class, 'index'])->name('achievements.index');
Route::get('/achievements/{post}/comments', [AchievementPostController::class, 'comments'])->name('achievements.comments');

// Authenticated achievement actions
Route::middleware('auth')->prefix('achievements')->name('achievements.')->group(function () {
    Route::post('/', [AchievementPostController::class, 'store'])->name('store');
    Route::put('/{post}', [AchievementPostController::class, 'update'])->name('update');
    Route::delete('/{post}', [AchievementPostController::class, 'destroy'])->name('destroy');
    Route::post('/{post}/react', [AchievementPostController::class, 'react'])->name('react');
    Route::post('/{post}/comment', [AchievementPostController::class, 'comment'])->name('comment');
    Route::delete('/comments/{comment}', [AchievementPostController::class, 'deleteComment'])->name('comment.delete');
    Route::post('/comments/{comment}/flag', [AchievementPostController::class, 'flagComment'])->name('comment.flag');
    Route::post('/{post}/pin', [AchievementPostController::class, 'togglePin'])->name('pin');
});


// Other public pages
Route::get('/org-chart', [OfficerController::class, 'index'])->name('org-chart');
Route::get('/schedule', [OfficerDutyController::class, 'index'])->name('schedule');
Route::get('/bulletin', [AchievementController::class, 'index'])->name('bulletin');

// Enrollment redirect (for students accessing via direct URL)
Route::get('/enrollment', function () {
    return redirect()->route('student.enrollment.index');
})->middleware('auth');

// University Calendar (Public)
use App\Http\Controllers\CalendarController;
Route::prefix('calendar')->name('calendar.')->group(function () {
    Route::get('/', [CalendarController::class, 'index'])->name('index');
    Route::get('/timeline', [CalendarController::class, 'timeline'])->name('timeline');
    Route::get('/parallax', [CalendarController::class, 'parallax'])->name('parallax');
    Route::get('/event/{event:slug}', [CalendarController::class, 'show'])->name('show');
});

// Calendar event registration (authenticated)
Route::middleware('auth')->post('/calendar/event/{event:slug}/register', [CalendarController::class, 'register'])->name('calendar.register');

// Notifications (Authenticated)
use App\Http\Controllers\NotificationController;
Route::middleware('auth')->prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::get('/recent', [NotificationController::class, 'recent'])->name('recent');
    Route::get('/unread-count', [NotificationController::class, 'unreadCount'])->name('unread');
    Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
    Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('read-all');
    Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
});

Route::get('/cbl', fn() => Inertia::render('Public/CBL'))->name('cbl');
Route::get('/it-through-the-years', function() {
    // Get all academic years with their highlights and president
    $academicYears = \App\Models\AcademicYear::with(['councilHighlights' => function($q) {
            $q->where('is_featured', true)->orderBy('display_order');
        }])
        ->orderBy('year_start', 'desc')
        ->get()
        ->map(function($year) {
            // Get the president for this academic year
            $president = \App\Models\Officer::where('academic_year_id', $year->id)
                ->where('position', 'LIKE', '%President%')
                ->where('position', 'NOT LIKE', '%Past%')
                ->where('position', 'NOT LIKE', '%Vice%')
                ->first();
            
            return [
                'id' => $year->id,
                'year_start' => $year->year_start,
                'year_end' => $year->year_end,
                'label' => "SY {$year->year_start}-{$year->year_end}",
                'theme' => $year->theme,
                'is_current' => $year->is_current,
                'president' => $president ? [
                    'name' => $president->name,
                    'photo_url' => $president->photo_url,
                    'position' => $president->position,
                ] : null,
                'highlights' => $year->councilHighlights->map(fn($h) => [
                    'id' => $h->id,
                    'title' => $h->title,
                    'description' => $h->description,
                    'type' => $h->type,
                    'icon' => $h->icon ?? $h->getTypeIcon(),
                ]),
            ];
        });
    
    return Inertia::render('Public/History', [
        'academicYears' => $academicYears,
    ]);
})->name('history');
Route::get('/timeline', function() {
    $highlights = \App\Models\CouncilHighlight::select('council_highlights.*')
        ->leftJoin('academic_years', 'council_highlights.academic_year_id', '=', 'academic_years.id')
        ->orderBy('academic_years.year_start', 'desc')
        ->orderBy('council_highlights.display_order')
        ->with('academicYear')
        ->get()
        ->map(function($h) {
            // Get the president for this academic year
            $president = \App\Models\Officer::where('academic_year_id', $h->academic_year_id)
                ->where('position', 'LIKE', '%President%')
                ->where('position', 'NOT LIKE', '%Past%')
                ->where('position', 'NOT LIKE', '%Vice%')
                ->first();
            
            return [
                'id' => $h->id,
                'year' => $h->academicYear ? $h->academicYear->year_start : 2024,
                'term_label' => $h->term_label,
                'title' => $h->title,
                'description' => $h->description,
                'type' => $h->type,
                'icon' => $h->icon ?? $h->getTypeIcon(),
                'color' => $h->accent_color ?? $h->getTypeColor(),
                'is_featured' => $h->is_featured,
                'president' => $president?->name ?? null,
                'president_photo' => $president?->photo_url ?? null,
            ];
        });
    
    return Inertia::render('Public/TimelineDemo', [
        'highlights' => $highlights,
    ]);
})->name('timeline');

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
    
    // Event Registration
    Route::post('/events/{event}/register', [\App\Http\Controllers\EventRegistrationController::class, 'register'])->name('events.register');
    Route::get('/events/registrations/my', [\App\Http\Controllers\EventRegistrationController::class, 'myRegistrations'])->name('events.myRegistrations');
    Route::delete('/events/registrations/{registration}', [\App\Http\Controllers\EventRegistrationController::class, 'cancel'])->name('events.registration.cancel');
    
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
        
        // User Management
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::post('/users/{user}/reset-password', [\App\Http\Controllers\Admin\UserController::class, 'resetPassword'])->name('users.reset-password');
        
        // Academic Year Management
        Route::resource('academic-years', \App\Http\Controllers\Admin\AcademicYearAdminController::class);
        Route::post('/academic-years/{academicYear}/set-current', [\App\Http\Controllers\Admin\AcademicYearAdminController::class, 'setCurrent'])->name('academic-years.set-current');
        
        // Announcement Management
        Route::resource('announcements', \App\Http\Controllers\Admin\AnnouncementAdminController::class);
        Route::post('/announcements/{announcement}/publish', [\App\Http\Controllers\Admin\AnnouncementAdminController::class, 'publish'])->name('announcements.publish');
        Route::post('/announcements/{announcement}/archive', [\App\Http\Controllers\Admin\AnnouncementAdminController::class, 'archive'])->name('announcements.archive');
        
        // Enrollment Management
        Route::get('/enrollment', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'index'])->name('enrollment.index');
        Route::put('/enrollment/{academicYear}/period', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'updatePeriod'])->name('enrollment.update-period');
        Route::get('/enrollment/students', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'students'])->name('enrollment.students');
        Route::post('/enrollment/{enrollment}/mark-paid', [\App\Http\Controllers\Admin\EnrollmentAdminController::class, 'markPaid'])->name('enrollment.mark-paid');
        
        // Audit Logs
        Route::get('/audit-logs', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('/audit-logs/export', [\App\Http\Controllers\Admin\AuditLogController::class, 'export'])->name('audit-logs.export');
        Route::get('/audit-logs/{activity}', [\App\Http\Controllers\Admin\AuditLogController::class, 'show'])->name('audit-logs.show');
        Route::delete('/audit-logs/clear', [\App\Http\Controllers\Admin\AuditLogController::class, 'clear'])->name('audit-logs.clear');
        
        // Role Management
        Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class);
        Route::post('/permissions', [\App\Http\Controllers\Admin\RoleController::class, 'storePermission'])->name('permissions.store');
        
        // Calendar/Event Management
        Route::get('/calendar', [\App\Http\Controllers\Admin\EventController::class, 'index'])->name('calendar.index');
        Route::post('/calendar', [\App\Http\Controllers\Admin\EventController::class, 'store'])->name('calendar.store');
        Route::put('/calendar/{event}', [\App\Http\Controllers\Admin\EventController::class, 'update'])->name('calendar.update');
        Route::delete('/calendar/{event}', [\App\Http\Controllers\Admin\EventController::class, 'destroy'])->name('calendar.destroy');
        Route::get('/calendar/events', [\App\Http\Controllers\Admin\EventController::class, 'fetchEvents'])->name('calendar.events');
        
        // Backup Management
        Route::get('/backups', [\App\Http\Controllers\Admin\BackupController::class, 'index'])->name('backups.index');
        Route::post('/backups', [\App\Http\Controllers\Admin\BackupController::class, 'create'])->name('backups.create');
        Route::get('/backups/{filename}/download', [\App\Http\Controllers\Admin\BackupController::class, 'download'])->name('backups.download');
        Route::delete('/backups/{filename}', [\App\Http\Controllers\Admin\BackupController::class, 'destroy'])->name('backups.destroy');
        
        // Settings Management
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
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
