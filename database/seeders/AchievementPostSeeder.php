<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AcademicYear;
use App\Models\AchievementPost;
use App\Models\CouncilHighlight;
use App\Models\PostReaction;
use App\Models\PostComment;
use Illuminate\Database\Seeder;

/**
 * AchievementPostSeeder
 * 
 * Seeds achievement posts from CouncilHighlights and additional sample posts.
 * Uses random authorized uploaders (President, EVP, Secretary, Dir. Comms, Adviser, Dean).
 */
class AchievementPostSeeder extends Seeder
{
    /**
     * Roles that can post achievements
     */
    protected array $authorizedRoles = [
        'sc-president',
        'sc-secretary',
        'sc-adviser',
        'dean',
        'main-admin',
    ];

    public function run(): void
    {
        // Get authorized users
        $authorizedUsers = User::role($this->authorizedRoles)->get();

        if ($authorizedUsers->isEmpty()) {
            $this->command->warn('No authorized users found. Please run RoleSeeder first.');
            return;
        }

        // Sync from CouncilHighlights
        $this->syncFromCouncilHighlights($authorizedUsers);

        // Add additional sample posts
        $this->addSamplePosts($authorizedUsers);

        // Add sample reactions and comments
        $this->addSampleInteractions();

        $this->command->info('Achievement posts seeded successfully!');
    }

    private function syncFromCouncilHighlights($authorizedUsers): void
    {
        $highlights = CouncilHighlight::with('academicYear')->get();

        foreach ($highlights as $highlight) {
            // Map highlight type to post category
            $category = match($highlight->type) {
                'event' => 'event',
                'accomplishment', 'milestone' => 'award',
                'initiative' => 'project',
                default => 'event',
            };

            // Get random authorized user
            $author = $authorizedUsers->random();

            AchievementPost::updateOrCreate(
                [
                    'title' => $highlight->title,
                    'academic_year_id' => $highlight->academic_year_id,
                ],
                [
                    'user_id' => $author->id,
                    'content' => $highlight->description,
                    'category' => $category,
                    'is_featured' => $highlight->is_featured,
                    'is_pinned' => $highlight->is_featured,
                ]
            );

            $this->command->info("Synced: {$highlight->title} (by {$author->name})");
        }
    }

    private function addSamplePosts($authorizedUsers): void
    {
        $currentYear = AcademicYear::getCurrentYear();
        $yearId = $currentYear?->id ?? 1;

        $samplePosts = [
            [
                'title' => 'CICT Wins Inter-College Programming Competition',
                'content' => 'Our students dominated the annual Inter-College Programming Competition, taking 1st, 2nd, and 3rd place! The winning team solved 8 out of 10 problems in record time. Congratulations to all participants!',
                'category' => 'award',
                'is_featured' => true,
                'is_pinned' => true,
            ],
            [
                'title' => 'Student Council General Assembly Success',
                'content' => 'We held our first General Assembly of the academic year with over 500 students in attendance. Key topics included the new Tech Portal launch, upcoming IT Week events, and opportunities for student involvement.',
                'category' => 'event',
                'is_featured' => false,
            ],
            [
                'title' => 'New Computer Laboratory Inauguration',
                'content' => 'The new state-of-the-art Computer Laboratory 6 has been officially opened! Featuring 50 high-spec workstations, dual monitors, and VR equipment for emerging tech courses.',
                'category' => 'project',
                'is_featured' => true,
            ],
            [
                'title' => 'CICT Students Represent in Regional Hackathon',
                'content' => 'Five teams from CICT participated in the Regional Tech Hackathon, with Team InnovatePH securing the runner-up position for their AI-powered campus navigation app.',
                'category' => 'award',
                'is_featured' => false,
            ],
            [
                'title' => 'Community Outreach: Tech Literacy Program',
                'content' => 'As part of our social responsibility, CICT students conducted a 3-day tech literacy program for senior citizens in Barangay San Isidro. Over 100 participants learned basic smartphone and internet skills.',
                'category' => 'event',
                'is_featured' => false,
            ],
        ];

        foreach ($samplePosts as $post) {
            $author = $authorizedUsers->random();
            
            AchievementPost::updateOrCreate(
                ['title' => $post['title']],
                array_merge($post, [
                    'user_id' => $author->id,
                    'academic_year_id' => $yearId,
                ])
            );

            $this->command->info("Created: {$post['title']} (by {$author->name})");
        }
    }

    private function addSampleInteractions(): void
    {
        $students = User::role('student')->get();
        $posts = AchievementPost::all();

        if ($students->isEmpty() || $posts->isEmpty()) {
            return;
        }

        $reactions = ['like', 'love', 'celebrate', 'applaud'];
        $comments = [
            'This is amazing! So proud of our college! 🎉',
            'Congratulations to everyone involved! 👏',
            'Keep up the great work CICT!',
            'This is why I love being part of CICT!',
            'Incredible achievement! Well deserved! 🏆',
            'Looking forward to more events like this!',
        ];

        foreach ($posts as $post) {
            // Add 3-8 random reactions per post
            $reactingUsers = $students->shuffle()->take(rand(3, 8));
            foreach ($reactingUsers as $user) {
                PostReaction::updateOrCreate(
                    ['post_id' => $post->id, 'user_id' => $user->id],
                    ['reaction_type' => $reactions[array_rand($reactions)]]
                );
            }

            // Add 1-3 random comments per post
            $commentingUsers = $students->shuffle()->take(rand(1, 3));
            foreach ($commentingUsers as $user) {
                PostComment::updateOrCreate(
                    ['post_id' => $post->id, 'user_id' => $user->id, 'parent_id' => null],
                    ['content' => $comments[array_rand($comments)]]
                );
            }

            // Update cached counts
            $post->updateCounts();
        }

        $this->command->info('Added sample reactions and comments!');
    }
}
