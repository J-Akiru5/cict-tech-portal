import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface MyEvent {
    id: number;
    title: string;
    slug: string;
    type: string;
    typeLabel: string;
    eventDate: string;
    formattedTime: string;
    location: string | null;
    isToday: boolean;
    isPast: boolean;
    status: string;
    checkedInAt: string | null;
}

interface Props {
    events: MyEvent[];
}

const statusBadges: Record<string, { color: string; label: string }> = {
    registered: { color: 'bg-blue-500/20 text-blue-400', label: 'Registered' },
    attended: { color: 'bg-green-500/20 text-green-400', label: 'Attended' },
    absent: { color: 'bg-red-500/20 text-red-400', label: 'Absent' },
    excused: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Excused' },
};

export default function MyEvents({ events }: Props) {
    const upcomingEvents = events.filter(e => !e.isPast);
    const pastEvents = events.filter(e => e.isPast);

    return (
        <AuthenticatedLayout>
            <Head title="My Events" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">My Events</h1>
                            <p className="text-white/60">Events you've registered for</p>
                        </div>
                        <Link
                            href={route('student.events.index')}
                            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        >
                            Browse Events
                        </Link>
                    </div>

                    {events.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">📅</div>
                            <h3 className="text-lg font-medium text-white">No registered events</h3>
                            <p className="text-white/50 mt-2">
                                Browse upcoming events and register!
                            </p>
                            <Link
                                href={route('student.events.index')}
                                className="mt-4 inline-block rounded-xl bg-gold-500 px-6 py-2 text-sm font-medium text-maroon-900 hover:-translate-y-0.5 transition-all"
                            >
                                Browse Events
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Upcoming */}
                            {upcomingEvents.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-white mb-4">Upcoming</h2>
                                    <div className="space-y-3">
                                        {upcomingEvents.map((event) => (
                                            <Link
                                                key={event.id}
                                                href={route('student.events.show', event.id)}
                                                className={`block rounded-xl border p-4 transition-all hover:bg-white/10 ${
                                                    event.isToday 
                                                        ? 'border-gold-500/50 bg-gold-500/10' 
                                                        : 'border-white/10 bg-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-2xl">{event.typeLabel.split(' ')[0]}</span>
                                                        <div>
                                                            <h3 className="font-medium text-white">{event.title}</h3>
                                                            <p className="text-sm text-white/60">
                                                                {event.isToday ? (
                                                                    <span className="text-gold-400">Today</span>
                                                                ) : (
                                                                    event.eventDate
                                                                )} • {event.formattedTime}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadges[event.status]?.color}`}>
                                                        {statusBadges[event.status]?.label}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Past */}
                            {pastEvents.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-semibold text-white/60 mb-4">Past Events</h2>
                                    <div className="space-y-3 opacity-70">
                                        {pastEvents.map((event) => (
                                            <Link
                                                key={event.id}
                                                href={route('student.events.show', event.id)}
                                                className="block rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-2xl grayscale">{event.typeLabel.split(' ')[0]}</span>
                                                        <div>
                                                            <h3 className="font-medium text-white/80">{event.title}</h3>
                                                            <p className="text-sm text-white/50">{event.eventDate}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadges[event.status]?.color}`}>
                                                        {statusBadges[event.status]?.label}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
