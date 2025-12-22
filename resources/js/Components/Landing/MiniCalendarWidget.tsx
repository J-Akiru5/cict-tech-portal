import { Link } from '@inertiajs/react';
import { CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface Event {
    id: number;
    title: string;
    slug: string;
    event_date: string;
    start_time: string | null;
    location: string | null;
    type: string;
}

interface Props {
    events: Event[];
}

export default function MiniCalendarWidget({ events = [] }: Props) {
    // Get only the immediate next event, or null
    const nextEvent = events.length > 0 ? events[0] : null;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            day: date.getDate(),
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

    if (!nextEvent) return null;

    const { month, day } = formatDate(nextEvent.event_date);

    return (
        <div className="relative group/calendar w-72 mb-4">
            <Link
                href={route('calendar.show', nextEvent.slug)}
                className="block relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-gold-400/40 hover:shadow-gold-500/30 hover:-translate-y-2 hover:scale-105 rotating-border"
            >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-maroon-700/20 via-transparent to-gold-500/10 opacity-0 group-hover/calendar:opacity-100 transition-opacity duration-500" />
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-maroon-500 rounded-2xl opacity-0 group-hover/calendar:opacity-20 blur-xl transition-all duration-500" />

                <div className="relative z-10">
                    {/* Header Badge */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/30">
                            <CalendarDaysIcon className="w-4 h-4 text-gold-400" />
                            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider">Upcoming</span>
                        </div>
                        <span className="text-xs text-gold-400/80 group-hover/calendar:text-gold-400 transition-colors">
                            {events.length} event{events.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Date & Title */}
                    <div className="flex gap-4 mb-3">
                        {/* Date Box */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-maroon-800 to-maroon-900 border border-white/10 group-hover/calendar:border-gold-500/50">
                            <span className="text-[10px] font-bold text-gold-500 uppercase leading-none">{month}</span>
                            <span className="text-lg font-bold text-white leading-none mt-0.5">{day}</span>
                        </div>
                        
                        <h3 className="flex-1 text-lg font-bold text-white leading-tight line-clamp-2 group-hover/calendar:text-gold-300 transition-colors">
                            {nextEvent.title}
                        </h3>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-1.5 border-t border-white/10 pt-3">
                        <div className="flex items-center text-xs text-white/60">
                            <ClockIcon className="w-3.5 h-3.5 mr-2 text-gold-500/70" />
                            {formatTime(nextEvent.start_time)}
                        </div>
                        {nextEvent.location && (
                            <div className="flex items-center text-xs text-white/60 truncate">
                                <MapPinIcon className="w-3.5 h-3.5 mr-2 text-gold-500/70" />
                                <span className="truncate">{nextEvent.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover/calendar:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </Link>
        </div>
    );
}
