<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * RoleSeeder - Creates the 7 user roles for the CICT IT Tech Portal
 * 
 * Role Hierarchy:
 * 1. Main Administrator - Full system access
 * 2. College Dean - Oversight and approval
 * 3. SC Adviser (Faculty) - Advisory and moderation
 * 4. SC President - Near-admin access for SC operations
 * 5. SC Officers - Position-specific access
 * 6. Students - Basic portal access
 * 7. Public - Guest access (landing page only)
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            // User Management
            'manage-users',
            'create-users',
            'edit-users',
            'delete-users',
            'view-users',
            
            // Role Management
            'manage-roles',
            'assign-roles',
            
            // System Configuration
            'manage-system',
            'manage-academic-years',
            'manage-programs',
            
            // Announcements
            'create-announcements',
            'edit-announcements',
            'delete-announcements',
            'view-announcements',
            
            // Events & Attendance
            'manage-events',
            'create-events',
            'edit-events',
            'delete-events',
            'view-events',
            'record-attendance',
            'view-attendance',
            'view-own-attendance',
            
            // Officer Duties
            'manage-officer-duties',
            'submit-duty-excuse',
            'approve-duty-excuse',
            'manage-fines',
            
            // Org Chart
            'manage-org-chart',
            'view-org-chart',
            
            // Financial Records (Treasurer)
            'manage-finances',
            'view-finances',
            'record-payments',
            'generate-financial-reports',
            
            // Secretary Notes
            'manage-secretary-notes',
            'view-secretary-notes',
            
            // President Section
            'manage-president-section',
            'view-president-section',
            
            // Student Features
            'submit-feedback',
            'view-own-feedback',
            
            // Reports
            'generate-reports',
            'view-reports',
            
            // CBL
            'manage-cbl',
            'view-cbl',
            
            // AI Features
            'use-ai-assistant',
            'generate-ai-reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Roles and Assign Permissions
        
        // 1. Main Administrator - Full Access
        $mainAdmin = Role::create(['name' => 'main-admin']);
        $mainAdmin->givePermissionTo(Permission::all());

        // 2. College Dean - Oversight
        $dean = Role::create(['name' => 'dean']);
        $dean->givePermissionTo([
            'view-users',
            'view-announcements',
            'view-events',
            'view-attendance',
            'view-org-chart',
            'view-finances',
            'view-secretary-notes',
            'view-president-section',
            'view-reports',
            'view-cbl',
            'use-ai-assistant',
        ]);

        // 3. SC Adviser (Faculty) - Advisory + Approval
        $adviser = Role::create(['name' => 'sc-adviser']);
        $adviser->givePermissionTo([
            'view-users',
            'view-announcements',
            'edit-announcements',
            'view-events',
            'view-attendance',
            'approve-duty-excuse',
            'view-org-chart',
            'view-finances',
            'view-secretary-notes',
            'view-president-section',
            'view-reports',
            'view-cbl',
            'use-ai-assistant',
        ]);

        // 4. SC President - Near-Admin for SC Operations
        $president = Role::create(['name' => 'sc-president']);
        $president->givePermissionTo([
            'view-users',
            'create-announcements',
            'edit-announcements',
            'delete-announcements',
            'view-announcements',
            'manage-events',
            'create-events',
            'edit-events',
            'delete-events',
            'view-events',
            'record-attendance',
            'view-attendance',
            'manage-officer-duties',
            'approve-duty-excuse',
            'manage-fines',
            'view-org-chart',
            'view-finances',
            'view-secretary-notes',
            'manage-president-section',
            'view-president-section',
            'generate-reports',
            'view-reports',
            'view-cbl',
            'use-ai-assistant',
            'generate-ai-reports',
        ]);

        // 5. SC Officers - Position-Specific
        $officer = Role::create(['name' => 'sc-officer']);
        $officer->givePermissionTo([
            'view-announcements',
            'view-events',
            'record-attendance',
            'view-attendance',
            'submit-duty-excuse',
            'view-org-chart',
            'view-cbl',
            'use-ai-assistant',
        ]);

        // 5a. Secretary - Special Officer Role
        $secretary = Role::create(['name' => 'sc-secretary']);
        $secretary->givePermissionTo([
            'view-announcements',
            'create-announcements',
            'view-events',
            'record-attendance',
            'view-attendance',
            'submit-duty-excuse',
            'view-org-chart',
            'manage-secretary-notes',
            'view-secretary-notes',
            'view-cbl',
            'use-ai-assistant',
            'generate-reports',
        ]);

        // 5b. Treasurer - Special Officer Role
        $treasurer = Role::create(['name' => 'sc-treasurer']);
        $treasurer->givePermissionTo([
            'view-announcements',
            'view-events',
            'record-attendance',
            'view-attendance',
            'submit-duty-excuse',
            'view-org-chart',
            'manage-finances',
            'view-finances',
            'record-payments',
            'generate-financial-reports',
            'view-cbl',
            'use-ai-assistant',
            'generate-ai-reports',
        ]);

        // 6. Students - Basic Access
        $student = Role::create(['name' => 'student']);
        $student->givePermissionTo([
            'view-announcements',
            'view-events',
            'view-own-attendance',
            'view-org-chart',
            'submit-feedback',
            'view-own-feedback',
            'view-cbl',
            'use-ai-assistant',
        ]);

        // 7. Public - No permissions (guest access is handled by routes)
        Role::create(['name' => 'public']);
    }
}
