<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Feedback Model
 * 
 * Represents student feedback, suggestions, and inquiries.
 */
class Feedback extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'feedback';

    protected $fillable = [
        'user_id',
        'category',
        'subject',
        'message',
        'priority',
        'status',
        'response',
        'responded_by',
        'responded_at',
        'is_anonymous',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'responded_at' => 'datetime',
    ];

    /**
     * Category options
     */
    public const CATEGORIES = [
        'suggestion' => '💡 Suggestion',
        'complaint' => '😟 Complaint',
        'inquiry' => '❓ Inquiry',
        'appreciation' => '❤️ Appreciation',
        'other' => '📝 Other',
    ];

    /**
     * Priority levels
     */
    public const PRIORITIES = [
        'low' => 'Low',
        'medium' => 'Medium',
        'high' => 'High',
    ];

    /**
     * Status labels
     */
    public const STATUSES = [
        'pending' => 'Pending',
        'in_review' => 'In Review',
        'resolved' => 'Resolved',
        'closed' => 'Closed',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function responder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responded_by');
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Accessors
     */
    public function getCategoryLabelAttribute(): string
    {
        return self::CATEGORIES[$this->category] ?? $this->category;
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getDisplayNameAttribute(): string
    {
        if ($this->is_anonymous) {
            return 'Anonymous';
        }
        return $this->user?->name ?? 'Unknown';
    }
}
