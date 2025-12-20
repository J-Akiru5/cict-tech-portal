<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * AnnouncementSeeder
 * 
 * Seeds sample announcements for development and testing.
 */
class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user as author (should be admin)
        $author = User::first();
        
        if (!$author) {
            $this->command->error('No users found. Please run UserSeeder first.');
            return;
        }

        $announcements = [
            [
                'title' => 'Welcome to the CICT Student Council Portal!',
                'content' => '<p>We are thrilled to announce the launch of the official CICT Student Council Portal. This platform will serve as your one-stop destination for all council-related announcements, events, and resources.</p><p>Features include:</p><ul><li>Real-time announcements</li><li>Event registration</li><li>Officer schedules</li><li>CBL document access</li></ul><p>Stay tuned for more updates!</p>',
                'excerpt' => 'The official CICT Student Council Portal is now live! Discover all the features we have built for you.',
                'category' => 'general',
                'priority' => 'high',
                'is_pinned' => true,
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'General Assembly: December 2025',
                'content' => '<p>All CICT students are required to attend the General Assembly on December 28, 2025.</p><p><strong>Venue:</strong> CICT Auditorium</p><p><strong>Time:</strong> 10:00 AM - 12:00 PM</p><p>Topics to be discussed:</p><ul><li>Semester review</li><li>Upcoming events for January</li><li>New council initiatives</li></ul>',
                'excerpt' => 'Mandatory General Assembly for all CICT students. December 28, 2025 at 10:00 AM.',
                'category' => 'meeting',
                'priority' => 'high',
                'is_pinned' => false,
                'is_published' => true,
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'CICT Week 2026 Announcement',
                'content' => '<p>Mark your calendars! CICT Week 2026 is happening from February 10-14, 2026.</p><p>Activities will include:</p><ul><li>Tech Olympiad</li><li>Coding Challenge</li><li>Esports Tournament</li><li>Cultural Night</li></ul><p>Registration opens January 15, 2026.</p>',
                'excerpt' => 'CICT Week 2026 is coming! Five days of exciting activities from February 10-14.',
                'category' => 'event',
                'priority' => 'medium',
                'is_pinned' => false,
                'is_published' => true,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Congratulations to Our Programming Contest Winners!',
                'content' => '<p>We are proud to announce the winners of the Inter-Campus Programming Contest 2025!</p><p><strong>1st Place:</strong> Team CICT Alpha<br><strong>2nd Place:</strong> Team CICT Beta<br><strong>3rd Place:</strong> Team CICT Gamma</p><p>Congratulations to all participants for representing our college with excellence!</p>',
                'excerpt' => 'CICT sweeps the Inter-Campus Programming Contest 2025. Congratulations to our winners!',
                'category' => 'achievement',
                'priority' => 'medium',
                'is_pinned' => false,
                'is_published' => true,
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'Updated Constitution and By-Laws Now Available',
                'content' => '<p>The revised CICT Student Council Constitution and By-Laws has been ratified and is now available for viewing on the portal.</p><p>Key changes include:</p><ul><li>Updated officer responsibilities</li><li>New committee structure</li><li>Revised election procedures</li></ul><p>Please review the document in the CBL section.</p>',
                'excerpt' => 'The revised CBL document is now available. Review the updated constitution and by-laws.',
                'category' => 'academic',
                'priority' => 'medium',
                'is_pinned' => false,
                'is_published' => true,
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'URGENT: Final Exam Week Schedule',
                'content' => '<p><strong>ATTENTION ALL STUDENTS</strong></p><p>Final exam week will run from December 16-20, 2025. All non-essential council activities are suspended.</p><p>The Student Council office will have limited hours during this period. Focus on your studies!</p>',
                'excerpt' => 'Final exam week: December 16-20. Council activities suspended. Good luck on your exams!',
                'category' => 'urgent',
                'priority' => 'high',
                'is_pinned' => true,
                'is_published' => true,
                'published_at' => now()->subDay(),
            ],
        ];

        foreach ($announcements as $data) {
            Announcement::create([
                ...$data,
                'author_id' => $author->id,
            ]);
        }

        $this->command->info('Seeded ' . count($announcements) . ' announcements.');
    }
}
