<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * RoleSeeder
 * 
 * Seeds roles, permissions, and demo users for testing.
 */
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Announcements
            'view announcements',
            'create announcements',
            'edit announcements',
            'delete announcements',
            'publish announcements',
            
            // Officers
            'view officers',
            'manage officers',
            
            // Schedule
            'view schedule',
            'manage schedule',
            
            // Users
            'view users',
            'manage users',
            'manage roles',
            
            // Reports
            'view reports',
            'create reports',
            
            // Admin
            'access admin panel',
            'manage system settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles with permissions
        $rolePermissions = [
            'main-admin' => $permissions, // All permissions
            
            'dean' => [
                'view announcements', 'view officers', 'view schedule',
                'view users', 'view reports', 'access admin panel',
            ],
            
            'sc-adviser' => [
                'view announcements', 'create announcements', 'edit announcements',
                'view officers', 'manage officers', 'view schedule', 'manage schedule',
                'view users', 'view reports', 'create reports',
            ],
            
            'sc-president' => [
                'view announcements', 'create announcements', 'edit announcements', 'publish announcements',
                'view officers', 'manage officers', 'view schedule', 'manage schedule',
                'view users', 'view reports', 'create reports',
            ],
            
            'sc-secretary' => [
                'view announcements', 'create announcements', 'edit announcements',
                'view officers', 'view schedule', 'view reports', 'create reports',
            ],
            
            'sc-treasurer' => [
                'view announcements', 'view officers', 'view schedule',
                'view reports', 'create reports',
            ],
            
            'sc-officer' => [
                'view announcements', 'create announcements',
                'view officers', 'view schedule', 'view reports',
            ],
            
            'student' => [
                'view announcements', 'view officers', 'view schedule',
            ],
            
            'public' => [
                'view announcements',
            ],
        ];

        foreach ($rolePermissions as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($perms);
            $this->command->info("Created role: {$roleName} with " . count($perms) . " permissions");
        }

        // Create demo users
        $demoUsers = [
            [
                'name' => 'Main Administrator',
                'email' => 'admin@cict.edu',
                'password' => Hash::make('password'),
                'role' => 'main-admin',
            ],
            [
                'name' => 'SC Adviser',
                'email' => 'adviser@cict.edu',
                'password' => Hash::make('password'),
                'role' => 'sc-adviser',
            ],
            [
                'name' => 'SC President',
                'email' => 'president@cict.edu',
                'password' => Hash::make('password'),
                'role' => 'sc-president',
                'student_id' => '2024-00001',
                'course' => 'BSIT',
                'year_level' => '4th',
            ],
            [
                'name' => 'SC Secretary',
                'email' => 'secretary@cict.edu',
                'password' => Hash::make('password'),
                'role' => 'sc-secretary',
                'student_id' => '2024-00002',
                'course' => 'BSIT',
                'year_level' => '3rd',
            ],
            [
                'name' => 'SC Officer',
                'email' => 'officer@cict.edu',
                'password' => Hash::make('password'),
                'role' => 'sc-officer',
                'student_id' => '2024-00003',
                'course' => 'BSCS',
                'year_level' => '3rd',
            ],
            [
                'name' => 'Regular Student',
                'email' => 'student@cict.edu',
                'password' => Hash::make('password'),
                'role' => 'student',
                'student_id' => '2024-00100',
                'course' => 'BSIT',
                'year_level' => '2nd',
            ],
        ];

        foreach ($demoUsers as $userData) {
            $role = $userData['role'];
            unset($userData['role']);
            
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
            
            $user->syncRoles([$role]);
            $this->command->info("Created user: {$userData['email']} with role: {$role}");
        }

        $this->command->info("\n✅ Roles and demo users created successfully!");
        $this->command->info("Demo login credentials (password for all: 'password'):");
        $this->command->table(
            ['Email', 'Role'],
            collect($demoUsers)->map(fn($u) => [$u['email'], $u['role'] ?? 'N/A'])->toArray()
        );
    }
}
