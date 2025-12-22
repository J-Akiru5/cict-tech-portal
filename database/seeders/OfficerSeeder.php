<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Officer;
use Illuminate\Database\Seeder;

/**
 * OfficerSeeder
 * 
 * Seeds sample officers for the organizational chart.
 * Updated to use new position classification columns (position_type, position_category, section, class_year).
 */
class OfficerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or get current academic year
        $currentYear = AcademicYear::firstOrCreate(
            ['year_start' => '2024', 'year_end' => '2025'],
            [
                'label' => 'A.Y. 2024-2025',
                'semester' => 'full',
                'is_current' => true,
            ]
        );

        // Create previous year for testing filter
        AcademicYear::firstOrCreate(
            ['year_start' => '2023', 'year_end' => '2024'],
            [
                'label' => 'A.Y. 2023-2024',
                'semester' => 'full',
                'is_current' => false,
            ]
        );

        // Officer positions for current year with new classification structure
        $officers = [
            // === APPOINTED OFFICERS (Level 0) ===
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
            
            // === ELECTED EXECUTIVE OFFICERS (Level 1) ===
            [
                'name' => 'Juan Dela Cruz',
                'position' => 'President',
                'position_short' => 'Pres',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 1,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '4th Year',
                'motto' => 'Lead by example.',
                'photo' => 'officers/president-2024.jpg',
            ],
            [
                'name' => 'Maria Garcia',
                'position' => 'Executive Vice President',
                'position_short' => 'EVP',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 1,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '3rd Year',
                'motto' => 'Together we achieve more.',
            ],
            
            // === ELECTED OFFICERS (Level 2) - Secretary & Treasurer ===
            [
                'name' => 'Ana Reyes',
                'position' => 'Secretary',
                'position_short' => 'Sec',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 2,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'Details matter.',
            ],
            [
                'name' => 'Pedro Santos',
                'position' => 'Treasurer',
                'position_short' => 'Tres',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 2,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '4th Year',
                'motto' => 'Every peso counts.',
            ],
            
            // === ELECTED OFFICERS (Level 3) - Auditor, PIO, Business Manager ===
            [
                'name' => 'Lisa Fernandez',
                'position' => 'Auditor',
                'position_short' => 'Aud',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 3,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'Transparency builds trust.',
            ],
            [
                'name' => 'Mark Rodriguez',
                'position' => 'Public Information Officer',
                'position_short' => 'PIO',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 3,
                'sort_order' => 2,
                'course' => 'BSIT',
                'year_level' => '2nd Year',
                'motto' => 'Communication is key.',
            ],
            [
                'name' => 'Joy Mendoza',
                'position' => 'Business Manager',
                'position_short' => 'BM',
                'position_type' => 'elected',
                'position_category' => 'executive',
                'hierarchy_level' => 3,
                'sort_order' => 3,
                'course' => 'BSCS',
                'year_level' => '3rd Year',
                'motto' => 'Opportunities await those who prepare.',
            ],
            
            // === APPOINTED DIRECTORS (Level 4) ===
            [
                'name' => 'Patrick Lim',
                'position' => 'Director for Communications',
                'position_short' => 'Comms Dir',
                'position_type' => 'appointed',
                'position_category' => 'director',
                'hierarchy_level' => 4,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'Connecting minds, building bridges.',
            ],
            [
                'name' => 'Angela Torres',
                'position' => 'Director for Creatives',
                'position_short' => 'Creative Dir',
                'position_type' => 'appointed',
                'position_category' => 'director',
                'hierarchy_level' => 4,
                'sort_order' => 2,
                'course' => 'BSIT',
                'year_level' => '2nd Year',
                'motto' => 'Design with purpose.',
            ],
            [
                'name' => 'Kevin Ramos',
                'position' => 'Director for Technical',
                'position_short' => 'Tech Dir',
                'position_type' => 'appointed',
                'position_category' => 'director',
                'hierarchy_level' => 4,
                'sort_order' => 3,
                'course' => 'BSCS',
                'year_level' => '4th Year',
                'motto' => 'Code with passion.',
            ],
            [
                'name' => 'Michelle Aquino',
                'position' => 'Director for Documentation',
                'position_short' => 'Docs Dir',
                'position_type' => 'appointed',
                'position_category' => 'director',
                'hierarchy_level' => 4,
                'sort_order' => 4,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'Preserve every moment.',
            ],
            
            // === SPECIAL REPRESENTATIVES (Level 5) ===
            [
                'name' => 'Janine Santos',
                'position' => 'USC Representative',
                'position_short' => 'USC Rep',
                'position_type' => 'elected',
                'position_category' => 'special',
                'hierarchy_level' => 5,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '3rd Year',
                'motto' => 'Representing CICT at the university level.',
            ],
            
            // === COURSE REPRESENTATIVES (Level 6) ===
            [
                'name' => 'Carlo Martinez',
                'position' => 'BSIT Representative',
                'position_short' => 'BSIT Rep',
                'position_type' => 'elected',
                'position_category' => 'representative',
                'hierarchy_level' => 6,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '2nd Year',
                'motto' => 'Voice of BSIT students.',
            ],
            [
                'name' => 'Sophia Cruz',
                'position' => 'BSCS Representative',
                'position_short' => 'BSCS Rep',
                'position_type' => 'elected',
                'position_category' => 'representative',
                'hierarchy_level' => 6,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '2nd Year',
                'motto' => 'Every voice matters.',
            ],
            
            // === CLASS REPRESENTATIVES (Level 7) - Sample entries ===
            [
                'name' => 'Daniel Lee',
                'position' => '4th Year Section A Representative',
                'position_short' => '4A Rep',
                'position_type' => 'elected',
                'position_category' => 'class_rep',
                'class_year' => 4,
                'section' => 'A',
                'hierarchy_level' => 7,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '4th Year',
                'motto' => 'Leading Section A.',
            ],
            [
                'name' => 'Rica Villanueva',
                'position' => '3rd Year Section B Representative',
                'position_short' => '3B Rep',
                'position_type' => 'elected',
                'position_category' => 'class_rep',
                'class_year' => 3,
                'section' => 'B',
                'hierarchy_level' => 7,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '3rd Year',
                'motto' => 'Unity in Section B.',
            ],
        ];

        foreach ($officers as $data) {
            Officer::updateOrCreate(
                [
                    'name' => $data['name'],
                    'academic_year_id' => $currentYear->id,
                ],
                [
                    ...$data,
                    'academic_year_id' => $currentYear->id,
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('Seeded ' . count($officers) . ' officers for ' . $currentYear->label);
    }
}
