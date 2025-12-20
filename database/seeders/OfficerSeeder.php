<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Officer;
use Illuminate\Database\Seeder;

/**
 * OfficerSeeder
 * 
 * Seeds sample officers for the organizational chart.
 */
class OfficerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create current academic year
        $currentYear = AcademicYear::create([
            'year_start' => '2024',
            'year_end' => '2025',
            'label' => 'A.Y. 2024-2025',
            'semester' => 'full',
            'is_current' => true,
        ]);

        // Create previous year for testing filter
        AcademicYear::create([
            'year_start' => '2023',
            'year_end' => '2024',
            'label' => 'A.Y. 2023-2024',
            'semester' => 'full',
            'is_current' => false,
        ]);

        // Officer positions for current year
        $officers = [
            // Level 0: Adviser/Dean
            [
                'name' => 'Dr. Maria Santos',
                'position' => 'SC Adviser',
                'position_short' => 'Adviser',
                'hierarchy_level' => 0,
                'sort_order' => 1,
                'course' => 'Ph.D. Computer Science',
                'motto' => 'Education is the key to success.',
            ],
            
            // Level 1: Executive Officers
            [
                'name' => 'Juan Dela Cruz',
                'position' => 'President',
                'position_short' => 'Pres',
                'hierarchy_level' => 1,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '4th Year',
                'motto' => 'Lead by example.',
            ],
            [
                'name' => 'Maria Garcia',
                'position' => 'Vice President',
                'position_short' => 'VP',
                'hierarchy_level' => 1,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '3rd Year',
                'motto' => 'Together we achieve more.',
            ],
            
            // Level 2: Secretary & Treasurer
            [
                'name' => 'Ana Reyes',
                'position' => 'Secretary',
                'position_short' => 'Sec',
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
                'hierarchy_level' => 2,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '4th Year',
                'motto' => 'Every peso counts.',
            ],
            
            // Level 3: Auditor, PIO, etc.
            [
                'name' => 'Lisa Fernandez',
                'position' => 'Auditor',
                'position_short' => 'Aud',
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
                'hierarchy_level' => 3,
                'sort_order' => 3,
                'course' => 'BSCS',
                'year_level' => '3rd Year',
                'motto' => 'Opportunities await those who prepare.',
            ],
            
            // Level 4: Representatives
            [
                'name' => 'Carlo Martinez',
                'position' => 'BSIT Representative',
                'position_short' => 'BSIT Rep',
                'hierarchy_level' => 4,
                'sort_order' => 1,
                'course' => 'BSIT',
                'year_level' => '2nd Year',
                'motto' => 'Voice of the students.',
            ],
            [
                'name' => 'Sophia Cruz',
                'position' => 'BSCS Representative',
                'position_short' => 'BSCS Rep',
                'hierarchy_level' => 4,
                'sort_order' => 2,
                'course' => 'BSCS',
                'year_level' => '2nd Year',
                'motto' => 'Every voice matters.',
            ],
        ];

        foreach ($officers as $data) {
            Officer::create([
                ...$data,
                'academic_year_id' => $currentYear->id,
                'is_active' => true,
            ]);
        }

        $this->command->info('Seeded ' . count($officers) . ' officers for ' . $currentYear->label);
    }
}
