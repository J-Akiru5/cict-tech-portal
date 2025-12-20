<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Officer Model
 * 
 * Represents a Student Council officer for a specific academic year.
 */
class Officer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'position',
        'position_short',
        'hierarchy_level',
        'sort_order',
        'email',
        'phone',
        'facebook_url',
        'photo',
        'course',
        'year_level',
        'motto',
        'academic_year_id',
        'user_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'hierarchy_level' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * Relationships
     */
    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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

    public function scopeCurrentYear($query)
    {
        $currentYear = AcademicYear::getCurrentYear();
        return $currentYear ? $query->forYear($currentYear->id) : $query;
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('hierarchy_level')->orderBy('sort_order');
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

    /**
     * Get officers grouped by hierarchy level for org chart
     */
    public static function getOrgChartData(int $academicYearId): array
    {
        $officers = static::active()
            ->forYear($academicYearId)
            ->ordered()
            ->get();

        return $officers->groupBy('hierarchy_level')->toArray();
    }
}
