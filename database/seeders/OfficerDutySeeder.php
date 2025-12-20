<?php

namespace Database\Seeders;

use App\Models\Officer;
use App\Models\OfficerDuty;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;

/**
 * OfficerDutySeeder
 * 
 * Seeds sample duty schedules for the weekly schedule display.
 */
class OfficerDutySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = AcademicYear::getCurrentYear();
        
        if (!$currentYear) {
            $this->command->error('No current academic year found. Run OfficerSeeder first.');
            return;
        }

        $officers = Officer::active()->forYear($currentYear->id)->get();
        
        if ($officers->isEmpty()) {
            $this->command->error('No officers found. Run OfficerSeeder first.');
            return;
        }

        // Create duty schedule (Monday-Friday)
        $duties = [
            // Monday
            [
                'day_of_week' => 0,
                'start_time' => '08:00',
                'end_time' => '12:00',
                'officer_name' => 'Juan Dela Cruz', // President
                'location' => 'SC Office',
            ],
            [
                'day_of_week' => 0,
                'start_time' => '13:00',
                'end_time' => '17:00',
                'officer_name' => 'Maria Garcia', // VP
                'location' => 'SC Office',
            ],
            
            // Tuesday
            [
                'day_of_week' => 1,
                'start_time' => '08:00',
                'end_time' => '12:00',
                'officer_name' => 'Ana Reyes', // Secretary
                'location' => 'SC Office',
            ],
            [
                'day_of_week' => 1,
                'start_time' => '13:00',
                'end_time' => '17:00',
                'officer_name' => 'Pedro Santos', // Treasurer
                'location' => 'SC Office',
            ],
            
            // Wednesday
            [
                'day_of_week' => 2,
                'start_time' => '08:00',
                'end_time' => '12:00',
                'officer_name' => 'Lisa Fernandez', // Auditor
                'location' => 'SC Office',
            ],
            [
                'day_of_week' => 2,
                'start_time' => '13:00',
                'end_time' => '17:00',
                'officer_name' => 'Mark Rodriguez', // PIO
                'location' => 'SC Office',
            ],
            
            // Thursday
            [
                'day_of_week' => 3,
                'start_time' => '08:00',
                'end_time' => '12:00',
                'officer_name' => 'Joy Mendoza', // Business Manager
                'location' => 'SC Office',
            ],
            [
                'day_of_week' => 3,
                'start_time' => '13:00',
                'end_time' => '17:00',
                'officer_name' => 'Carlo Martinez', // BSIT Rep
                'location' => 'SC Office',
            ],
            
            // Friday
            [
                'day_of_week' => 4,
                'start_time' => '08:00',
                'end_time' => '12:00',
                'officer_name' => 'Sophia Cruz', // BSCS Rep
                'location' => 'SC Office',
            ],
            [
                'day_of_week' => 4,
                'start_time' => '13:00',
                'end_time' => '17:00',
                'officer_name' => 'Juan Dela Cruz', // President (Friday PM)
                'location' => 'SC Office',
            ],
        ];

        foreach ($duties as $dutyData) {
            $officer = $officers->firstWhere('name', $dutyData['officer_name']);
            
            if ($officer) {
                OfficerDuty::create([
                    'day_of_week' => $dutyData['day_of_week'],
                    'start_time' => $dutyData['start_time'],
                    'end_time' => $dutyData['end_time'],
                    'officer_id' => $officer->id,
                    'academic_year_id' => $currentYear->id,
                    'location' => $dutyData['location'],
                    'is_active' => true,
                ]);
            }
        }

        $this->command->info('Seeded ' . count($duties) . ' duty slots for ' . $currentYear->label);
    }
}
