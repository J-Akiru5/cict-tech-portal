<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

/**
 * Announcement Model
 * 
 * Represents official announcements from the Student Council.
 * Supports categories, priority levels, scheduling, and soft deletes.
 */
class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'excerpt',
        'category',
        'priority',
        'is_pinned',
        'is_published',
        'published_at',
        'expires_at',
        'featured_image',
        'author_id',
        'slug',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Boot method - auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($announcement) {
            if (empty($announcement->slug)) {
                $announcement->slug = Str::slug($announcement->title);
            }
            
            // Auto-generate excerpt if not provided
            if (empty($announcement->excerpt)) {
                $announcement->excerpt = Str::limit(strip_tags($announcement->content), 150);
            }
        });
    }

    /**
     * Relationships
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scopes
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->where(function ($q) {
                         $q->whereNull('published_at')
                           ->orWhere('published_at', '<=', now());
                     })
                     ->where(function ($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }

    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeUrgent($query)
    {
        return $query->where('priority', 'high')
                     ->orWhere('category', 'urgent');
    }

    /**
     * Accessors
     */
    public function getFormattedDateAttribute(): string
    {
        $date = $this->published_at ?? $this->created_at;
        return $date->format('M d, Y');
    }

    public function getCategoryBadgeColorAttribute(): string
    {
        return match($this->category) {
            'urgent' => 'red',
            'event' => 'gold',
            'meeting' => 'blue',
            'academic' => 'purple',
            'achievement' => 'green',
            default => 'gray',
        };
    }

    public function getIsActiveAttribute(): bool
    {
        $now = now();
        
        $published = $this->is_published && 
                     ($this->published_at === null || $this->published_at <= $now);
        
        $notExpired = $this->expires_at === null || $this->expires_at > $now;
        
        return $published && $notExpired;
    }
}
