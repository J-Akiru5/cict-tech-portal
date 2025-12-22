<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsModelActivity;

/**
 * EventRegistration Model
 * 
 * Tracks student registrations for events that require registration.
 */
class EventRegistration extends Model
{
    use LogsModelActivity;

    protected $fillable = [
        'user_id',
        'event_id',
        'status',
        'registered_at',
        'attended_at',
        'notes',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
        'attended_at' => 'datetime',
    ];

    /**
     * Get the user who registered
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Scope: Only registered (not cancelled)
     */
    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'cancelled');
    }

    /**
     * Scope: Attended
     */
    public function scopeAttended($query)
    {
        return $query->where('status', 'attended');
    }

    /**
     * Mark as attended
     */
    public function markAsAttended(): void
    {
        $this->update([
            'status' => 'attended',
            'attended_at' => now(),
        ]);
    }

    /**
     * Cancel registration
     */
    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }
}
