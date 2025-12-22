<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

/**
 * Controller for managing application settings.
 * 
 * Uses a simple file-based storage for settings since this is a portal
 * with relatively static configuration needs.
 */
class SettingsController extends Controller
{
    /**
     * Settings file path.
     */
    protected string $settingsFile;

    /**
     * Default settings structure.
     */
    protected array $defaults = [
        'site' => [
            'name' => 'CICT Tech Portal',
            'tagline' => 'College of Information and Communications Technology',
            'description' => 'Student organization portal for CICT students.',
            'contact_email' => 'cict@example.edu',
            'contact_phone' => '',
            'address' => 'Bulacan State University, City of Malolos, Bulacan',
        ],
        'features' => [
            'enrollment_enabled' => true,
            'event_registration_enabled' => true,
            'posts_enabled' => true,
            'gallery_enabled' => true,
            'maintenance_mode' => false,
        ],
        'social' => [
            'facebook' => '',
            'twitter' => '',
            'instagram' => '',
            'linkedin' => '',
            'youtube' => '',
        ],
        'email' => [
            'mail_mailer' => '',
            'mail_host' => '',
            'mail_port' => '',
            'mail_from_address' => '',
            'mail_from_name' => '',
        ],
    ];

    public function __construct()
    {
        $this->settingsFile = storage_path('app/settings.json');
    }

    /**
     * Display the settings page.
     */
    public function index()
    {
        $settings = $this->getSettings();
        
        // Mask sensitive email config values
        $settings['email'] = [
            'mail_mailer' => config('mail.default', 'smtp'),
            'mail_host' => config('mail.mailers.smtp.host', ''),
            'mail_port' => config('mail.mailers.smtp.port', ''),
            'mail_from_address' => config('mail.from.address', ''),
            'mail_from_name' => config('mail.from.name', ''),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            // Site settings
            'site.name' => 'required|string|max:255',
            'site.tagline' => 'nullable|string|max:500',
            'site.description' => 'nullable|string|max:1000',
            'site.contact_email' => 'nullable|email|max:255',
            'site.contact_phone' => 'nullable|string|max:50',
            'site.address' => 'nullable|string|max:500',
            
            // Feature toggles
            'features.enrollment_enabled' => 'boolean',
            'features.event_registration_enabled' => 'boolean',
            'features.posts_enabled' => 'boolean',
            'features.gallery_enabled' => 'boolean',
            'features.maintenance_mode' => 'boolean',
            
            // Social links
            'social.facebook' => 'nullable|url|max:255',
            'social.twitter' => 'nullable|url|max:255',
            'social.instagram' => 'nullable|url|max:255',
            'social.linkedin' => 'nullable|url|max:255',
            'social.youtube' => 'nullable|url|max:255',
        ]);

        try {
            $settings = $this->getSettings();
            
            // Merge validated data
            $settings['site'] = $validated['site'] ?? $settings['site'];
            $settings['features'] = $validated['features'] ?? $settings['features'];
            $settings['social'] = $validated['social'] ?? $settings['social'];
            
            $this->saveSettings($settings);
            
            // Clear any cached settings
            Cache::forget('app_settings');
            
            // Log the activity
            activity()
                ->causedBy(Auth::user())
                ->withProperties(['changes' => $validated])
                ->log('Updated site settings');

            return back()->with('success', 'Settings updated successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to save settings: ' . $e->getMessage());
            
            return back()->with('error', 'Failed to save settings: ' . $e->getMessage());
        }
    }

    /**
     * Get all settings.
     */
    protected function getSettings(): array
    {
        if (!file_exists($this->settingsFile)) {
            return $this->defaults;
        }

        try {
            $content = file_get_contents($this->settingsFile);
            $settings = json_decode($content, true);
            
            return array_replace_recursive($this->defaults, $settings ?? []);
        } catch (\Exception $e) {
            Log::error('Failed to read settings: ' . $e->getMessage());
            return $this->defaults;
        }
    }

    /**
     * Save settings to file.
     */
    protected function saveSettings(array $settings): void
    {
        $directory = dirname($this->settingsFile);
        
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        file_put_contents(
            $this->settingsFile,
            json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
    }

    /**
     * Static helper to retrieve a setting value.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $controller = new static();
        $settings = $controller->getSettings();
        
        return data_get($settings, $key, $default);
    }
}
