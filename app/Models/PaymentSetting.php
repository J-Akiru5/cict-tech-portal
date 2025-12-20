<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * PaymentSetting Model
 * 
 * Stores GCash/payment account information for the organization.
 */
class PaymentSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_method',
        'account_name',
        'account_number',
        'qr_code_path',
        'instructions',
        'is_active',
        'academic_year_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public const PAYMENT_METHODS = [
        'gcash' => 'GCash',
        'bank' => 'Bank Transfer',
        'cash' => 'Cash',
    ];

    /**
     * Relationships
     */
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

    /**
     * Accessors
     */
    public function getQrCodeUrlAttribute(): ?string
    {
        return $this->qr_code_path ? asset('storage/' . $this->qr_code_path) : null;
    }

    public function getMaskedAccountNumberAttribute(): string
    {
        $number = $this->account_number;
        if (strlen($number) > 4) {
            return str_repeat('•', strlen($number) - 4) . substr($number, -4);
        }
        return $number;
    }
}
