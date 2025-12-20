<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * PaymentRecord Model
 * 
 * Tracks student payment submissions and verification.
 */
class PaymentRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'payment_type',
        'description',
        'amount',
        'status',
        'reference_number',
        'paid_at',
        'proof_path',
        'verified_by',
        'verified_at',
        'rejection_reason',
        'academic_year_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public const PAYMENT_TYPES = [
        'membership_fee' => 'Membership Fee',
        'event_fee' => 'Event Fee',
        'fine' => 'Fine/Penalty',
        'other' => 'Other',
    ];

    public const STATUSES = [
        'pending' => 'Pending',
        'verifying' => 'Under Verification',
        'paid' => 'Paid',
        'rejected' => 'Rejected',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * Scopes
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', ['pending', 'verifying']);
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Accessors
     */
    public function getProofUrlAttribute(): ?string
    {
        return $this->proof_path ? asset('storage/' . $this->proof_path) : null;
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getPaymentTypeLabelAttribute(): string
    {
        return self::PAYMENT_TYPES[$this->payment_type] ?? $this->payment_type;
    }

    public function getFormattedAmountAttribute(): string
    {
        return '₱' . number_format($this->amount, 2);
    }
}
