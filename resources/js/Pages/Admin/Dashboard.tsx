import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    stats: {
        total_users: number;
        total_officers: number;
        total_announcements: number;
        active_academic_year: string;
    };
}

export default function AdminDashboard({ stats }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-white/60">System overview and management</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <div className="text-3xl mb-2">👥</div>
                            <p className="text-3xl font-bold text-white">{stats.total_users}</p>
                            <p className="text-sm text-white/50">Total Users</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <div className="text-3xl mb-2">🎖️</div>
                            <p className="text-3xl font-bold text-white">{stats.total_officers}</p>
                            <p className="text-sm text-white/50">Officers</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <div className="text-3xl mb-2">📢</div>
                            <p className="text-3xl font-bold text-white">{stats.total_announcements}</p>
                            <p className="text-sm text-white/50">Announcements</p>
                        </div>
                        <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-6 backdrop-blur-sm">
                            <div className="text-3xl mb-2">📅</div>
                            <p className="text-lg font-bold text-gold-400">{stats.active_academic_year}</p>
                            <p className="text-sm text-white/50">Academic Year</p>
                        </div>
                    </div>

                    {/* Admin Modules */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white mb-4">Management Modules</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link
                                href="#"
                                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <span className="text-2xl">👤</span>
                                <span className="font-medium text-white">User Management</span>
                                <span className="text-sm text-white/50">Manage users and roles</span>
                            </Link>
                            <Link
                                href="#"
                                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <span className="text-2xl">📢</span>
                                <span className="font-medium text-white">Announcements</span>
                                <span className="text-sm text-white/50">Create and manage announcements</span>
                            </Link>
                            <Link
                                href="#"
                                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <span className="text-2xl">📊</span>
                                <span className="font-medium text-white">Academic Years</span>
                                <span className="text-sm text-white/50">Manage terms and officers</span>
                            </Link>
                            <Link
                                href="#"
                                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <span className="text-2xl">🏆</span>
                                <span className="font-medium text-white">Achievements</span>
                                <span className="text-sm text-white/50">Manage bulletin board</span>
                            </Link>
                            <Link
                                href="#"
                                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <span className="text-2xl">📅</span>
                                <span className="font-medium text-white">Duty Schedule</span>
                                <span className="text-sm text-white/50">Manage officer duties</span>
                            </Link>
                            <Link
                                href="#"
                                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <span className="text-2xl">⚙️</span>
                                <span className="font-medium text-white">Settings</span>
                                <span className="text-sm text-white/50">System configuration</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
