<?php

namespace App\Models;

use App\Traits\LogsModelActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Permission\Traits\HasRoles;

/**
 * User Model for CICT IT Tech Portal
 * 
 * Includes role-based access control via Spatie Permission.
 * Roles: main-admin, dean, sc-adviser, sc-president, sc-officer, 
 *        sc-secretary, sc-treasurer, student, public
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, LogsModelActivity;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'student_id',
        'course',
        'year_level',
        'section',
        'phone',
        'emergency_contact',
        'emergency_phone',
        'photo',
        'bio',
        'facebook_url',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Course options
     */
    public const COURSES = [
        'BSIT' => 'Bachelor of Science in Information Technology',
        'BSCS' => 'Bachelor of Science in Computer Science',
        'ACT' => 'Associate in Computer Technology',
    ];

    /**
     * Year level options
     */
    public const YEAR_LEVELS = [
        '1st' => '1st Year',
        '2nd' => '2nd Year',
        '3rd' => '3rd Year',
        '4th' => '4th Year',
    ];

    /**
     * Relationships
     */
    public function officer(): HasOne
    {
        return $this->hasOne(Officer::class);
    }

    public function events(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'event_attendances')
            ->withPivot(['status', 'checked_in_at', 'check_in_method', 'notes'])
            ->withTimestamps();
    }

    /**
     * Accessors
     */
    public function getPhotoUrlAttribute(): string
    {
        if ($this->photo) {
            return asset('storage/' . $this->photo);
        }
        
        // Default avatar with initials
        $initials = collect(explode(' ', $this->name))
            ->map(fn($part) => strtoupper($part[0] ?? ''))
            ->take(2)
            ->join('');
        
        return "https://ui-avatars.com/api/?name={$initials}&background=d4a017&color=7f1d1d&bold=true&size=150";
    }

    public function getFullCourseNameAttribute(): ?string
    {
        return self::COURSES[$this->course] ?? $this->course;
    }

    /**
     * Role helpers
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('main-admin');
    }

    public function isOfficer(): bool
    {
        return $this->hasAnyRole(['sc-president', 'sc-officer', 'sc-secretary', 'sc-treasurer']);
    }

    public function isStudent(): bool
    {
        return $this->hasRole('student');
    }

    /**
     * Get the dashboard route based on user role
     */
    public function getDashboardRoute(): string
    {
        if ($this->hasRole('main-admin')) {
            return 'admin.dashboard';
        }
        
        if ($this->hasAnyRole(['sc-president', 'sc-officer', 'sc-secretary', 'sc-treasurer', 'sc-adviser'])) {
            return 'officer.dashboard';
        }
        
        return 'student.dashboard';
    }
}
