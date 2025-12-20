<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * AchievementController
 * 
 * Handles the digital bulletin board display.
 */
class AchievementController extends Controller
{
    /**
     * Display the bulletin board (Public)
     */
    public function index(Request $request): Response
    {
        $type = $request->get('type');
        
        $query = Achievement::active()->ordered();
        
        if ($type && $type !== 'all') {
            $query->ofType($type);
        }
        
        $achievements = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'type' => $item->type,
                'typeIcon' => $item->type_icon,
                'imageUrl' => $item->image_url,
                'achievedDate' => $item->formatted_date,
                'isFeatured' => $item->is_featured,
                'linkUrl' => $item->link_url,
                'linkText' => $item->link_text,
            ];
        });
        
        // Get featured items for carousel
        $featured = $achievements->where('isFeatured', true)->values();
        
        return Inertia::render('Public/BulletinBoard', [
            'achievements' => $achievements,
            'featured' => $featured,
            'types' => [
                'all' => 'All',
                'achievement' => '🏆 Achievements',
                'program' => '📌 Programs',
                'event' => '🎉 Events',
                'recognition' => '⭐ Recognitions',
                'milestone' => '🎯 Milestones',
            ],
            'currentType' => $type ?? 'all',
        ]);
    }

    /**
     * Get featured achievements for landing page
     */
    public function featured(): array
    {
        return Achievement::active()
            ->featured()
            ->ordered()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'typeIcon' => $item->type_icon,
                    'imageUrl' => $item->image_url,
                ];
            })
            ->toArray();
    }
}
