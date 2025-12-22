<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * RoleController
 * 
 * Handles role and permission management.
 */
class RoleController extends Controller
{
    /**
     * Display all roles with permissions.
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')
            ->orderBy('name')
            ->get()
            ->map(fn($role) => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
                'users_count' => $role->users()->count(),
                'guard_name' => $role->guard_name,
            ]);

        $permissions = Permission::orderBy('name')
            ->get()
            ->pluck('name');

        // Group permissions by category
        $permissionGroups = $permissions->groupBy(function ($permission) {
            $parts = explode(' ', $permission);
            return $parts[1] ?? $parts[0]; // e.g., "view announcements" -> "announcements"
        });

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'permissionGroups' => $permissionGroups,
        ]);
    }

    /**
     * Show form to create a new role.
     */
    public function create(): Response
    {
        $permissions = Permission::orderBy('name')
            ->get()
            ->pluck('name');

        return Inertia::render('Admin/Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a new role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role = Role::create(['name' => $validated['name']]);
        
        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        activity()
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->withProperties(['permissions' => $validated['permissions'] ?? []])
            ->log('Created role: ' . $role->name);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Show form to edit a role.
     */
    public function edit(Role $role): Response
    {
        $permissions = Permission::orderBy('name')
            ->get()
            ->pluck('name');

        $rolePermissions = $role->permissions->pluck('name');

        return Inertia::render('Admin/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $rolePermissions,
            ],
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update a role.
     */
    public function update(Request $request, Role $role)
    {
        // Protect system roles from name change
        $systemRoles = ['main-admin', 'student', 'public'];
        $isSystemRole = in_array($role->name, $systemRoles);

        $rules = [
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];

        if (!$isSystemRole) {
            $rules['name'] = ['required', 'string', 'max:255', 'unique:roles,name,' . $role->id];
        }

        $validated = $request->validate($rules);

        if (!$isSystemRole && isset($validated['name'])) {
            $role->name = $validated['name'];
            $role->save();
        }

        $role->syncPermissions($validated['permissions'] ?? []);

        activity()
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->withProperties(['permissions' => $validated['permissions'] ?? []])
            ->log('Updated role: ' . $role->name);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Delete a role.
     */
    public function destroy(Role $role)
    {
        // Prevent deletion of system roles
        $systemRoles = ['main-admin', 'student', 'public', 'sc-president', 'sc-officer', 'sc-secretary', 'sc-treasurer', 'sc-adviser', 'dean'];
        
        if (in_array($role->name, $systemRoles)) {
            return redirect()->route('admin.roles.index')
                ->with('error', 'Cannot delete system roles.');
        }

        // Check if role has users
        if ($role->users()->count() > 0) {
            return redirect()->route('admin.roles.index')
                ->with('error', 'Cannot delete role with assigned users.');
        }

        activity()
            ->causedBy(auth()->user())
            ->log('Deleted role: ' . $role->name);

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    /**
     * Create a new permission.
     */
    public function storePermission(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
        ]);

        Permission::create(['name' => $validated['name']]);

        activity()
            ->causedBy(auth()->user())
            ->log('Created permission: ' . $validated['name']);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Permission created successfully.');
    }
}
