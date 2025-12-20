<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * AcademicYear Model
 * 
 * Represents an academic year/term for officer positions.
 */
class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'year_start',
        'year_end',
        'label',
        'semester',
        'is_current',
        'start_date',
        'end_date',
        'enrollment_start',
        'enrollment_end',
        'department_fee',
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'enrollment_start' => 'date',
        'enrollment_end' => 'date',
        'department_fee' => 'decimal:2',
    ];

    public const DEFAULT_DEPARTMENT_FEE = 50.00;

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($year) {
            if (empty($year->label)) {
                $year->label = "A.Y. {$year->year_start}-{$year->year_end}";
            }
        });

        // Ensure only one current year
        static::saving(function ($year) {
            if ($year->is_current) {
                static::where('id', '!=', $year->id)->update(['is_current' => false]);
            }
        });
    }

    /**
     * Relationships
     */
    public function officers(): HasMany
    {
        return $this->hasMany(Officer::class);
    }

    /**
     * Scopes
     */
    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    /**
     * Get the current academic year
     */
    public static function getCurrentYear(): ?self
    {
        return static::current()->first();
    }
}
