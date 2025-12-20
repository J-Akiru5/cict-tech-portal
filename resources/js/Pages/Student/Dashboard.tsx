import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    published_at: string;
}

interface DutyOfficer {
    name: string;
    position: string;
    photo_url: string;
    time: string;
}

interface Props {
    user: {
        name: string;
        student_id: string | null;
        course: string | null;
        year_level: string | null;
        photo_url: string;
    };
    announcements: Announcement[];
    dutyOfficer: DutyOfficer | null;
}

export default function StudentDashboard({ user, announcements, dutyOfficer }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Student Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Welcome Header */}
                    <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
                        <img 
                            src={user.photo_url}
                            alt={user.name}
                            className="h-16 w-16 rounded-full border-2 border-gold-500/50"
                        />
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-white">
                                Welcome back, {user.name.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-white/60">
                                {user.student_id && `${user.student_id} • `}
                                {user.course} {user.year_level && `• ${user.year_level}`}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                                {[
                                    { label: 'Enrollment', icon: '📝', href: route('student.enrollment.index') },
                                    { label: 'Announcements', icon: '📢', href: '/announcements' },
                                    { label: 'Events', icon: '🎉', href: route('student.events.index') },
                                    { label: 'Schedule', icon: '📅', href: '/schedule' },
                                    { label: 'Org Chart', icon: '👥', href: '/org-chart' },
                                    { label: 'CBL', icon: '📖', href: '/cbl' },
                                ].map((action) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-gold-500/30"
                                    >
                                        <span className="text-2xl">{action.icon}</span>
                                        <span className="text-xs text-white/70">{action.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Latest Announcements */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-white">
                                        📢 Latest Announcements
                                    </h2>
                                    <Link href="/announcements" className="text-sm text-gold-400 hover:underline">
                                        View all
                                    </Link>
                                </div>
                                
                                {announcements.length === 0 ? (
                                    <p className="text-white/50 text-center py-8">No announcements yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {announcements.map((announcement) => (
                                            <Link
                                                key={announcement.id}
                                                href={`/announcements/${announcement.slug}`}
                                                className="block rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10"
                                            >
                                                <h3 className="font-medium text-white line-clamp-1">
                                                    {announcement.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-white/50 line-clamp-2">
                                                    {announcement.excerpt}
                                                </p>
                                                <p className="mt-2 text-xs text-white/30">
                                                    {new Date(announcement.published_at).toLocaleDateString()}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Duty Officer */}
                            <div className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
                                    🎯 Officer on Duty
                                </h3>
                                
                                {dutyOfficer ? (
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={dutyOfficer.photo_url}
                                            alt={dutyOfficer.name}
                                            className="h-12 w-12 rounded-full border border-gold-500/50"
                                        />
                                        <div>
                                            <p className="font-medium text-white">{dutyOfficer.name}</p>
                                            <p className="text-sm text-white/60">{dutyOfficer.position}</p>
                                            <p className="text-xs text-gold-400">{dutyOfficer.time}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white/50 text-sm">No officer on duty right now</p>
                                )}
                            </div>

                            {/* Quick Links */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
                                    Quick Links
                                </h3>
                                <div className="space-y-2">
                                    <Link href={route('student.feedback.index')} className="block text-sm text-white/70 hover:text-gold-400 transition-colors">
                                        → My Feedback
                                    </Link>
                                    <Link href="/profile" className="block text-sm text-white/70 hover:text-gold-400 transition-colors">
                                        → Edit Profile
                                    </Link>
                                    <Link href="/bulletin" className="block text-sm text-white/70 hover:text-gold-400 transition-colors">
                                        → Bulletin Board
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
