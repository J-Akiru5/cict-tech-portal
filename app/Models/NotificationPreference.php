<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * NotificationPreference Model
 * 
 * Stores user preferences for notification channels and types.
 */
class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'channel',
        'type',
        'enabled',
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];

    /**
     * Available notification channels.
     */
    public const CHANNELS = [
        'database' => 'In-App Notifications',
        'email' => 'Email Notifications',
    ];

    /**
     * Available notification types.
     */
    public const TYPES = [
        'event_reminder' => 'Event Reminders',
        'event_registration' => 'Event Registration Confirmations',
        'announcement' => 'New Announcements',
        'enrollment' => 'Enrollment Updates',
        'payment' => 'Payment Confirmations',
        'system' => 'System Notifications',
    ];

    /**
     * Get the user that owns this preference.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if a user has a specific notification enabled.
     */
    public static function isEnabled(int $userId, string $type, string $channel = 'database'): bool
    {
        $preference = static::where('user_id', $userId)
            ->where('type', $type)
            ->where('channel', $channel)
            ->first();

        // Default to enabled if no preference exists
        return $preference?->enabled ?? true;
    }

    /**
     * Set a notification preference for a user.
     */
    public static function setPreference(int $userId, string $type, string $channel, bool $enabled): self
    {
        return static::updateOrCreate(
            [
                'user_id' => $userId,
                'type' => $type,
                'channel' => $channel,
            ],
            ['enabled' => $enabled]
        );
    }
}
