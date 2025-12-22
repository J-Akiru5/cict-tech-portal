import { Link } from '@inertiajs/react';
import { CalendarDaysIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Event {
    id: number;
    title: string;
    description: string;
    event_date: string; // YYYY-MM-DD
    start_time: string | null;
    location: string | null;
    type: string;
    cover_image: string | null;
}

interface Props {
    events: Event[];
}

export default function CalendarWidget({ events = [] }: Props) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        };
    };

    const formatTime = (timeStr: string | null) => {
        if (!timeStr) return 'All Day';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="relative group overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-6 hover:bg-white/10 transition-colors duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gold-500/20 border border-gold-500/30">
                        <CalendarDaysIcon className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
                        <p className="text-sm text-white/50">Don't miss out on what's next</p>
                    </div>
                </div>
                <Link 
                    href={route('calendar.index')}
                    className="text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
                >
                    View All &rarr;
                </Link>
            </div>

            <div className="space-y-4">
                {events.length > 0 ? (
                    events.map((event) => {
                        const { day, month } = formatDate(event.event_date);
                        return (
                            <Link 
                                key={event.id}
                                href={route('calendar.show', event.id)}
                                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-gold-500/30 hover:-translate-y-1 transition-all duration-300 group/item"
                            >
                                {/* Date Badge */}
                                <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-900 border border-white/10 group-hover/item:border-gold-500/50 shadow-lg">
                                    <span className="text-[10px] font-bold text-gold-500 uppercase tracking-wider">{month}</span>
                                    <span className="text-xl font-bold text-white leading-none">{day}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-semibold truncate group-hover/item:text-gold-400 transition-colors">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <div className="flex items-center text-xs text-white/50">
                                            <ClockIcon className="w-3.5 h-3.5 mr-1" />
                                            {formatTime(event.start_time)}
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center text-xs text-white/50 truncate">
                                                <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                                                {event.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-white/40 text-sm">
                        No upcoming events scheduled.
                    </div>
                )}
            </div>
            
            {/* Decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-maroon-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
