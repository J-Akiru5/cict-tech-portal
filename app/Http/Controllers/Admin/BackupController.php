<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use Carbon\Carbon;

/**
 * Controller for managing database and application backups.
 * 
 * Uses the spatie/laravel-backup package for creating backups.
 * Provides functionality to list, create, download, and delete backups.
 */
class BackupController extends Controller
{
    /**
     * The backup disk name.
     */
    protected string $disk = 'local';

    /**
     * The backup folder path.
     */
    protected string $backupPath;

    public function __construct()
    {
        // Get backup path from config or use default
        $this->backupPath = config('backup.backup.name', 'cict-tech-portal');
    }

    /**
     * Display the backup management page.
     */
    public function index()
    {
        $backups = $this->getBackups();
        $stats = $this->getStorageStats();

        return Inertia::render('Admin/Backups/Index', [
            'backups' => $backups,
            'stats' => $stats,
        ]);
    }

    /**
     * Create a new backup.
     */
    public function create(Request $request)
    {
        try {
            // Check if we're running database-only backup
            $onlyDb = $request->boolean('only_database', true);
            
            if ($onlyDb) {
                Artisan::call('backup:run', [
                    '--only-db' => true,
                ]);
            } else {
                Artisan::call('backup:run');
            }

            $output = Artisan::output();
            
            // Log the backup activity
            activity()
                ->causedBy(Auth::user())
                ->withProperties([
                    'type' => $onlyDb ? 'database' : 'full',
                    'output' => $output,
                ])
                ->log('Created backup');

            return back()->with('success', 'Backup created successfully!');
        } catch (\Exception $e) {
            Log::error('Backup creation failed: ' . $e->getMessage());
            
            return back()->with('error', 'Failed to create backup: ' . $e->getMessage());
        }
    }

    /**
     * Download a backup file.
     */
    public function download(string $filename)
    {
        $path = $this->backupPath . '/' . $filename;

        if (!Storage::disk($this->disk)->exists($path)) {
            return back()->with('error', 'Backup file not found.');
        }

        // Log download
        activity()
            ->causedBy(Auth::user())
            ->withProperties(['filename' => $filename])
            ->log('Downloaded backup');

        $fullPath = Storage::disk($this->disk)->path($path);
        return response()->download($fullPath, $filename);
    }

    /**
     * Delete a backup file.
     */
    public function destroy(string $filename)
    {
        $path = $this->backupPath . '/' . $filename;

        if (!Storage::disk($this->disk)->exists($path)) {
            return back()->with('error', 'Backup file not found.');
        }

        try {
            Storage::disk($this->disk)->delete($path);

            // Log deletion
            activity()
                ->causedBy(Auth::user())
                ->withProperties(['filename' => $filename])
                ->log('Deleted backup');

            return back()->with('success', 'Backup deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Backup deletion failed: ' . $e->getMessage());
            
            return back()->with('error', 'Failed to delete backup: ' . $e->getMessage());
        }
    }

    /**
     * Get list of all backups.
     */
    protected function getBackups(): array
    {
        $backups = [];
        
        try {
            $files = Storage::disk($this->disk)->files($this->backupPath);
            
            foreach ($files as $file) {
                $filename = basename($file);
                
                // Only include zip files
                if (pathinfo($filename, PATHINFO_EXTENSION) !== 'zip') {
                    continue;
                }

                $backups[] = [
                    'filename' => $filename,
                    'path' => $file,
                    'size' => $this->formatBytes(Storage::disk($this->disk)->size($file)),
                    'size_bytes' => Storage::disk($this->disk)->size($file),
                    'last_modified' => Carbon::createFromTimestamp(
                        Storage::disk($this->disk)->lastModified($file)
                    )->format('M d, Y H:i'),
                    'last_modified_timestamp' => Storage::disk($this->disk)->lastModified($file),
                ];
            }

            // Sort by date, newest first
            usort($backups, fn($a, $b) => $b['last_modified_timestamp'] <=> $a['last_modified_timestamp']);
        } catch (\Exception $e) {
            Log::error('Failed to list backups: ' . $e->getMessage());
        }

        return $backups;
    }

    /**
     * Get storage statistics.
     */
    protected function getStorageStats(): array
    {
        $totalSize = 0;
        $backupCount = 0;

        try {
            $files = Storage::disk($this->disk)->files($this->backupPath);
            
            foreach ($files as $file) {
                if (pathinfo($file, PATHINFO_EXTENSION) === 'zip') {
                    $totalSize += Storage::disk($this->disk)->size($file);
                    $backupCount++;
                }
            }
        } catch (\Exception $e) {
            Log::error('Failed to get storage stats: ' . $e->getMessage());
        }

        return [
            'total_size' => $this->formatBytes($totalSize),
            'total_size_bytes' => $totalSize,
            'backup_count' => $backupCount,
            'disk' => $this->disk,
            'path' => $this->backupPath,
        ];
    }

    /**
     * Format bytes to human-readable string.
     */
    protected function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
