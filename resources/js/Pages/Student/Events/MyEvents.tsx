import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    CalendarDaysIcon,
    MapPinIcon,
    ClockIcon,
    VideoCameraIcon,
    XMarkIcon,
    TicketIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface EventRegistration {
    id: number;
    status: 'registered' | 'attended' | 'cancelled';
    registeredAt: string;
    event: {
        id: number;
        title: string;
        slug: string;
        type: string;
        typeLabel: string;
        eventDate: string;
        formattedTime: string;
        location: string;
        coverImage: string | null;
    };
}

interface Props {
    auth: any;
    registrations: EventRegistration[];
}

const eventTypeColors: Record<string, { bg: string; text: string; dot: string }> = {
    seminar: { bg: 'bg-gold-500/10', text: 'text-gold-400', dot: 'bg-gold-500' },
    workshop: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-500' },
    meeting: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-500' },
    social: { bg: 'bg-pink-500/10', text: 'text-pink-400', dot: 'bg-pink-500' },
    competition: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-500' },
    other: { bg: 'bg-maroon-500/10', text: 'text-maroon-400', dot: 'bg-maroon-500' },
};

const statusColors = {
    registered: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    attended: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
};

export default function MyEvents({ auth, registrations }: Props) {
    const handleCancel = (registrationId: number) => {
        if (confirm('Are you sure you want to cancel your registration for this event?')) {
            router.delete(route('student.events.registration.cancel', registrationId), {
                preserveScroll: true,
                onSuccess: () => toast.success('Registration cancelled successfully'),
                onError: () => toast.error('Failed to cancel registration'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">My Events</h2>}
        >
            <Head title="My Events" />

            <div className="py-12 bg-maroon-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">My Registrations</h1>
                            <p className="text-white/60">Manage your upcoming events and view attendance history.</p>
                        </div>
                        <Link
                            href={route('student.events.index')}
                            className="inline-flex items-center px-4 py-2 bg-gold-500 text-maroon-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
                        >
                            <CalendarDaysIcon className="w-5 h-5 mr-2" />
                            Browse Events
                        </Link>
                    </div>

                    {registrations.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TicketIcon className="w-8 h-8 text-white/40" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No registrations yet</h3>
                            <p className="text-white/60 mb-6 max-w-md mx-auto">
                                You haven't registered for any events yet. Check out the calendar to see what's coming up!
                            </p>
                            <Link
                                href={route('student.events.index')}
                                className="inline-flex items-center text-gold-400 hover:text-gold-300 font-medium"
                            >
                                View Calendar &rarr;
                            </Link>
                        </div>
                    ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {registrations.map((registration) => (
                                    <div
                                        key={registration.id}
                                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                    >
                                    {/* Cover Image or Pattern */}
                                    <div className="aspect-video w-full bg-maroon-800/50 relative overflow-hidden">
                                        {registration.event.coverImage ? (
                                            <img
                                                src={`/storage/${registration.event.coverImage}`}
                                                alt={registration.event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-800 to-maroon-900">
                                                <CalendarDaysIcon className="w-12 h-12 text-white/10" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[registration.status].bg} ${statusColors[registration.status].text} ${statusColors[registration.status].border} backdrop-blur-sm`}>
                                                {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${eventTypeColors[registration.event.type]?.bg || 'bg-white/10'} ${eventTypeColors[registration.event.type]?.text || 'text-white/60'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[registration.event.type]?.dot || 'bg-white/40'}`} />
                                                {registration.event.typeLabel}
                                            </span>
                                            <span className="text-xs text-white/40 ml-auto">
                                                Registered {registration.registeredAt}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-gold-400 transition-colors">
                                            {registration.event.title}
                                        </h3>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-sm text-white/70">
                                                <CalendarDaysIcon className="w-4 h-4 mr-2 text-gold-500/70" />
                                                {registration.event.eventDate}
                                            </div>
                                            <div className="flex items-center text-sm text-white/70">
                                                <ClockIcon className="w-4 h-4 mr-2 text-gold-500/70" />
                                                {registration.event.formattedTime}
                                            </div>
                                            <div className="flex items-center text-sm text-white/70">
                                                <MapPinIcon className="w-4 h-4 mr-2 text-gold-500/70" />
                                                {registration.event.location || 'TBA'}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                                            {registration.status === 'registered' ? (
                                                <button
                                                    onClick={() => handleCancel(registration.id)}
                                                    className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                    Cancel Registration
                                                </button>
                                            ) : registration.status === 'attended' ? (
                                                <div className="flex-1 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm font-medium flex items-center justify-center gap-2">
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    Attended
                                                </div>
                                                ) : (
                                                    <div className="flex-1 px-4 py-2 text-center text-white/40 text-sm">
                                                        Event Cancelled
                                                </div>
                                            )}

                                            <Link
                                                href={route('student.events.show', registration.event.id)}
                                                className="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
