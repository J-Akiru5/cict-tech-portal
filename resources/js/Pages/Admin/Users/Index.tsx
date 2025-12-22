import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon,
    FunnelIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: { name: string }[];
}

interface Props {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    roles: string[];
    filters: {
        search?: string;
        role?: string;
    };
}

export default function UsersIndex({ users, roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search, role: roleFilter }, { preserveState: true });
    };

    const handleDelete = (userId: number) => {
        router.delete(route('admin.users.destroy', userId), {
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
            'student': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        return colors[role] || 'bg-white/10 text-white/60 border-white/20';
    };

    return (
        <AdminLayout>
            <Head title="User Management" />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">User Management</h1>
                            <p className="text-white/60">Manage users and their roles</p>
                        </div>
                        <Link
                            href={route('admin.users.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 font-semibold text-maroon-900 transition-all hover:bg-gold-400"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Add User
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 backdrop-blur-sm">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FunnelIcon className="h-5 w-5 text-white/40" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                >
                                    <option value="">All Roles</option>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
                            >
                                Filter
                            </button>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="border-b border-white/10 bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Roles</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Joined</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/80">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <UserCircleIcon className="h-10 w-10 text-white/40" />
                                                <span className="font-medium text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white/60">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role) => (
                                                    <span
                                                        key={role.name}
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(role.name)}`}
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white/60">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.users.edit', user.id)}
                                                    className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </Link>
                                                {deleteConfirm === user.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/20"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(user.id)}
                                                        className="rounded-lg p-2 text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="border-t border-white/10 px-6 py-4 flex justify-center gap-2">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-gold-500 text-maroon-900'
                                                : link.url
                                                ? 'text-white/60 hover:bg-white/10'
                                                : 'text-white/30 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
