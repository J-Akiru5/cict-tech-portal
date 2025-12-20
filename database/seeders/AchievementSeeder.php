<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;

/**
 * AchievementSeeder
 * 
 * Seeds sample achievements for the digital bulletin board.
 */
class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = AcademicYear::getCurrentYear();
        
        $achievements = [
            [
                'title' => '1st Place - Inter-Campus Programming Contest',
                'description' => 'Team CICT Alpha dominated the regional programming competition, solving 8 out of 10 problems in record time.',
                'type' => 'achievement',
                'icon' => '🥇',
                'achieved_date' => now()->subDays(15),
                'is_featured' => true,
            ],
            [
                'title' => 'CICT Week 2024 - A Huge Success!',
                'description' => 'Over 500 students participated in various activities including hackathons, gaming tournaments, and cultural presentations.',
                'type' => 'event',
                'icon' => '🎊',
                'achieved_date' => now()->subDays(30),
                'is_featured' => true,
            ],
            [
                'title' => 'Best Student Organization Award',
                'description' => 'CICT Student Council was recognized as the Best Student Organization for the academic year 2024.',
                'type' => 'recognition',
                'icon' => '🏅',
                'achieved_date' => now()->subDays(45),
                'is_featured' => true,
            ],
            [
                'title' => 'Blood Donation Drive',
                'description' => 'Successfully collected 50 bags of blood in partnership with Philippine Red Cross.',
                'type' => 'program',
                'icon' => '❤️',
                'achieved_date' => now()->subDays(20),
                'is_featured' => false,
            ],
            [
                'title' => '1000 Members Milestone',
                'description' => 'The CICT portal reached 1000 registered student members!',
                'type' => 'milestone',
                'icon' => '🎯',
                'achieved_date' => now()->subDays(7),
                'is_featured' => false,
            ],
            [
                'title' => 'Tech Talk: AI in Education',
                'description' => 'Industry experts shared insights on artificial intelligence applications in modern education.',
                'type' => 'program',
                'icon' => '🤖',
                'achieved_date' => now()->subDays(10),
                'is_featured' => false,
            ],
            [
                'title' => 'Dean\'s List Recognition',
                'description' => '45 CICT students made it to the Dean\'s List for outstanding academic performance.',
                'type' => 'recognition',
                'icon' => '📚',
                'achieved_date' => now()->subDays(60),
                'is_featured' => false,
            ],
            [
                'title' => 'Community Outreach: IT Literacy',
                'description' => 'CICT students taught basic computer skills to senior citizens in Barangay San Jose.',
                'type' => 'program',
                'icon' => '🤝',
                'achieved_date' => now()->subDays(25),
                'is_featured' => false,
            ],
        ];

        foreach ($achievements as $index => $data) {
            Achievement::create([
                ...$data,
                'academic_year_id' => $currentYear?->id,
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }

        $this->command->info('Seeded ' . count($achievements) . ' achievements.');
    }
}
