import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Attendee {
    id: number;
    name: string;
    position: string;
    status: string;
    photoUrl: string;
}

interface Props {
    meeting: {
        id: number;
        title: string;
        type: string;
        typeLabel: string;
        meetingDate: string;
        formattedTime: string;
        venue: string | null;
        agenda: string | null;
        minutes: string | null;
        resolutions: string | null;
        actionItems: string | null;
        status: string;
        statusLabel: string;
        authorName: string;
        approverName: string | null;
        approvedAt: string | null;
        createdAt: string;
        attendees: Attendee[];
    };
}

const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    pending_approval: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    archived: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const attendeeStatusColors: Record<string, string> = {
    present: 'text-green-400',
    late: 'text-yellow-400',
    excused: 'text-blue-400',
    absent: 'text-red-400',
};

export default function ShowMeeting({ meeting }: Props) {
    const submitForm = useForm({});
    const approveForm = useForm({});

    const handleSubmit = () => {
        submitForm.post(route('officer.secretary.submit', meeting.id));
    };

    const handleApprove = () => {
        approveForm.post(route('officer.secretary.approve', meeting.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={meeting.title} />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-3xl">
                    {/* Back Link */}
                    <Link
                        href={route('officer.secretary.index')}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                        ← Back to Meeting Notes
                    </Link>

                    {/* Header */}
                    <div className="mt-6 mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{meeting.typeLabel.split(' ')[0]}</span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[meeting.status]}`}>
                                {meeting.statusLabel}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">{meeting.title}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                            <span>📅 {meeting.meetingDate}</span>
                            <span>⏰ {meeting.formattedTime}</span>
                            {meeting.venue && <span>📍 {meeting.venue}</span>}
                        </div>
                        <p className="text-sm text-white/40 mt-1">
                            Recorded by {meeting.authorName} on {meeting.createdAt}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mb-8">
                        {meeting.status === 'draft' && (
                            <>
                                <Link
                                    href={route('officer.secretary.edit', meeting.id)}
                                    className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitForm.processing}
                                    className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-medium text-maroon-900 hover:-translate-y-0.5 transition-all"
                                >
                                    Submit for Approval
                                </button>
                            </>
                        )}
                        {meeting.status === 'pending_approval' && (
                            <button
                                onClick={handleApprove}
                                disabled={approveForm.processing}
                                className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:-translate-y-0.5 transition-all"
                            >
                                Approve
                            </button>
                        )}
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-6">
                        {meeting.agenda && (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                                    📋 Agenda
                                </h3>
                                <p className="text-white whitespace-pre-wrap">{meeting.agenda}</p>
                            </div>
                        )}

                        {meeting.minutes && (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                                    📝 Minutes
                                </h3>
                                <p className="text-white whitespace-pre-wrap">{meeting.minutes}</p>
                            </div>
                        )}

                        {meeting.resolutions && (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                                    ✅ Resolutions
                                </h3>
                                <p className="text-white whitespace-pre-wrap">{meeting.resolutions}</p>
                            </div>
                        )}

                        {meeting.actionItems && (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                                    🎯 Action Items
                                </h3>
                                <p className="text-white whitespace-pre-wrap">{meeting.actionItems}</p>
                            </div>
                        )}

                        {/* Attendees */}
                        {meeting.attendees.length > 0 && (
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                                    👥 Attendance ({meeting.attendees.length})
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {meeting.attendees.map((attendee) => (
                                        <div key={attendee.id} className="flex items-center gap-3">
                                            <img
                                                src={attendee.photoUrl}
                                                alt={attendee.name}
                                                className="h-10 w-10 rounded-full border border-white/20"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{attendee.name}</p>
                                                <p className="text-xs text-white/40">{attendee.position}</p>
                                            </div>
                                            <span className={`text-xs font-medium capitalize ${attendeeStatusColors[attendee.status]}`}>
                                                {attendee.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Approval Info */}
                        {meeting.approverName && (
                            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
                                <p className="text-green-400 text-sm">
                                    ✅ Approved by {meeting.approverName} on {meeting.approvedAt}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
