<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Enrollment Model
 * 
 * Tracks student SC enrollment per semester with department fee payment.
 */
class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'academic_year_id',
        'course',
        'year_level',
        'section',
        'status',
        'enrolled_at',
        'fee_paid',
        'fee_amount',
        'payment_record_id',
        'fee_paid_at',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'fee_paid' => 'boolean',
        'fee_amount' => 'decimal:2',
        'fee_paid_at' => 'datetime',
    ];

    public const STATUSES = [
        'pending' => 'Pending',
        'enrolled' => 'Enrolled',
        'dropped' => 'Dropped',
    ];

    public const COURSES = [
        'BSIT' => 'BS Information Technology',
        'BSCS' => 'BS Computer Science',
        'BSIS' => 'BS Information Systems',
        'ACT' => 'Associate in Computer Technology',
    ];

    public const YEAR_LEVELS = [
        '1st Year' => '1st Year',
        '2nd Year' => '2nd Year',
        '3rd Year' => '3rd Year',
        '4th Year' => '4th Year',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function paymentRecord(): BelongsTo
    {
        return $this->belongsTo(PaymentRecord::class);
    }

    /**
     * Scopes
     */
    public function scopeCurrentSemester($query)
    {
        $currentYear = AcademicYear::getCurrentYear();
        return $currentYear ? $query->where('academic_year_id', $currentYear->id) : $query;
    }

    public function scopeEnrolled($query)
    {
        return $query->where('status', 'enrolled');
    }

    public function scopePaid($query)
    {
        return $query->where('fee_paid', true);
    }

    public function scopeUnpaid($query)
    {
        return $query->where('fee_paid', false);
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getCourseLabelAttribute(): string
    {
        return self::COURSES[$this->course] ?? $this->course;
    }

    public function getFormattedFeeAttribute(): string
    {
        return '₱' . number_format($this->fee_amount, 2);
    }

    public function getFullSectionAttribute(): string
    {
        return "{$this->course} {$this->year_level}-{$this->section}";
    }

    /**
     * Helper Methods
     */
    public function markAsPaid(?int $paymentRecordId = null): void
    {
        $this->update([
            'fee_paid' => true,
            'fee_paid_at' => now(),
            'payment_record_id' => $paymentRecordId,
            'status' => 'enrolled',
            'enrolled_at' => $this->enrolled_at ?? now(),
        ]);
    }

    /**
     * Check if user is enrolled for current semester
     */
    public static function isEnrolledForCurrentSemester(int $userId): bool
    {
        return static::where('user_id', $userId)
            ->currentSemester()
            ->enrolled()
            ->exists();
    }

    /**
     * Get current enrollment for user
     */
    public static function getCurrentEnrollment(int $userId): ?self
    {
        return static::where('user_id', $userId)
            ->currentSemester()
            ->first();
    }
}
