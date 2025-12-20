<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

/**
 * MeetingNote Model
 * 
 * Represents meeting minutes recorded by the Secretary.
 */
class MeetingNote extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'type',
        'meeting_date',
        'start_time',
        'end_time',
        'venue',
        'agenda',
        'minutes',
        'resolutions',
        'action_items',
        'attachments',
        'created_by',
        'status',
        'approved_by',
        'approved_at',
        'academic_year_id',
    ];

    protected $casts = [
        'meeting_date' => 'date',
        'approved_at' => 'datetime',
        'attachments' => 'array',
    ];

    public const TYPES = [
        'regular' => '📋 Regular Meeting',
        'emergency' => '🚨 Emergency Meeting',
        'special' => '⭐ Special Meeting',
        'committee' => '👥 Committee Meeting',
    ];

    public const STATUSES = [
        'draft' => 'Draft',
        'pending_approval' => 'Pending Approval',
        'approved' => 'Approved',
        'archived' => 'Archived',
    ];

    /**
     * Boot
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($note) {
            if (empty($note->slug)) {
                $note->slug = Str::slug($note->title) . '-' . Str::random(5);
            }
        });
    }

    /**
     * Relationships
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(Officer::class, 'meeting_attendees')
            ->withPivot(['status', 'remarks'])
            ->withTimestamps();
    }

    /**
     * Scopes
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('meeting_date');
    }

    /**
     * Accessors
     */
    public function getTypeLabelAttribute(): string
    {
        return self::TYPES[$this->type] ?? $this->type;
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getFormattedTimeAttribute(): string
    {
        if (!$this->start_time) {
            return 'Time not set';
        }
        
        $start = date('g:i A', strtotime($this->start_time));
        $end = $this->end_time ? date('g:i A', strtotime($this->end_time)) : '';
        
        return $end ? "{$start} - {$end}" : $start;
    }
}
