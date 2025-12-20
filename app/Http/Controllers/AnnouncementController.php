<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * AnnouncementController
 * 
 * Handles public display and admin management of announcements.
 */
class AnnouncementController extends Controller
{
    /**
     * Display a listing of published announcements (Public)
     */
    public function index(Request $request): Response
    {
        $category = $request->get('category');
        
        $query = Announcement::with('author:id,name')
            ->published()
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at');
        
        // Filter by category if provided
        if ($category && $category !== 'all') {
            $query->byCategory($category);
        }
        
        $announcements = $query->paginate(12);
        
        return Inertia::render('Public/Announcements/Index', [
            'announcements' => $announcements,
            'categories' => [
                'all' => 'All',
                'general' => 'General',
                'event' => 'Events',
                'meeting' => 'Meetings',
                'academic' => 'Academic',
                'achievement' => 'Achievements',
                'urgent' => 'Urgent',
            ],
            'currentCategory' => $category ?? 'all',
        ]);
    }

    /**
     * Display a single announcement (Public)
     */
    public function show(string $slug): Response
    {
        $announcement = Announcement::with('author:id,name')
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();
        
        // Get related announcements (same category)
        $related = Announcement::published()
            ->where('id', '!=', $announcement->id)
            ->where('category', $announcement->category)
            ->limit(3)
            ->get(['id', 'title', 'slug', 'excerpt', 'published_at', 'featured_image']);
        
        return Inertia::render('Public/Announcements/Show', [
            'announcement' => $announcement,
            'related' => $related,
        ]);
    }

    /**
     * Get latest announcements for landing page preview
     */
    public function latest(): array
    {
        $announcements = Announcement::with('author:id,name')
            ->published()
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->limit(4)
            ->get(['id', 'title', 'slug', 'excerpt', 'category', 'published_at', 'featured_image', 'is_pinned']);
        
        return $announcements->toArray();
    }
}
