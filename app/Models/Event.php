<?php

namespace App\Models;

use App\Traits\LogsModelActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

/**
 * Event Model
 * 
 * Represents CICT events, seminars, workshops, and meetings.
 */
class Event extends Model
{
    use HasFactory, SoftDeletes, LogsModelActivity;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'type',
        'event_date',
        'start_time',
        'end_time',
        'location',
        'is_online',
        'meeting_link',
        'cover_image',
        'gallery_images',
        'requires_registration',
        'max_attendees',
        'registration_deadline',
        'academic_year_id',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'event_date' => 'date',
        'registration_deadline' => 'datetime',
        'is_online' => 'boolean',
        'requires_registration' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'gallery_images' => 'array',
    ];

    /**
     * Event types with icons
     */
    public const TYPES = [
        'seminar' => '🎤 Seminar',
        'workshop' => '💻 Workshop',
        'meeting' => '📋 Meeting',
        'social' => '🎉 Social Event',
        'competition' => '🏆 Competition',
        'other' => '📅 Other',
    ];

    /**
     * Boot
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->title) . '-' . Str::random(5);
            }
        });
    }

    /**
     * Relationships
     */
    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_attendances')
            ->withPivot(['status', 'checked_in_at', 'check_in_method', 'notes'])
            ->withTimestamps();
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function activeRegistrations()
    {
        return $this->registrations()->active();
    }

    /**
     * Scopes
     */
    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now()->toDateString())
            ->where('is_active', true)
            ->orderBy('event_date');
    }

    public function scopePast($query)
    {
        return $query->where('event_date', '<', now()->toDateString())
            ->orderByDesc('event_date');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('is_active', true);
    }

    /**
     * Accessors
     */
    public function getTypeLabelAttribute(): string
    {
        return self::TYPES[$this->type] ?? $this->type;
    }

    public function getIsUpcomingAttribute(): bool
    {
        return $this->event_date->gte(now()->startOfDay());
    }

    public function getIsTodayAttribute(): bool
    {
        return $this->event_date->isToday();
    }

    public function getFormattedTimeAttribute(): string
    {
        if (!$this->start_time) {
            return 'All day';
        }
        
        $start = date('g:i A', strtotime($this->start_time));
        $end = $this->end_time ? date('g:i A', strtotime($this->end_time)) : '';
        
        return $end ? "{$start} - {$end}" : $start;
    }

    public function getAvailableSlotsAttribute(): ?int
    {
        if (!$this->max_attendees) {
            return null;
        }
        
        return $this->max_attendees - $this->attendees()->count();
    }

    public function getIsRegistrationOpenAttribute(): bool
    {
        if (!$this->requires_registration) {
            return false;
        }
        
        if ($this->registration_deadline && now()->gt($this->registration_deadline)) {
            return false;
        }
        
        if ($this->max_attendees && $this->available_slots <= 0) {
            return false;
        }
        
        return $this->is_upcoming;
    }
}
