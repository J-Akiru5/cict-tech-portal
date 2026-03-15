<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * DutyAttendance Model
 * 
 * Tracks officer duty attendance with check-in/out and fine system.
 */
class DutyAttendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'officer_duty_id',
        'officer_id',
        'duty_date',
        'checked_in_at',
        'checked_out_at',
        'status',
        'late_minutes',
        'has_fine',
        'fine_amount',
        'fine_paid',
        'excuse_reason',
        'excuse_approved',
        'excuse_approved_by',
        'notes',
        'academic_year_id',
    ];

    protected $casts = [
        'duty_date' => 'date',
        'checked_in_at' => 'datetime',
        'checked_out_at' => 'datetime',
        'has_fine' => 'boolean',
        'fine_paid' => 'boolean',
        'excuse_approved' => 'boolean',
        'fine_amount' => 'decimal:2',
    ];

    public const STATUSES = [
        'present' => 'Present',
        'late' => 'Late',
        'absent' => 'Absent',
        'excused' => 'Excused',
    ];

    public const FINE_PER_ABSENT = 50.00; // ₱50 per absence
    public const FINE_PER_LATE = 25.00;   // ₱25 per late
    public const LATE_THRESHOLD_MINUTES = 15; // Minutes before considered late

    /**
     * Relationships
     */
    public function officerDuty(): BelongsTo
    {
        return $this->belongsTo(OfficerDuty::class);
    }

    public function officer(): BelongsTo
    {
        return $this->belongsTo(Officer::class);
    }

    public function excuseApprover(): BelongsTo
    {
        return $this->belongsTo(User::class, 'excuse_approved_by');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * Scopes
     */
    public function scopeToday($query)
    {
        return $query->where('duty_date', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('duty_date', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeUnpaidFines($query)
    {
        return $query->where('has_fine', true)->where('fine_paid', false);
    }

    public function scopePendingExcuses($query)
    {
        return $query->whereNotNull('excuse_reason')->where('excuse_approved', false);
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status ?? 'Pending';
    }

    public function getFormattedCheckInAttribute(): ?string
    {
        return $this->checked_in_at?->format('g:i A');
    }

    public function getFormattedCheckOutAttribute(): ?string
    {
        return $this->checked_out_at?->format('g:i A');
    }

    public function getFormattedFineAttribute(): string
    {
        return $this->fine_amount ? '₱' . number_format($this->fine_amount, 2) : '—';
    }

    /**
     * Helper Methods
     */
    public function checkIn(): void
    {
        $scheduledStart = $this->officerDuty->start_time;
        $now = now();
        
        $lateMinutes = 0;
        $status = 'present';
        
        // Calculate if late
        if ($scheduledStart) {
            $scheduledTime = $this->duty_date->setTimeFromTimeString($scheduledStart);
            if ($now->gt($scheduledTime->addMinutes(self::LATE_THRESHOLD_MINUTES))) {
                $lateMinutes = $now->diffInMinutes($scheduledTime);
                $status = 'late';
            }
        }
        
        $this->update([
            'checked_in_at' => $now,
            'status' => $status,
            'late_minutes' => $lateMinutes,
            'has_fine' => $status === 'late',
            'fine_amount' => $status === 'late' ? self::FINE_PER_LATE : null,
        ]);
    }

    public function checkOut(): void
    {
        $this->update(['checked_out_at' => now()]);
    }
}
