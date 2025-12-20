import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    user: {
        name: string;
        roles: string[];
        photo_url: string;
    };
    stats: {
        pending_announcements: number;
        upcoming_duties: number;
    };
}

export default function OfficerDashboard({ user, stats }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Officer Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                            <img 
                                src={user.photo_url}
                                alt={user.name}
                                className="h-14 w-14 rounded-full border-2 border-gold-500"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Officer Dashboard
                                </h1>
                                <p className="text-white/60">
                                    Welcome, {user.name} 
                                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-gold-500/20 px-2 py-0.5 text-xs text-gold-400">
                                        {user.roles.join(', ')}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <div className="text-3xl mb-2">📝</div>
                            <p className="text-2xl font-bold text-white">{stats.pending_announcements}</p>
                            <p className="text-sm text-white/50">Pending Announcements</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <div className="text-3xl mb-2">📅</div>
                            <p className="text-2xl font-bold text-white">{stats.upcoming_duties}</p>
                            <p className="text-sm text-white/50">Upcoming Duties</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <div className="text-3xl mb-2">💬</div>
                            <p className="text-2xl font-bold text-white">0</p>
                            <p className="text-sm text-white/50">New Feedback</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <div className="text-3xl mb-2">📊</div>
                            <p className="text-2xl font-bold text-white">--</p>
                            <p className="text-sm text-white/50">Reports Due</p>
                        </div>
                    </div>

                    {/* Officer Modules */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white mb-4">Officer Modules</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link
                                href={route('officer.secretary.index')}
                                className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <div className="text-3xl mb-2">📋</div>
                                <h3 className="font-medium text-white">Secretary</h3>
                                <p className="text-sm text-white/50 mt-1">Meeting notes & minutes</p>
                            </Link>
                            <Link
                                href={route('officer.treasurer.index')}
                                className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <div className="text-3xl mb-2">💰</div>
                                <h3 className="font-medium text-white">Treasurer</h3>
                                <p className="text-sm text-white/50 mt-1">Payment verification & fees</p>
                            </Link>
                            <Link
                                href={route('officer.attendance.index')}
                                className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <div className="text-3xl mb-2">✅</div>
                                <h3 className="font-medium text-white">Attendance</h3>
                                <p className="text-sm text-white/50 mt-1">Duty check-in & reports</p>
                            </Link>
                            <Link
                                href={route('manage.enrollment.index')}
                                className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <div className="text-3xl mb-2">📝</div>
                                <h3 className="font-medium text-white">Enrollment</h3>
                                <p className="text-sm text-white/50 mt-1">Manage enrollment & fees</p>
                            </Link>
                            <Link
                                href="/announcements"
                                className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-gold-500/30"
                            >
                                <div className="text-3xl mb-2">📢</div>
                                <h3 className="font-medium text-white">Announcements</h3>
                                <p className="text-sm text-white/50 mt-1">Create & manage posts</p>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-4">
                        <Link
                            href="/schedule"
                            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                        >
                            <span className="text-xl">📅</span>
                            <span className="text-sm text-white">Schedule</span>
                        </Link>
                        <Link
                            href="/org-chart"
                            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                        >
                            <span className="text-xl">👥</span>
                            <span className="text-sm text-white">Org Chart</span>
                        </Link>
                        <Link
                            href="/bulletin"
                            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                        >
                            <span className="text-xl">📰</span>
                            <span className="text-sm text-white">Bulletin</span>
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                        >
                            <span className="text-xl">⚙️</span>
                            <span className="text-sm text-white">Profile</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
