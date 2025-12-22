import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        roles: string[];
    };
    allRoles: string[];
}

export default function EditUser({ user, allRoles }: Props) {
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        roles: user.roles,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    const toggleRole = (role: string) => {
        const newRoles = data.roles.includes(role)
            ? data.roles.filter(r => r !== role)
            : [...data.roles, role];
        setData('roles', newRoles);
    };

    const getRoleBadgeColor = (role: string, selected: boolean) => {
        if (!selected) return 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10';
        const colors: Record<string, string> = {
            'main-admin': 'bg-red-500/20 text-red-400 border-red-500/50',
            'sc-president': 'bg-gold-500/20 text-gold-400 border-gold-500/50',
            'sc-officer': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            'sc-secretary': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
            'sc-treasurer': 'bg-green-500/20 text-green-400 border-green-500/50',
            'student': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
        };
        return colors[role] || 'bg-gold-500/20 text-gold-400 border-gold-500/50';
    };

    return (
        <AdminLayout>
            <Head title={`Edit User - ${user.name}`} />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Users
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Edit User</h1>
                        <p className="text-white/60">Update user information and roles</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    placeholder="Enter full name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    placeholder="user@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                            </div>

                            {/* Password Reset Toggle */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordReset(!showPasswordReset)}
                                    className="text-sm text-gold-400 hover:text-gold-300"
                                >
                                    {showPasswordReset ? 'Cancel password change' : 'Change password'}
                                </button>
                            </div>

                            {/* Password Fields (Conditional) */}
                            {showPasswordReset && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                            placeholder="••••••••"
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Roles */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Assign Roles
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allRoles.map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => toggleRole(role)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${getRoleBadgeColor(role, data.roles.includes(role))}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                                {errors.roles && <p className="mt-1 text-sm text-red-400">{errors.roles}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex items-center justify-end gap-4">
                            <Link
                                href={route('admin.users.index')}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-gold-500 px-6 py-2 font-semibold text-maroon-900 transition-all hover:bg-gold-400 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
