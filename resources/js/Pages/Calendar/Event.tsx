import { Head, Link, router, usePage } from '@inertiajs/react';
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

    const handleRegister = () => {
        router.post(route('calendar.register', event.slug));
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
        <>
            <Head title={event.title} />
            
            <div className="min-h-screen bg-gradient-to-br from-maroon-950 via-maroon-900 to-black">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-maroon-900/80 backdrop-blur-lg border-b border-white/10">
                    <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                        <Link href={route('calendar.index')} className="flex items-center gap-2 text-white/60 hover:text-white">
                            <ArrowLeftIcon className="h-5 w-5" />
                            <span>Back to Calendar</span>
                        </Link>
                        <CalendarDaysIcon className="h-6 w-6 text-gold-400" />
                    </div>
                </header>

                <div className="max-w-5xl mx-auto px-4 py-8">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-3">
                            <CheckCircleIcon className="h-5 w-5" />
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-3">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            {flash.error}
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Cover Image */}
                            <div className="mb-8 rounded-2xl overflow-hidden aspect-video relative bg-maroon-800/50 border border-white/10 shadow-2xl">
                                {event.coverImage ? (
                                    <img 
                                        src={`/storage/${event.coverImage}`} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover"
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
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                {event.title}
                            </h1>

                            {/* Meta info */}
                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="p-2 rounded-lg bg-gold-500/20">
                                        <CalendarDaysIcon className="h-5 w-5 text-gold-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/50">Date</p>
                                        <p className="text-white font-medium">{event.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="p-2 rounded-lg bg-gold-500/20">
                                        <ClockIcon className="h-5 w-5 text-gold-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/50">Time</p>
                                        <p className="text-white font-medium">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="p-2 rounded-lg bg-gold-500/20">
                                        {event.is_online ? (
                                            <VideoCameraIcon className="h-5 w-5 text-gold-400" />
                                        ) : (
                                            <MapPinIcon className="h-5 w-5 text-gold-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/50">
                                            {event.is_online ? 'Online Event' : 'Location'}
                                        </p>
                                        <p className="text-white font-medium">
                                            {event.location || (event.is_online ? 'Virtual Meeting' : 'TBA')}
                                        </p>
                                    </div>
                                </div>
                                {event.requires_registration && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="p-2 rounded-lg bg-gold-500/20">
                                            <UserGroupIcon className="h-5 w-5 text-gold-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/50">Attendees</p>
                                            <p className="text-white font-medium">
                                                {event.attendees_count}
                                                {event.max_attendees && ` / ${event.max_attendees}`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="rounded-xl bg-white/5 border border-white/10 p-6 mb-8">
                                <h2 className="text-lg font-semibold text-white mb-4">About this Event</h2>
                                <div className="prose prose-invert prose-gold max-w-none">
                                    <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </div>

                            {/* Meeting link for online events */}
                            {event.is_online && event.meeting_link && (
                                <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                        <VideoCameraIcon className="h-5 w-5" />
                                        Online Meeting
                                    </h3>
                                    <a
                                        href={event.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline break-all"
                                    >
                                        {event.meeting_link}
                                    </a>
                                </div>
                            )}

                            {/* Gallery */}
                            {event.galleryImages && event.galleryImages.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-gold-500 rounded-full" />
                                        Event Gallery
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {event.galleryImages.map((img, idx) => (
                                            <div key={idx} className="rounded-xl overflow-hidden aspect-video bg-white/5 border border-white/10 group relative cursor-pointer">
                                                <img 
                                                    src={`/storage/${img}`} 
                                                    alt={`Gallery ${idx + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="p-2 bg-white/10 backdrop-blur rounded-full">
                                                        <VideoCameraIcon className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Registration Card */}
                                {event.requires_registration && (
                                    <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Registration</h3>
                                        
                                        {event.registration_open ? (
                                            <>
                                                {event.available_slots !== null && (
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-sm mb-2">
                                                            <span className="text-white/60">Available spots</span>
                                                            <span className="text-gold-400 font-medium">
                                                                {event.available_slots} left
                                                            </span>
                                                        </div>
                                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-gold-500 rounded-full"
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
                                                        className="w-full py-3 rounded-lg bg-gold-500 text-maroon-900 font-bold hover:bg-gold-400 transition-colors"
                                                    >
                                                        Register Now
                                                    </button>
                                                ) : (
                                                    <Link
                                                        href={route('login')}
                                                        className="block w-full py-3 rounded-lg bg-gold-500 text-maroon-900 font-bold text-center hover:bg-gold-400 transition-colors"
                                                    >
                                                        Login to Register
                                                    </Link>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-white/60">Registration closed</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Related Events */}
                                {relatedEvents.length > 0 && (
                                    <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Similar Events</h3>
                                        <div className="space-y-3">
                                            {relatedEvents.map(related => (
                                                <Link
                                                    key={related.id}
                                                    href={route('calendar.show', related.slug)}
                                                    className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                >
                                                    <p className="text-white font-medium text-sm">{related.title}</p>
                                                    <p className="text-white/50 text-xs mt-1">{related.displayDate}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Share */}
                                <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Share</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                                            className="flex-1 py-2 rounded-lg bg-white/10 text-white/80 text-sm hover:bg-white/20 transition-colors"
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
