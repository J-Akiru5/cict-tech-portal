<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * AchievementPost Model
 * 
 * Twitter-like posts for SC accomplishments.
 * Can be created by authorized officers (President, EVP, Secretary, Dir. Comms, Adviser, Dean).
 */
class AchievementPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'academic_year_id',
        'title',
        'content',
        'category',
        'image_path',
        'is_pinned',
        'is_featured',
        'reactions_count',
        'comments_count',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_featured' => 'boolean',
        'reactions_count' => 'integer',
        'comments_count' => 'integer',
    ];

    /**
     * Categories
     */
    public const CATEGORY_EVENT = 'event';
    public const CATEGORY_AWARD = 'award';
    public const CATEGORY_PROJECT = 'project';

    public const CATEGORIES = [
        self::CATEGORY_EVENT => 'Event',
        self::CATEGORY_AWARD => 'Award',
        self::CATEGORY_PROJECT => 'Project',
    ];

    /**
     * Relationships
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(PostReaction::class, 'post_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(PostComment::class, 'post_id');
    }

    public function topLevelComments(): HasMany
    {
        return $this->hasMany(PostComment::class, 'post_id')->whereNull('parent_id');
    }

    /**
     * Scopes
     */
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeForYear($query, int $academicYearId)
    {
        return $query->where('academic_year_id', $academicYearId);
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('is_pinned', 'desc')->orderBy('created_at', 'desc');
    }

    /**
     * Accessors
     */
    public function getImageUrlAttribute(): ?string
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return null;
    }

    public function getCategoryLabelAttribute(): string
    {
        return self::CATEGORIES[$this->category] ?? $this->category;
    }

    public function getCategoryIconAttribute(): string
    {
        return match($this->category) {
            'event' => '📅',
            'award' => '🏆',
            'project' => '🚀',
            default => '📢',
        };
    }

    /**
     * Check if a user has reacted to this post
     */
    public function userReaction(?User $user): ?PostReaction
    {
        if (!$user) return null;
        return $this->reactions()->where('user_id', $user->id)->first();
    }

    /**
     * Get reaction counts by type
     */
    public function getReactionCounts(): array
    {
        return $this->reactions()
            ->selectRaw('reaction_type, COUNT(*) as count')
            ->groupBy('reaction_type')
            ->pluck('count', 'reaction_type')
            ->toArray();
    }

    /**
     * Update cached counts
     */
    public function updateCounts(): void
    {
        $this->update([
            'reactions_count' => $this->reactions()->count(),
            'comments_count' => $this->comments()->count(),
        ]);
    }
}
