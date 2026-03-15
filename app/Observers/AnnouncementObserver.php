<?php

namespace App\Observers;

use App\Models\Announcement;
use Illuminate\Support\Facades\Cache;

/**
 * AnnouncementObserver
 * 
 * Handles cache invalidation when announcements are created, updated, or deleted.
 */
class AnnouncementObserver
{
    /**
     * Clear cache when announcement is saved
     */
    public function saved(Announcement $announcement): void
    {
        Cache::forget('dashboard:announcements:latest');
    }

    /**
     * Clear cache when announcement is deleted
     */
    public function deleted(Announcement $announcement): void
    {
        Cache::forget('dashboard:announcements:latest');
    }
}
