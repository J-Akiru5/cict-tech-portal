<?php

namespace App\Providers;

use App\Cache\UpstashStore;
use App\Models\Announcement;
use App\Models\Event;
use App\Observers\AnnouncementObserver;
use App\Observers\EventObserver;
use App\Services\UpstashRedis;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register UpstashRedis as singleton
        $this->app->singleton(UpstashRedis::class, function () {
            return new UpstashRedis();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register custom Upstash cache driver
        Cache::extend('upstash', function ($app) {
            $prefix = config('cache.prefix', 'laravel');
            return Cache::repository(
                new UpstashStore($app->make(UpstashRedis::class), $prefix . ':')
            );
        });

        // Register model observers for cache invalidation
        Event::observe(EventObserver::class);
        Announcement::observe(AnnouncementObserver::class);
    }
}
