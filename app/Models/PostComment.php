<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * PostComment Model
 * 
 * Threaded comments for achievement posts.
 */
class PostComment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'content',
        'is_flagged',
        'flag_reason',
        'flagged_by',
    ];

    protected $casts = [
        'is_flagged' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(AchievementPost::class, 'post_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(PostComment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(PostComment::class, 'parent_id');
    }

    public function flagger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'flagged_by');
    }

    /**
     * Scopes
     */
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeNotFlagged($query)
    {
        return $query->where('is_flagged', false);
    }

    public function scopeFlagged($query)
    {
        return $query->where('is_flagged', true);
    }

    /**
     * Get nested replies recursively (for threaded display)
     */
    public function nestedReplies(): HasMany
    {
        return $this->replies()->with(['author', 'nestedReplies']);
    }

    /**
     * Flag a comment
     */
    public function flag(User $flagger, ?string $reason = null): void
    {
        $this->update([
            'is_flagged' => true,
            'flag_reason' => $reason,
            'flagged_by' => $flagger->id,
        ]);
    }

    /**
     * Unflag a comment
     */
    public function unflag(): void
    {
        $this->update([
            'is_flagged' => false,
            'flag_reason' => null,
            'flagged_by' => null,
        ]);
    }

    /**
     * Check if comment is a reply
     */
    public function isReply(): bool
    {
        return !is_null($this->parent_id);
    }
}
