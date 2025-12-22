import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Role {
    id: number;
    name: string;
    permissions: string[];
}

interface Props {
    role: Role;
    permissions: string[];
}

export default function EditRole({ role, permissions }: Props) {
    const systemRoles = ['main-admin', 'student', 'public'];
    const isSystemRole = systemRoles.includes(role.name);

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
    };

    const togglePermission = (permission: string) => {
        setData('permissions', 
            data.permissions.includes(permission)
                ? data.permissions.filter(p => p !== permission)
                : [...data.permissions, permission]
        );
    };

    const toggleAll = (checked: boolean) => {
        setData('permissions', checked ? [...permissions] : []);
    };

    // Group permissions by category
    const groupedPermissions = permissions.reduce((groups, permission) => {
        const parts = permission.split(' ');
        const category = parts[1] || parts[0];
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(permission);
        return groups;
    }, {} as Record<string, string[]>);

    return (
        <AdminLayout>
            <Head title={`Edit Role - ${role.name}`} />
            
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={route('admin.roles.index')}
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Roles
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Edit Role</h1>
                    <p className="text-white/60">Modify role permissions</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="max-w-4xl">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm mb-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Role Details</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Role Name
                            </label>
                            {isSystemRole ? (
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium">
                                        {role.name}
                                    </span>
                                    <span className="text-xs text-yellow-400">System role - name cannot be changed</span>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full max-w-md rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                        placeholder="e.g., content-manager"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Permissions</h2>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.permissions.length === permissions.length}
                                    onChange={(e) => toggleAll(e.target.checked)}
                                    className="rounded border-white/30 bg-white/10 text-gold-500 focus:ring-gold-500/50"
                                />
                                <span className="text-sm text-white/60">Select All</span>
                            </label>
                        </div>

                        <div className="space-y-6">
                            {Object.entries(groupedPermissions).map(([category, perms]) => (
                                <div key={category}>
                                    <h3 className="text-sm font-medium text-gold-400 uppercase tracking-wider mb-3">
                                        {category}
                                    </h3>
                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {perms.map((permission) => (
                                            <label
                                                key={permission}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                    data.permissions.includes(permission)
                                                        ? 'bg-gold-500/10 border-gold-500/30'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.permissions.includes(permission)}
                                                    onChange={() => togglePermission(permission)}
                                                    className="rounded border-white/30 bg-white/10 text-gold-500 focus:ring-gold-500/50"
                                                />
                                                <span className="text-sm text-white/80">{permission}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-sm text-white/50">
                            {data.permissions.length} of {permissions.length} permissions selected
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href={route('admin.roles.index')}
                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-gold-500 px-6 py-2 font-semibold text-maroon-900 hover:bg-gold-400 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
