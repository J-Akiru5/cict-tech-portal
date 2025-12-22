import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassPageHeader from '@/Components/GlassPageHeader';

interface EventItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    type: string;
    typeLabel: string;
    eventDate: string;
    formattedTime: string;
    location: string | null;
    isOnline: boolean;
    isToday: boolean;
    isFeatured: boolean;
    requiresRegistration: boolean;
    isRegistrationOpen: boolean;
    availableSlots: number | null;
    isRegistered: boolean;
}

interface Props {
    events: EventItem[];
    types: Record<string, string>;
    selectedType: string | null;
}

export default function EventsIndex({ events, types, selectedType }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Events" />

            <GlassPageHeader title="Upcoming Events">
                <Link
                    href={route('student.events.my')}
                    className="inline-flex items-center px-4 py-2 bg-gold-500 text-maroon-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 text-sm"
                >
                    My Events
                </Link>
            </GlassPageHeader>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
                {/* Type Filter */}
                <div className="mb-6 flex flex-wrap gap-2">
                        <Link
                            href={route('student.events.index')}
                            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                !selectedType 
                                    ? 'bg-gold-500 text-maroon-900 font-medium' 
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                        >
                            All
                        </Link>
                        {Object.entries(types).map(([key, label]) => (
                            <Link
                                key={key}
                                href={route('student.events.index', { type: key })}
                                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                    selectedType === key 
                                        ? 'bg-gold-500 text-maroon-900 font-medium' 
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Events Grid */}
                    {events.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">📅</div>
                            <h3 className="text-lg font-medium text-white">No upcoming events</h3>
                            <p className="text-white/50 mt-2">Check back later for new events!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={route('student.events.show', event.id)}
                                    className={`block rounded-xl border p-5 backdrop-blur-sm transition-all hover:-translate-y-1 ${
                                        event.isToday 
                                            ? 'border-gold-500/50 bg-gold-500/10' 
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <span className="text-2xl">{event.typeLabel.split(' ')[0]}</span>
                                        {event.isRegistered && (
                                            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                                                Registered
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-white mb-2">{event.title}</h3>

                                    {/* Details */}
                                    <div className="space-y-1 text-sm text-white/60">
                                        <p className={event.isToday ? 'text-gold-400 font-medium' : ''}>
                                            📅 {event.isToday ? 'Today' : event.eventDate}
                                        </p>
                                        <p>⏰ {event.formattedTime}</p>
                                        <p>📍 {event.isOnline ? 'Online' : event.location || 'TBA'}</p>
                                    </div>

                                    {/* Registration status */}
                                    {event.requiresRegistration && event.isRegistrationOpen && !event.isRegistered && (
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <span className="text-xs text-gold-400">
                                                {event.availableSlots !== null 
                                                    ? `${event.availableSlots} slots left` 
                                                    : 'Registration open'
                                                }
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
