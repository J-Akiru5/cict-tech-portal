import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    EyeIcon,
    ClockIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

interface Activity {
    id: number;
    log_name: string | null;
    description: string;
    event: string | null;
    subject_type: string | null;
    subject_id: string | null;
    causer: { id: number; name: string; email: string } | null;
    created_at: string;
}

interface Props {
    activities: {
        data: Activity[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    eventTypes: string[];
    filters: {
        search?: string;
        event?: string;
        causer?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function AuditLogsIndex({ activities, eventTypes, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [event, setEvent] = useState(filters.event || '');
    const [causer, setCauser] = useState(filters.causer || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearDays, setClearDays] = useState(90);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.audit-logs.index'), {
            search,
            event,
            causer,
            date_from: dateFrom,
            date_to: dateTo,
        }, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = route('admin.audit-logs.export') + '?' + new URLSearchParams({
            date_from: dateFrom,
            date_to: dateTo,
        }).toString();
    };

    const handleClear = () => {
        router.delete(route('admin.audit-logs.clear'), {
            data: { days: clearDays },
            onSuccess: () => setShowClearModal(false),
        });
    };

    const getEventColor = (event: string | null) => {
        const colors: Record<string, string> = {
            'created': 'bg-green-500/20 text-green-400 border-green-500/30',
            'updated': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'deleted': 'bg-red-500/20 text-red-400 border-red-500/30',
            'login': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'logout': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        return colors[event || ''] || 'bg-white/10 text-white/60 border-white/20';
    };

    return (
        <AdminLayout>
            <Head title="Audit Logs" />
            
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
                        <p className="text-white/60">Track all system activity and changes</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition-colors"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            Export CSV
                        </button>
                        <button
                            onClick={() => setShowClearModal(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                            <TrashIcon className="h-5 w-5" />
                            Clear Old
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 backdrop-blur-sm">
                    <form onSubmit={handleFilter} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                            />
                        </div>
                        <div className="relative">
                            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <select
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                            >
                                <option value="">All Events</option>
                                {eventTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                            placeholder="From date"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                            placeholder="To date"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-gold-500 px-4 py-2 font-semibold text-maroon-900 hover:bg-gold-400 transition-colors"
                        >
                            Filter
                        </button>
                    </form>
                </div>

                {/* Stats */}
                <div className="mb-6 text-sm text-white/60">
                    Showing {activities.data.length} of {activities.total} log entries
                </div>

                {/* Activity List */}
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {activities.data.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-white/5">
                                    <ClockIcon className="h-5 w-5 text-white/40" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-white font-medium">{activity.description}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                {activity.event && (
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getEventColor(activity.event)}`}>
                                                        {activity.event}
                                                    </span>
                                                )}
                                                {activity.subject_type && (
                                                    <span className="text-xs text-white/40">
                                                        {activity.subject_type.split('\\').pop()}
                                                        {activity.subject_id && ` #${activity.subject_id}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            href={route('admin.audit-logs.show', activity.id)}
                                            className="p-2 rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-white/40">
                                        <div className="flex items-center gap-1">
                                            <UserCircleIcon className="h-4 w-4" />
                                            <span>{activity.causer?.name || 'System'}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{new Date(activity.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {activities.data.length === 0 && (
                        <div className="p-12 text-center">
                            <ClockIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">No Activity Logs</h3>
                            <p className="text-white/60">No activity has been recorded yet.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {activities.last_page > 1 && (
                        <div className="border-t border-white/10 px-6 py-4 flex justify-center gap-2">
                            {activities.links.map((link, index) => (
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

            {/* Clear Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-maroon-900 border border-white/10 rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Clear Old Logs</h3>
                        <p className="text-white/60 mb-4">
                            This will permanently delete audit logs older than the specified number of days.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Delete logs older than (days)
                            </label>
                            <input
                                type="number"
                                value={clearDays}
                                onChange={(e) => setClearDays(parseInt(e.target.value))}
                                min={1}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowClearModal(false)}
                                className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                                Clear Logs
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
