import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Meeting {
    id: number;
    title: string;
    slug: string;
    type: string;
    typeLabel: string;
    meetingDate: string;
    formattedTime: string;
    venue: string | null;
    status: string;
    statusLabel: string;
    authorName: string;
    attendeeCount: number;
}

interface Props {
    meetings: Meeting[];
    statuses: Record<string, string>;
    selectedStatus: string | null;
}

const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    pending_approval: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    archived: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function SecretaryIndex({ meetings, statuses, selectedStatus }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Meeting Notes" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Meeting Notes</h1>
                            <p className="text-white/60">Manage meeting minutes and records</p>
                        </div>
                        <Link
                            href={route('officer.secretary.create')}
                            className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 text-sm font-semibold text-maroon-900 shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all"
                        >
                            + New Meeting
                        </Link>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        <Link
                            href={route('officer.secretary.index')}
                            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                !selectedStatus 
                                    ? 'bg-gold-500 text-maroon-900 font-medium' 
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                        >
                            All
                        </Link>
                        {Object.entries(statuses).map(([key, label]) => (
                            <Link
                                key={key}
                                href={route('officer.secretary.index', { status: key })}
                                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                    selectedStatus === key 
                                        ? 'bg-gold-500 text-maroon-900 font-medium' 
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Meetings List */}
                    {meetings.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">📋</div>
                            <h3 className="text-lg font-medium text-white">No meeting notes yet</h3>
                            <p className="text-white/50 mt-2">Create your first meeting note to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {meetings.map((meeting) => (
                                <Link
                                    key={meeting.id}
                                    href={route('officer.secretary.show', meeting.id)}
                                    className="block rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-gold-500/30"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">{meeting.typeLabel.split(' ')[0]}</span>
                                                <span className="text-xs text-white/40 uppercase tracking-wider">
                                                    {meeting.type}
                                                </span>
                                            </div>
                                            <h3 className="font-medium text-white truncate">{meeting.title}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                                                <span>📅 {meeting.meetingDate}</span>
                                                <span>⏰ {meeting.formattedTime}</span>
                                                {meeting.venue && <span>📍 {meeting.venue}</span>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[meeting.status]}`}>
                                                {meeting.statusLabel}
                                            </span>
                                            <span className="text-xs text-white/40">
                                                {meeting.attendeeCount} attendees
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
