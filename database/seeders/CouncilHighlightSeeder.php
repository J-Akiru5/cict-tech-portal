<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\CouncilHighlight;
use Illuminate\Database\Seeder;

/**
 * CouncilHighlightSeeder
 * 
 * Seeds sample accomplishments for each council term.
 * Uses existing academic years in the database.
 */
class CouncilHighlightSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing academic years by year_start
        $ay2024 = AcademicYear::where('year_start', 2024)->first();
        $ay2023 = AcademicYear::where('year_start', 2023)->first();

        // 2024-2025 Term (Current)
        if ($ay2024) {
            $this->seedHighlights($ay2024->id, '2024-2025', 'Digital Transformation', [
                [
                    'type' => 'milestone',
                    'title' => 'CICT Tech Portal Launch',
                    'description' => 'Launched the official digital platform connecting students with announcements, events, and campus resources.',
                    'icon' => 'rocket-launch',
                    'display_order' => 1,
                    'is_featured' => true,
                    'accent_color' => 'gold',
                ],
                [
                    'type' => 'initiative',
                    'title' => 'AI-Powered Student Assistant',
                    'description' => 'Integrated an AI chatbot to help students navigate campus resources and provide 24/7 support.',
                    'icon' => 'cpu-chip',
                    'display_order' => 2,
                    'is_featured' => true,
                    'accent_color' => 'cyan',
                ],
                [
                    'type' => 'event',
                    'title' => 'IT Week 2024',
                    'description' => 'Annual celebration featuring coding competitions, tech talks, and industry networking.',
                    'icon' => 'calendar-days',
                    'display_order' => 3,
                    'is_featured' => false,
                    'accent_color' => 'magenta',
                ],
            ]);
        }

        // 2023-2024 Term
        if ($ay2023) {
            $this->seedHighlights($ay2023->id, '2023-2024', 'Building Bridges', [
                [
                    'type' => 'accomplishment',
                    'title' => 'Council Digitalization Initiative',
                    'description' => 'Began digital transformation of student council operations, laying groundwork for Tech Portal.',
                    'icon' => 'document-chart-bar',
                    'display_order' => 1,
                    'is_featured' => true,
                    'accent_color' => 'gold',
                ],
                [
                    'type' => 'event',
                    'title' => 'First Hybrid IT Week',
                    'description' => 'Successfully organized hybrid IT Week with online and physical activities.',
                    'icon' => 'globe-alt',
                    'display_order' => 2,
                    'is_featured' => true,
                    'accent_color' => 'cyan',
                ],
                [
                    'type' => 'initiative',
                    'title' => 'Peer Tutoring Program',
                    'description' => 'Launched student-to-student tutoring for programming courses.',
                    'icon' => 'academic-cap',
                    'display_order' => 3,
                    'is_featured' => false,
                    'accent_color' => 'green',
                ],
                [
                    'type' => 'accomplishment',
                    'title' => 'Industry Partnership',
                    'description' => 'Established partnerships with local tech companies for internships.',
                    'icon' => 'building-office',
                    'display_order' => 4,
                    'is_featured' => false,
                    'accent_color' => 'purple',
                ],
            ]);
        }

        $this->command->info('Council highlights seeded successfully!');
    }

    private function seedHighlights(int $academicYearId, string $termLabel, string $theme, array $highlights): void
    {
        foreach ($highlights as $highlight) {
            CouncilHighlight::updateOrCreate(
                ['academic_year_id' => $academicYearId, 'title' => $highlight['title']],
                array_merge($highlight, [
                    'academic_year_id' => $academicYearId,
                    'term_label' => $termLabel,
                    'theme' => $theme,
                ])
            );
        }
    }
}
