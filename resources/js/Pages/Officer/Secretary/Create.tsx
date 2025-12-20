import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormEventHandler, useState } from 'react';

interface Officer {
    id: number;
    name: string;
    position: string;
}

interface Props {
    types: Record<string, string>;
    officers: Officer[];
}

interface AttendeeData {
    officer_id: number;
    status: 'present' | 'absent' | 'late' | 'excused';
}

export default function CreateMeeting({ types, officers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'regular',
        meeting_date: '',
        start_time: '',
        end_time: '',
        venue: '',
        agenda: '',
        minutes: '',
        resolutions: '',
        action_items: '',
        attendees: [] as AttendeeData[],
    });

    const [showAttendees, setShowAttendees] = useState(false);

    const toggleAttendee = (officerId: number, status: 'present' | 'absent' | 'late' | 'excused') => {
        const existing = data.attendees.find(a => a.officer_id === officerId);
        if (existing) {
            setData('attendees', data.attendees.map(a => 
                a.officer_id === officerId ? { ...a, status } : a
            ));
        } else {
            setData('attendees', [...data.attendees, { officer_id: officerId, status }]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('officer.secretary.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="New Meeting Note" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('officer.secretary.index')}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            ← Back to Meeting Notes
                        </Link>
                        <h1 className="text-2xl font-bold text-white mt-4">New Meeting Note</h1>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">Meeting Details</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="auth-label">Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Regular Meeting - December 2024"
                                        className="auth-input"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                                </div>
                                <div>
                                    <label className="auth-label">Type</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="auth-input"
                                    >
                                        {Object.entries(types).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="auth-label">Venue</label>
                                    <input
                                        type="text"
                                        value={data.venue}
                                        onChange={(e) => setData('venue', e.target.value)}
                                        placeholder="e.g., SC Office"
                                        className="auth-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">Date & Time</h2>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="auth-label">Date</label>
                                    <input
                                        type="date"
                                        value={data.meeting_date}
                                        onChange={(e) => setData('meeting_date', e.target.value)}
                                        className="auth-input"
                                    />
                                    {errors.meeting_date && <p className="mt-1 text-sm text-red-400">{errors.meeting_date}</p>}
                                </div>
                                <div>
                                    <label className="auth-label">Start Time</label>
                                    <input
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="auth-input"
                                    />
                                </div>
                                <div>
                                    <label className="auth-label">End Time</label>
                                    <input
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="auth-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">Meeting Content</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="auth-label">Agenda</label>
                                    <textarea
                                        value={data.agenda}
                                        onChange={(e) => setData('agenda', e.target.value)}
                                        rows={3}
                                        placeholder="Meeting agenda items..."
                                        className="auth-input resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="auth-label">Minutes</label>
                                    <textarea
                                        value={data.minutes}
                                        onChange={(e) => setData('minutes', e.target.value)}
                                        rows={5}
                                        placeholder="Detailed meeting minutes..."
                                        className="auth-input resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="auth-label">Resolutions</label>
                                    <textarea
                                        value={data.resolutions}
                                        onChange={(e) => setData('resolutions', e.target.value)}
                                        rows={3}
                                        placeholder="Decisions and resolutions made..."
                                        className="auth-input resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="auth-label">Action Items</label>
                                    <textarea
                                        value={data.action_items}
                                        onChange={(e) => setData('action_items', e.target.value)}
                                        rows={3}
                                        placeholder="Tasks assigned..."
                                        className="auth-input resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Attendees */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={() => setShowAttendees(!showAttendees)}
                                className="flex items-center justify-between w-full"
                            >
                                <h2 className="text-lg font-semibold text-white">Attendance ({data.attendees.length})</h2>
                                <span className="text-white/40">{showAttendees ? '▲' : '▼'}</span>
                            </button>
                            
                            {showAttendees && (
                                <div className="mt-4 space-y-2">
                                    {officers.map((officer) => {
                                        const attendee = data.attendees.find(a => a.officer_id === officer.id);
                                        return (
                                            <div key={officer.id} className="flex items-center justify-between py-2 border-b border-white/5">
                                                <div>
                                                    <p className="text-white">{officer.name}</p>
                                                    <p className="text-sm text-white/40">{officer.position}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    {(['present', 'late', 'excused', 'absent'] as const).map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => toggleAttendee(officer.id, status)}
                                                            className={`rounded px-2 py-1 text-xs transition-colors ${
                                                                attendee?.status === status
                                                                    ? status === 'present' ? 'bg-green-500/30 text-green-400'
                                                                    : status === 'late' ? 'bg-yellow-500/30 text-yellow-400'
                                                                    : status === 'excused' ? 'bg-blue-500/30 text-blue-400'
                                                                    : 'bg-red-500/30 text-red-400'
                                                                    : 'bg-white/10 text-white/50 hover:bg-white/20'
                                                            }`}
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={route('officer.secretary.index')}
                                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-3 text-sm font-semibold text-maroon-900 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save as Draft'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
