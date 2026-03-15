<?php

namespace App\Observers;

use App\Models\Event;
use Illuminate\Support\Facades\Cache;

/**
 * EventObserver
 * 
 * Handles cache invalidation when events are created, updated, or deleted.
 */
class EventObserver
{
    /**
     * Clear relevant caches when an event is saved
     */
    public function saved(Event $event): void
    {
        $this->clearEventCaches($event);
    }

    /**
     * Clear relevant caches when an event is deleted
     */
    public function deleted(Event $event): void
    {
        $this->clearEventCaches($event);
    }

    /**
     * Clear all event-related caches
     */
    private function clearEventCaches(Event $event): void
    {
        // Clear featured events cache
        Cache::forget('calendar:featured');

        // Clear monthly cache for the event's month
        if ($event->event_date) {
            $monthKey = $event->event_date->format('Y-m');
            Cache::forget("calendar:month:{$monthKey}");
        }

        // Clear upcoming events cache
        Cache::forget('events:upcoming');

        // Clear timeline caches
        if ($event->event_date) {
            $year = $event->event_date->format('Y');
            Cache::forget("calendar:timeline:{$year}");
        }
    }
}
