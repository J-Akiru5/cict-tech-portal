<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Officer;
use App\Models\CouncilHighlight;
use Illuminate\Database\Seeder;

/**
 * AcademicYear2023Seeder
 * 
 * Seeds officers and highlights for the 2023-2024 academic year.
 * This provides historical data for the "IT Through the Years" feature.
 */
class AcademicYear2023Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create 2023-2024 academic year
        $year2023 = AcademicYear::firstOrCreate(
            ['year_start' => '2023', 'year_end' => '2024'],
            [
                'label' => 'A.Y. 2023-2024',
                'semester' => 'full',
                'is_current' => false,
                'theme' => 'Restructuring & Growth',
            ]
        );

        // Update theme if it exists
        $year2023->update(['theme' => 'Restructuring & Growth']);

        // Officers for 2023-2024 academic year
        $officers = [
            // === APPOINTED OFFICERS ===
            [
                'name' => 'Dr. Maria Santos',
                'position' => 'SC Adviser',
                'position_short' => 'Adviser',
                'position_type' => 'appointed',
                'position_category' => 'appointed',
                'hierarchy_level' => 0,
                'sort_order' => 1,
                'course' => 'Ph.D. Computer Science',
                'motto' => 'Education is the key to success.',
            ],
            [
                'name' => 'Dr. Roberto Cruz',
                'position' => 'Dean',
                'position_short' => 'Dean',
                'position_type' => 'appointed',
                'position_category' => 'appointed',
                'hierarchy_level' => 0,
                'sort_order' => 0,
                'course' => 'Ph.D. Information Technology',
                'motto' => 'Excellence in every endeavor.',
            ],
            
            // === EXECUTIVE OFFICERS ===
            [
                'name' => 'Ricardo Mendez',
                'position' => 'President',
                'position_short' => 'Pres',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 1,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '4th Year',
                'motto' => 'Service above self.',
                'photo' => 'officers/president-2023.jpg',
            ],
            [
                'name' => 'Christine Bautista',
                'position' => 'Executive Vice President',
                'position_short' => 'EVP',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 1,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '4th Year',
                'motto' => 'Unity makes strength.',
            ],
            [
                'name' => 'Grace Tan',
                'position' => 'Secretary',
                'position_short' => 'Sec',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 2,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'Organization is key.',
            ],
            [
                'name' => 'Miguel Ocampo',
                'position' => 'Treasurer',
                'position_short' => 'Tres',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 2,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '3rd Year',
                'motto' => 'Transparency in all things.',
            ],
            [
                'name' => 'Patricia Lim',
                'position' => 'Auditor',
                'position_short' => 'Aud',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 3,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'Integrity in every count.',
            ],
            [
                'name' => 'Jerome Navarro',
                'position' => 'Public Information Officer',
                'position_short' => 'PIO',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 3,
                'sort_order' => 2,
                'course' => 'BSIT',
                'year_level' => '2nd Year',
                'motto' => 'Your voice, amplified.',
            ],
            [
                'name' => 'Kristine Dela Rosa',
                'position' => 'Business Manager',
                'position_short' => 'BM',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 3,
                'sort_order' => 3,
                'course' => 'BSCS',
                'year_level' => '3rd Year',
                'motto' => 'Building partnerships.',
            ],
            
            // === DIRECTORS ===
            [
                'name' => 'Ryan Santos',
                'position' => 'Director for Communications',
                'position_short' => 'Comms Dir',
                'position_type' => 'appointed',
                'position_category' => 'director',
                'hierarchy_level' => 4,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'Reaching hearts and minds.',
            ],
            [
                'name' => 'Alyssa Francisco',
                'position' => 'Director for Creatives',
                'position_short' => 'Creative Dir',
                'position_type' => 'appointed',
                'position_category' => 'director',
                'hierarchy_level' => 4,
                'sort_order' => 2,
                'course' => 'BSIT',
                'year_level' => '2nd Year',
                'motto' => 'Creativity knows no bounds.',
            ],
            
            // === REPRESENTATIVES ===
            [
                'name' => 'Vincent Aquino',
                'position' => 'USC Representative',
                'position_short' => 'USC Rep',
                'position_type' => 'elected',
                'position_category' => 'special',
                'hierarchy_level' => 5,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'CICT at the university level.',
            ],
            [
                'name' => 'Andrea Reyes',
                'position' => 'BSIT Representative',
                'position_short' => 'BSIT Rep',
                'position_type' => 'elected',
                'position_category' => 'representative',
                'hierarchy_level' => 6,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '2nd Year',
                'motto' => 'For the BSIT community.',
            ],
            [
                'name' => 'Marco Villanueva',
                'position' => 'BSCS Representative',
                'position_short' => 'BSCS Rep',
                'position_type' => 'elected',
                'position_category' => 'representative',
                'hierarchy_level' => 6,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '2nd Year',
                'motto' => 'Your BSCS advocate.',
            ],
        ];

        foreach ($officers as $data) {
            Officer::updateOrCreate(
                [
                    'name' => $data['name'],
                    'academic_year_id' => $year2023->id,
                ],
                [
                    ...$data,
                    'academic_year_id' => $year2023->id,
                    'is_active' => false, // Past year officers are inactive
                ]
            );
        }

        // Council Highlights for 2023-2024
        $highlights = [
            [
                'title' => 'Constitution Amendments',
                'description' => 'Major revisions to the SC Constitution to modernize governance structures and adapt to post-pandemic realities.',
                'type' => 'initiative',
                'icon' => '📜',
                'is_featured' => true,
                'display_order' => 1,
            ],
            [
                'title' => 'First Full F2F General Assembly',
                'description' => 'Historic return to in-person general assemblies after years of hybrid and online formats.',
                'type' => 'event',
                'icon' => '🎤',
                'is_featured' => true,
                'display_order' => 2,
            ],
            [
                'title' => 'Skill Development Workshops',
                'description' => 'Series of technical workshops covering web development, mobile apps, and cybersecurity fundamentals.',
                'type' => 'event',
                'icon' => '🛠️',
                'is_featured' => true,
                'display_order' => 3,
            ],
            [
                'title' => 'IO Week 2023',
                'description' => 'Week-long celebration of IT education featuring tech talks, competitions, and industry partnerships.',
                'type' => 'event',
                'icon' => '🎉',
                'is_featured' => true,
                'display_order' => 4,
            ],
            [
                'title' => 'Student Council Restructuring',
                'description' => 'Implementation of new director positions and improved committee structures.',
                'type' => 'initiative',
                'icon' => '🏗️',
                'is_featured' => false,
                'display_order' => 5,
            ],
        ];

        foreach ($highlights as $data) {
            CouncilHighlight::updateOrCreate(
                [
                    'title' => $data['title'],
                    'academic_year_id' => $year2023->id,
                ],
                [
                    ...$data,
                    'academic_year_id' => $year2023->id,
                    'term_label' => '2023-2024',
                ]
            );
        }

        $this->command->info('Seeded ' . count($officers) . ' officers and ' . count($highlights) . ' highlights for ' . $year2023->label);
    }
}
