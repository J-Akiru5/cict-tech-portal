import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    ClockIcon,
    MapPinIcon,
    VideoCameraIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import GlassPageHeader from '@/Components/GlassPageHeader';

interface EventDetail {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    is_online: boolean;
    meeting_link: string | null;
    type: string;
    type_label: string;
    is_featured: boolean;
    requires_registration: boolean;
    registration_open: boolean;
    max_attendees: number | null;
    available_slots: number | null;
    attendees_count: number;
    slug: string;
    coverImage: string | null;
    galleryImages: string[] | null;
}

interface RelatedEvent {
    id: number;
    title: string;
    displayDate: string;
    slug: string;
    color: string;
}

interface Props {
    event: EventDetail;
    relatedEvents: RelatedEvent[];
}

export default function CalendarEvent({ event, relatedEvents }: Props) {
    const { auth, flash } = usePage().props as any;

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleRegister = () => {
        router.post(route('calendar.register', event.slug), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Successfully registered for ${event.title}!`),
            onError: () => toast.error('Failed to register. Please try again.'),
        });
    };

    const getEventTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            seminar: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
            workshop: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            meeting: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            social: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            competition: 'bg-green-500/20 text-green-400 border-green-500/30',
            other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        return colors[type] || colors.other;
    };

    return (
        <PublicLayout>
            <Head title={event.title} />
            
            <GlassPageHeader title="Event Details">
                <Link href={route('calendar.index')} className="text-sm font-medium text-gold-400 hover:text-white transition-colors flex items-center gap-1">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Calendar
                </Link>
            </GlassPageHeader>

            <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                {/* Flash messages */}
                {flash?.success && (
                    <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-3 animate-fade-in">
                        <CheckCircleIcon className="h-5 w-5" />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-3 animate-fade-in">
                        <ExclamationTriangleIcon className="h-5 w-5" />
                        {flash.error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Cover Image */}
                        <div className="rounded-2xl overflow-hidden aspect-video relative bg-maroon-800/50 border border-white/10 shadow-2xl group">
                            {event.coverImage ? (
                                <img
                                    src={`/storage/${event.coverImage}`}
                                    alt={event.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-800 to-black">
                                    <CalendarDaysIcon className="w-20 h-20 text-white/5" />
                                </div>
                            )}

                            <div className="absolute top-4 left-4 flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-medium border backdrop-blur-md shadow-lg ${getEventTypeColor(event.type)}`}>
                                    {event.type_label}
                                </span>
                                {event.is_featured && (
                                    <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gold-500/90 backdrop-blur-md text-maroon-900 shadow-lg border border-gold-400">
                                        ⭐ Featured
                                    </span>
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight text-shadow">
                                    {event.title}
                                </h1>
                            </div>
                        </div>

                        {/* Meta info Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="glass-card p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                                <div className="p-3 rounded-xl bg-gold-500/20 ring-1 ring-gold-500/30">
                                    <CalendarDaysIcon className="h-6 w-6 text-gold-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Date</p>
                                    <p className="text-white font-bold">{event.date}</p>
                                </div>
                            </div>
                            <div className="glass-card p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                                <div className="p-3 rounded-xl bg-gold-500/20 ring-1 ring-gold-500/30">
                                    <ClockIcon className="h-6 w-6 text-gold-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Time</p>
                                    <p className="text-white font-bold">{event.time}</p>
                                </div>
                            </div>
                            <div className="glass-card p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors sm:col-span-2">
                                <div className="p-3 rounded-xl bg-gold-500/20 ring-1 ring-gold-500/30">
                                    {event.is_online ? (
                                        <VideoCameraIcon className="h-6 w-6 text-gold-400" />
                                    ) : (
                                        <MapPinIcon className="h-6 w-6 text-gold-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                                        {event.is_online ? 'Online Platform' : 'Location'}
                                    </p>
                                    <p className="text-white font-bold">
                                        {event.location || (event.is_online ? 'Virtual Meeting' : 'TBA')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="glass-card rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-gold-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-gold-500 rounded-full" />
                                About this Event
                            </h2>
                            <div className="prose prose-invert prose-gold max-w-none relative z-10">
                                <p className="text-white/80 whitespace-pre-wrap leading-relaxed border-l-2 border-white/10 pl-4">
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        {/* Meeting link */}
                        {event.is_online && event.meeting_link && (
                            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <VideoCameraIcon className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-400">Join Online Meeting</h3>
                                        <p className="text-xs text-blue-300/70">Click to join the session</p>
                                    </div>
                                </div>
                                <a
                                    href={event.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Join Now
                                </a>
                            </div>
                        )}

                        {/* Gallery */}
                        {event.galleryImages && event.galleryImages.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-gold-500 rounded-full" />
                                    Event Gallery
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {event.galleryImages.map((img, idx) => (
                                        <div key={idx} className="rounded-xl overflow-hidden aspect-video bg-white/5 border border-white/10 group relative cursor-pointer shadow-lg hover:shadow-gold-500/10 transition-all">
                                            <img
                                                src={`/storage/${img}`}
                                                alt={`Gallery ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Registration Card */}
                        {event.requires_registration && (
                            <div className="glass-card rounded-2xl border border-white/10 p-6 sticky top-24 shadow-glass">
                                <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none"></div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <UserGroupIcon className="w-5 h-5 text-gold-400" />
                                        Registration
                                    </h3>

                                    {event.registration_open ? (
                                        <>
                                            {event.available_slots !== null && (
                                                <div className="mb-6 p-4 rounded-xl bg-black/40 border border-white/5">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-white/60">Available spots</span>
                                                        <span className="text-gold-400 font-bold">
                                                            {event.available_slots} left
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full shadow-[0_0_10px_rgba(212,160,23,0.5)]"
                                                            style={{
                                                                width: `${((event.max_attendees! - event.available_slots) / event.max_attendees!) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {auth?.user ? (
                                                <button
                                                    onClick={handleRegister}
                                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-950 font-bold hover:scale-[1.02] hover:shadow-gold-500/20 active:scale-[0.98] transition-all transform"
                                                >
                                                    Register Now
                                                </button>
                                            ) : (
                                                <Link
                                                    href={route('login')}
                                                    className="block w-full py-4 rounded-xl bg-white/10 text-white font-bold text-center hover:bg-white/20 border border-white/10 transition-all"
                                                >
                                                    Login to Register
                                                </Link>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-6 rounded-xl bg-white/5 border border-white/10">
                                            <p className="text-white/50 font-medium">Registration closed</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Related Events */}
                        {relatedEvents.length > 0 && (
                            <div className="glass-card rounded-2xl border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Similar Events</h3>
                                <div className="space-y-4">
                                    {relatedEvents.map(related => (
                                        <Link
                                            key={related.id}
                                            href={route('calendar.show', related.slug)}
                                            className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                                        >
                                            <p className="text-white font-bold text-sm group-hover:text-gold-400 transition-colors">{related.title}</p>
                                            <p className="text-white/50 text-xs mt-2 flex items-center gap-1">
                                                <CalendarDaysIcon className="w-3 h-3" />
                                                {related.displayDate}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
