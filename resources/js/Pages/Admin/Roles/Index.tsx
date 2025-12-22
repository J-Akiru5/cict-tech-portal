import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import {
    ShieldCheckIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    UsersIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline';

interface Role {
    id: number;
    name: string;
    permissions: string[];
    users_count: number;
    guard_name: string;
}

interface Props {
    roles: Role[];
    permissions: string[];
    permissionGroups: Record<string, string[]>;
}

export default function RolesIndex({ roles, permissions, permissionGroups }: Props) {
    const [expandedRole, setExpandedRole] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const systemRoles = ['main-admin', 'student', 'public', 'sc-president', 'sc-officer', 'sc-secretary', 'sc-treasurer', 'sc-adviser', 'dean'];

    const handleDelete = (id: number) => {
        router.delete(route('admin.roles.destroy', id), {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            'main-admin': 'bg-red-500/20 text-red-400 border-red-500/30',
            'sc-president': 'bg-gold-500/20 text-gold-400 border-gold-500/30',
            'sc-officer': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'sc-secretary': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'sc-treasurer': 'bg-green-500/20 text-green-400 border-green-500/30',
            'sc-adviser': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'dean': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            'student': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        return colors[role] || 'bg-white/10 text-white/60 border-white/20';
    };

    return (
        <AdminLayout>
            <Head title="Roles & Permissions" />
            
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Roles & Permissions</h1>
                        <p className="text-white/60">Manage user roles and access levels</p>
                    </div>
                    <Link
                        href={route('admin.roles.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 font-semibold text-maroon-900 hover:bg-gold-400 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Create Role
                    </Link>
                </div>

                {/* Roles Grid */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {roles.map((role) => {
                        const isExpanded = expandedRole === role.id;
                        const isSystemRole = systemRoles.includes(role.name);

                        return (
                            <div
                                key={role.id}
                                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
                            >
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${getRoleBadgeColor(role.name)}`}>
                                                <ShieldCheckIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{role.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-white/50">
                                                    <UsersIcon className="h-4 w-4" />
                                                    <span>{role.users_count} users</span>
                                                    <span>•</span>
                                                    <span>{role.permissions.length} permissions</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route('admin.roles.edit', role.id)}
                                                className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </Link>
                                            {!isSystemRole && (
                                                <>
                                                    {deleteConfirm === role.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(role.id)}
                                                                className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="px-2 py-1 rounded text-xs bg-white/10 text-white/60 hover:bg-white/20"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(role.id)}
                                                            className="p-2 rounded-lg text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expand/Collapse Button */}
                                    <button
                                        onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                                        className="mt-3 w-full flex items-center justify-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUpIcon className="h-4 w-4" />
                                                Hide permissions
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDownIcon className="h-4 w-4" />
                                                Show permissions
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Permissions List */}
                                {isExpanded && (
                                    <div className="border-t border-white/10 p-4 bg-white/5">
                                        <div className="flex flex-wrap gap-2">
                                            {role.permissions.length > 0 ? (
                                                role.permissions.map((permission) => (
                                                    <span
                                                        key={permission}
                                                        className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70 border border-white/10"
                                                    >
                                                        {permission}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-white/40 text-sm">No permissions assigned</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Permission Matrix */}
                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <h2 className="text-lg font-semibold text-white mb-4">Permission Matrix</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Permission</th>
                                    {roles.map((role) => (
                                        <th key={role.id} className="px-4 py-3 text-center text-sm font-medium text-white/60">
                                            {role.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {permissions.slice(0, 15).map((permission) => (
                                    <tr key={permission} className="hover:bg-white/5">
                                        <td className="px-4 py-2 text-sm text-white/80">{permission}</td>
                                        {roles.map((role) => (
                                            <td key={role.id} className="px-4 py-2 text-center">
                                                {role.permissions.includes(permission) ? (
                                                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                                                ) : (
                                                    <span className="inline-block w-3 h-3 rounded-full bg-white/10"></span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {permissions.length > 15 && (
                            <p className="mt-4 text-center text-sm text-white/40">
                                Showing 15 of {permissions.length} permissions. Edit a role to see all.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
