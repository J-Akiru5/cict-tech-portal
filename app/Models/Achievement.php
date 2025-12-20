<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Achievement Model
 * 
 * Represents achievements, programs, and milestones for the digital bulletin board.
 */
class Achievement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'type',
        'image',
        'icon',
        'achieved_date',
        'is_featured',
        'is_active',
        'sort_order',
        'link_url',
        'link_text',
        'academic_year_id',
    ];

    protected $casts = [
        'achieved_date' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Type icons/emojis
     */
    public const TYPE_ICONS = [
        'achievement' => '🏆',
        'program' => '📌',
        'event' => '🎉',
        'recognition' => '⭐',
        'milestone' => '🎯',
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

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered($query)
    {
        return $query->orderByDesc('is_featured')
                     ->orderBy('sort_order')
                     ->orderByDesc('achieved_date');
    }

    /**
     * Accessors
     */
    public function getTypeIconAttribute(): string
    {
        return $this->icon ?? self::TYPE_ICONS[$this->type] ?? '📣';
    }

    public function getImageUrlAttribute(): ?string
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }

    public function getFormattedDateAttribute(): ?string
    {
        return $this->achieved_date?->format('M d, Y');
    }
}
