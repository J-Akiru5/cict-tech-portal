<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * OfficerDuty Model
 * 
 * Represents a duty schedule slot for an officer.
 */
class OfficerDuty extends Model
{
    use HasFactory;

    protected $fillable = [
        'day_of_week',
        'start_time',
        'end_time',
        'officer_id',
        'academic_year_id',
        'location',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Day names mapping
     */
    public const DAY_NAMES = [
        0 => 'Monday',
        1 => 'Tuesday',
        2 => 'Wednesday',
        3 => 'Thursday',
        4 => 'Friday',
        5 => 'Saturday',
        6 => 'Sunday',
    ];

    /**
     * Relationships
     */
    public function officer(): BelongsTo
    {
        return $this->belongsTo(Officer::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForYear($query, int $academicYearId)
    {
        return $query->where('academic_year_id', $academicYearId);
    }

    public function scopeForDay($query, int $dayOfWeek)
    {
        return $query->where('day_of_week', $dayOfWeek);
    }

    public function scopeCurrentYear($query)
    {
        $currentYear = AcademicYear::getCurrentYear();
        return $currentYear ? $query->forYear($currentYear->id) : $query;
    }

    /**
     * Accessors
     */
    public function getDayNameAttribute(): string
    {
        return self::DAY_NAMES[$this->day_of_week] ?? 'Unknown';
    }

    public function getFormattedTimeAttribute(): string
    {
        $start = date('g:i A', strtotime($this->start_time));
        $end = date('g:i A', strtotime($this->end_time));
        return "{$start} - {$end}";
    }

    /**
     * Get schedule grouped by day
     */
    public static function getWeeklySchedule(int $academicYearId): array
    {
        $duties = static::with('officer:id,name,position,photo')
            ->active()
            ->forYear($academicYearId)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        $schedule = [];
        foreach (self::DAY_NAMES as $dayNum => $dayName) {
            $schedule[$dayNum] = [
                'name' => $dayName,
                'duties' => $duties->where('day_of_week', $dayNum)->values()->toArray(),
            ];
        }

        return $schedule;
    }
}
