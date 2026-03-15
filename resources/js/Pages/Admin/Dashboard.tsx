import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';
import {
    UsersIcon,
    UserGroupIcon,
    MegaphoneIcon,
    CalendarDaysIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

interface Activity {
    id: number;
    description: string;
    causer: { name: string } | null;
    created_at: string;
}

interface Props {
    stats: {
        total_users: number;
        total_officers: number;
        total_announcements: number;
        active_academic_year: string;
        pending_payments: number;
        enrolled_students: number;
    };
    userGrowth?: { month: string; users: number }[];
    enrollmentByProgram?: { program: string; count: number }[];
    enrollmentByYearLevel?: { year_level: string; count: number }[];
    paymentStatus?: { status: string; count: number }[];
    eventStats?: {
        total: number;
        upcoming: number;
        completed: number;
        by_type: { type: string; count: number }[];
        avg_attendance: number;
    };
    dutyStats?: {
        total_duties: number;
        attendance: { status: string; count: number }[];
    };
    recentActivity?: Activity[];
}

const COLORS = ['#D4AF37', '#FFD700', '#B8860B', '#DAA520', '#F4C430', '#CD853F'];

export default function AdminDashboard({
    stats,
    userGrowth = [],
    enrollmentByProgram = [],
    enrollmentByYearLevel = [],
    paymentStatus = [],
    eventStats = { total: 0, upcoming: 0, completed: 0, by_type: [], avg_attendance: 0 },
    dutyStats = { total_duties: 0, attendance: [] },
    recentActivity = [],
}: Props) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.total_users,
            icon: UsersIcon,
            change: '+12%',
            changeType: 'positive' as const,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Officers',
            value: stats.total_officers,
            icon: UserGroupIcon,
            change: null,
            changeType: 'neutral' as const,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Events',
            value: eventStats.total,
            icon: CalendarDaysIcon,
            change: eventStats.upcoming > 0 ? `${eventStats.upcoming} upcoming` : null,
            changeType: 'positive' as const,
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            title: 'Announcements',
            value: stats.total_announcements,
            icon: MegaphoneIcon,
            change: null,
            changeType: 'neutral' as const,
            color: 'from-orange-500 to-orange-600',
        },
        {
            title: 'Enrolled',
            value: stats.enrolled_students || 0,
            icon: UsersIcon,
            change: stats.pending_payments ? `${stats.pending_payments} pending` : null,
            changeType: 'warning' as const,
            color: 'from-gold-500 to-gold-600',
        },
        {
            title: 'Avg. Attendance',
            value: eventStats.avg_attendance,
            icon: ArrowTrendingUpIcon,
            change: 'per event',
            changeType: 'neutral' as const,
            color: 'from-cyan-500 to-cyan-600',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-white/60 mt-1">Welcome back! Here's what's happening.</p>
                </div>

                {/* Stats Grid - 6 cards in 3x2 or responsive */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
                    {statCards.map((stat) => (
                        <div
                            key={stat.title}
                            className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-white/50 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
                                    {stat.change && (
                                        <div className={`flex items-center gap-1 mt-2 text-xs ${stat.changeType === 'positive' ? 'text-green-400' :
                                                stat.changeType === 'warning' ? 'text-yellow-400' :
                                                    'text-white/40'
                                            }`}>
                                            {stat.changeType === 'positive' && <ArrowTrendingUpIcon className="h-3 w-3" />}
                                            <span>{stat.change}</span>
                                        </div>
                                    )}
                                </div>
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Academic Year Banner */}
                <div className="mb-8 rounded-xl border border-gold-500/30 bg-gradient-to-r from-gold-500/10 to-transparent p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gold-400/80 uppercase tracking-wider font-medium">Current Academic Year</p>
                            <p className="text-2xl font-bold text-white mt-1">{stats.active_academic_year}</p>
                        </div>
                        <Link
                            href={route('admin.academic-years.index')}
                            className="px-4 py-2 rounded-lg bg-gold-500/20 text-gold-400 text-sm font-medium hover:bg-gold-500/30 transition-colors"
                        >
                            Manage Years
                        </Link>
                    </div>
                </div>

                {/* Charts Grid - Row 1: User Growth & Enrollment by Program */}
                <div className="grid gap-6 lg:grid-cols-2 mb-8">
                    {/* User Growth Chart */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4">User Growth (Last 6 Months)</h3>
                        {userGrowth.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={userGrowth}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(30,30,30,0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#D4AF37"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-white/40">
                                No data available
                            </div>
                        )}
                    </div>

                    {/* Enrollment by Program */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4">Enrollment by Program</h3>
                        {enrollmentByProgram.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={enrollmentByProgram} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                    <YAxis dataKey="program" type="category" stroke="rgba(255,255,255,0.4)" fontSize={12} width={60} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(30,30,30,0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-white/40">
                                No enrollment data
                            </div>
                        )}
                    </div>
                </div>

                {/* Charts Grid - Row 2: Year Level & Events by Type */}
                <div className="grid gap-6 lg:grid-cols-2 mb-8">
                    {/* Enrollment by Year Level */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4">Students by Year Level</h3>
                        {enrollmentByYearLevel.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={enrollmentByYearLevel}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="year_level" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(30,30,30,0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-white/40">
                                No year level data
                            </div>
                        )}
                    </div>

                    {/* Events by Type */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4">Events by Type</h3>
                        {eventStats.by_type.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={eventStats.by_type}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="count"
                                            nameKey="type"
                                        >
                                            {eventStats.by_type.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(30,30,30,0.9)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                color: '#fff',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap justify-center gap-3 mt-2">
                                    {eventStats.by_type.map((item, index) => (
                                        <div key={item.type} className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-xs text-white/60">{item.type} ({item.count})</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-white/40">
                                No event data
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Payment Status */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4">Payment Status</h3>
                        {paymentStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={paymentStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {paymentStatus.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(30,30,30,0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-white/40">
                                No payment data
                            </div>
                        )}
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {paymentStatus.map((item, index) => (
                                <div key={item.status} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-xs text-white/60">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                            <Link
                                href="/admin/audit-logs"
                                className="text-sm text-gold-400 hover:text-gold-300"
                            >
                                View all
                            </Link>
                        </div>
                        {recentActivity.length > 0 ? (
                            <div className="space-y-3">
                                {recentActivity.slice(0, 5).map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                                    >
                                        <div className="p-2 rounded-lg bg-white/10">
                                            <ClockIcon className="h-4 w-4 text-white/40" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{activity.description}</p>
                                            <p className="text-xs text-white/40 mt-1">
                                                {activity.causer?.name || 'System'} • {new Date(activity.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-white/40">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
