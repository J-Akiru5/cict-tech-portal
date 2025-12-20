<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * EventSeeder
 * 
 * Seeds sample events for testing the event attendance system.
 */
class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicYear = AcademicYear::getCurrentYear();
        
        $events = [
            [
                'title' => 'CICT General Assembly 2024',
                'description' => 'Annual general assembly for all CICT students. Important announcements regarding the upcoming semester, introduction of new officers, and Q&A session with the administration.',
                'type' => 'meeting',
                'event_date' => now()->addDays(7)->format('Y-m-d'),
                'start_time' => '13:00:00',
                'end_time' => '17:00:00',
                'location' => 'CICT Auditorium',
                'requires_registration' => true,
                'max_attendees' => 200,
                'registration_deadline' => now()->addDays(5),
                'is_featured' => true,
            ],
            [
                'title' => 'Web Development Workshop',
                'description' => 'Learn modern web development with React and Laravel. Topics include: component-based architecture, state management, API integration, and deployment strategies.',
                'type' => 'workshop',
                'event_date' => now()->addDays(14)->format('Y-m-d'),
                'start_time' => '09:00:00',
                'end_time' => '16:00:00',
                'location' => 'Computer Lab 3',
                'requires_registration' => true,
                'max_attendees' => 30,
                'registration_deadline' => now()->addDays(12),
                'is_featured' => true,
            ],
            [
                'title' => 'Cybersecurity Seminar',
                'description' => 'Guest speaker from the industry discusses the latest trends in cybersecurity, ethical hacking, and career opportunities in information security.',
                'type' => 'seminar',
                'event_date' => now()->addDays(21)->format('Y-m-d'),
                'start_time' => '14:00:00',
                'end_time' => '17:00:00',
                'is_online' => true,
                'meeting_link' => 'https://meet.google.com/abc-defg-hij',
                'requires_registration' => true,
            ],
            [
                'title' => 'CICT Founding Anniversary',
                'description' => 'Celebrate the founding anniversary of CICT with games, performances, and special activities. Open to all students!',
                'type' => 'social',
                'event_date' => now()->addDays(30)->format('Y-m-d'),
                'start_time' => '08:00:00',
                'end_time' => '17:00:00',
                'location' => 'CICT Grounds',
                'requires_registration' => false,
                'is_featured' => true,
            ],
            [
                'title' => 'Programming Competition',
                'description' => 'Annual programming competition for CICT students. Test your coding skills against your peers! Prizes for top 3 winners.',
                'type' => 'competition',
                'event_date' => now()->addDays(45)->format('Y-m-d'),
                'start_time' => '09:00:00',
                'end_time' => '15:00:00',
                'location' => 'Computer Lab 1 & 2',
                'requires_registration' => true,
                'max_attendees' => 50,
                'registration_deadline' => now()->addDays(40),
            ],
            [
                'title' => 'Officers Meeting',
                'description' => 'Monthly meeting for all SC officers. Attendance is mandatory.',
                'type' => 'meeting',
                'event_date' => now()->addDays(3)->format('Y-m-d'),
                'start_time' => '16:00:00',
                'end_time' => '18:00:00',
                'location' => 'SC Office',
                'requires_registration' => false,
            ],
            [
                'title' => 'UI/UX Design Workshop',
                'description' => 'Learn the fundamentals of user interface and user experience design. Hands-on activities with Figma.',
                'type' => 'workshop',
                'event_date' => now()->addDays(10)->format('Y-m-d'),
                'start_time' => '13:00:00',
                'end_time' => '17:00:00',
                'location' => 'Computer Lab 4',
                'requires_registration' => true,
                'max_attendees' => 25,
                'registration_deadline' => now()->addDays(8),
            ],
            [
                'title' => 'Career Talk: Tech Industry',
                'description' => 'Alumni panel discussion about careers in the tech industry. Learn about job hunting, interview tips, and skill development.',
                'type' => 'seminar',
                'event_date' => now()->addDays(28)->format('Y-m-d'),
                'start_time' => '14:00:00',
                'end_time' => '16:00:00',
                'location' => 'CICT Auditorium',
                'requires_registration' => true,
            ],
        ];

        foreach ($events as $eventData) {
            $eventData['academic_year_id'] = $academicYear?->id;
            $eventData['slug'] = Str::slug($eventData['title']) . '-' . Str::random(5);
            
            Event::create($eventData);
        }

        $this->command->info("✅ Created " . count($events) . " sample events!");
    }
}
