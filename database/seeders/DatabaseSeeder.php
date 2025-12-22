<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Core seeders - order matters!
        $this->call([
            // 1. Roles and permissions first
            RolePermissionSeeder::class,
            
            // 2. Users (including test users with roles)
            UserSeeder::class,
            
            // 3. Academic years and officers
            OfficerSeeder::class,
            
            // 4. Historical data for 2023
            AcademicYear2023Seeder::class,
            
            // 5. Council highlights (depends on academic years)
            CouncilHighlightSeeder::class,
            
            // 6. Officer duties
            OfficerDutySeeder::class,
            
            // 7. Announcements
            AnnouncementSeeder::class,
            
            // 8. Achievement posts (depends on users, academic years, and council highlights)
            AchievementPostSeeder::class,
        ]);

        $this->command->info('All seeders completed successfully!');
    }
}
