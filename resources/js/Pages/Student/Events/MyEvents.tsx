import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GlassPageHeader from '@/Components/GlassPageHeader';
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
    registrations?: EventRegistration[];
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

export default function MyEvents({ auth, registrations = [] }: Props) {
    const handleCancel = (registrationId: number) => {
        if (confirm('Are you sure you want to cancel your registration for this event?')) {
            router.delete(route('student.events.registration.cancel', registrationId), {
                preserveScroll: true,
                onSuccess: () => toast.success('Registration cancelled successfully'),
                onError: () => toast.error('Failed to cancel registration'),
            });
        }
    };

    // Ensure registrations is always an array
    const safeRegistrations = registrations || [];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="My Events" />

            <GlassPageHeader title="My Registrations">
                <Link
                    href={route('student.events.index')}
                    className="inline-flex items-center px-4 py-2 bg-gold-500 text-maroon-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 text-sm"
                >
                    <CalendarDaysIcon className="w-5 h-5 mr-2" />
                    Browse Events
                </Link>
            </GlassPageHeader>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {safeRegistrations.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center border border-white/10 bg-black/30 backdrop-blur-md">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10">
                            <TicketIcon className="w-10 h-10 text-white/40" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No registrations yet</h3>
                        <p className="text-white/60 mb-8 max-w-md mx-auto">
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
                            {safeRegistrations.map((registration) => (
                                <div
                                    key={registration.id}
                                    className="group relative bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-black/60 hover:border-gold-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/5 hover:-translate-y-1"
                                >
                                    {/* Cover Image */}
                                    <div className="aspect-video w-full bg-maroon-800/50 relative overflow-hidden">
                                        {registration.event.coverImage ? (
                                            <img
                                                src={`/storage/${registration.event.coverImage}`}
                                                alt={registration.event.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-800 to-maroon-950">
                                                <CalendarDaysIcon className="w-12 h-12 text-white/10" />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[registration.status].bg} ${statusColors[registration.status].text} ${statusColors[registration.status].border} backdrop-blur-md shadow-lg`}>
                                                {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${eventTypeColors[registration.event.type]?.bg || 'bg-white/10'} ${eventTypeColors[registration.event.type]?.text || 'text-white/60'} border border-white/5`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[registration.event.type]?.dot || 'bg-white/40'}`} />
                                                {registration.event.typeLabel}
                                            </span>
                                            <span className="text-[10px] text-white/40 ml-auto font-medium bg-black/40 px-2 py-1 rounded-md">
                                                {registration.registeredAt}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-4 line-clamp-1 group-hover:text-gold-400 transition-colors">
                                            {registration.event.title}
                                        </h3>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-sm text-white/70 group/item">
                                                <CalendarDaysIcon className="w-4 h-4 mr-3 text-gold-500/50 group-hover/item:text-gold-400 transition-colors" />
                                                {registration.event.eventDate}
                                            </div>
                                            <div className="flex items-center text-sm text-white/70 group/item">
                                                <ClockIcon className="w-4 h-4 mr-3 text-gold-500/50 group-hover/item:text-gold-400 transition-colors" />
                                                {registration.event.formattedTime}
                                            </div>
                                            <div className="flex items-center text-sm text-white/70 group/item">
                                                <MapPinIcon className="w-4 h-4 mr-3 text-gold-500/50 group-hover/item:text-gold-400 transition-colors" />
                                                {registration.event.location || 'TBA'}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                                            {registration.status === 'registered' ? (
                                                <button
                                                    onClick={() => handleCancel(registration.id)}
                                                    className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            ) : registration.status === 'attended' ? (
                                                    <div className="flex-1 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm font-bold flex items-center justify-center gap-2">
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    Attended
                                                </div>
                                                ) : (
                                                <div className="flex-1 px-4 py-2 text-center text-white/40 text-sm font-medium bg-white/5 rounded-lg">
                                                    Cancelled
                                                </div>
                                            )}

                                            <Link
                                                href={route('student.events.show', registration.event.id)}
                                                className="px-4 py-2 rounded-lg bg-white/5 text-white/70 text-sm font-bold hover:bg-white/10 hover:text-white transition-colors border border-white/5 hover:border-white/10"
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
        </AuthenticatedLayout>
    );
}
