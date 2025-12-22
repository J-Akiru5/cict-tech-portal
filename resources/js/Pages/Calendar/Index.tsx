import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import GlassPageHeader from '@/Components/GlassPageHeader';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CalendarDaysIcon,
    MapPinIcon,
    ClockIcon,
    SparklesIcon,
    Squares2X2Icon,
    ViewColumnsIcon,
} from '@heroicons/react/24/outline';

interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    displayDate: string;
    day: number;
    time: string;
    location: string;
    type: string;
    type_label: string;
    is_featured: boolean;
    is_today: boolean;
    is_upcoming: boolean;
    slug: string;
    color: string;
}

interface Props {
    events: CalendarEvent[];
    featuredEvents: CalendarEvent[];
    currentMonth: number;
    currentYear: number;
    monthName: string;
    eventTypes: Record<string, string>;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarIndex({ events, featuredEvents, currentMonth, currentYear, monthName, eventTypes }: Props) {
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth - 1, 1);
        const lastDay = new Date(currentYear, currentMonth, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const days: (number | null)[] = [];
        
        // Empty cells before first day
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        
        // Days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        
        return days;
    }, [currentMonth, currentYear]);

    // Filter events by type
    const filteredEvents = useMemo(() => {
        if (!selectedType) return events;
        return events.filter(e => e.type === selectedType);
    }, [events, selectedType]);

    // Group events by day
    const eventsByDay = useMemo(() => {
        const grouped: Record<number, CalendarEvent[]> = {};
        filteredEvents.forEach(event => {
            const day = event.day;
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(event);
        });
        return grouped;
    }, [filteredEvents]);

    const navigateMonth = (direction: number) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;
        
        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
        
        router.get(route('calendar.index'), { month: newMonth, year: newYear }, { preserveState: true });
    };

    const getEventColorClass = (color: string) => {
        const colors: Record<string, string> = {
            gold: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
            maroon: 'bg-maroon-500/20 text-maroon-300 border-maroon-500/30',
            blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            green: 'bg-green-500/20 text-green-400 border-green-500/30',
            pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        };
        return colors[color] || colors.maroon;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && 
               currentMonth === today.getMonth() + 1 && 
               currentYear === today.getFullYear();
    };

    return (
        <PublicLayout>
            <Head title={`Calendar - ${monthName}`} />
            
            <div className="pt-28">
                <GlassPageHeader title="University Calendar">
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('calendar.timeline')}
                            className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                            title="Tunnel Timeline"
                        >
                            <ViewColumnsIcon className="h-5 w-5" />
                        </Link>
                        <Link
                            href={route('calendar.parallax')}
                            className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                            title="Parallax Timeline"
                        >
                            <Squares2X2Icon className="h-5 w-5" />
                        </Link>
                    </div>
                </GlassPageHeader>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="flex gap-8">
                        {/* Sidebar - Featured Events */}
                        <div className="w-72 flex-shrink-0">
                            <div className="sticky top-24 space-y-6">
                                {/* Event Type Filter */}
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                    <h3 className="text-sm font-semibold text-white/80 mb-3">Filter by Type</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setSelectedType('')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                !selectedType ? 'bg-gold-500/20 text-gold-400' : 'text-white/60 hover:bg-white/10'
                                            }`}
                                        >
                                            All Events
                                        </button>
                                        {Object.entries(eventTypes).map(([key, label]) => (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedType(key)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    selectedType === key ? 'bg-gold-500/20 text-gold-400' : 'text-white/60 hover:bg-white/10'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Featured Events */}
                                {featuredEvents.length > 0 && (
                                    <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-4 backdrop-blur-sm">
                                        <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                                            <SparklesIcon className="h-4 w-4" />
                                            Featured Events
                                        </h3>
                                        <div className="space-y-3">
                                            {featuredEvents.map(event => (
                                                <Link
                                                    key={event.id}
                                                    href={route('calendar.show', event.slug)}
                                                    className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                                >
                                                    <p className="font-medium text-white text-sm">{event.title}</p>
                                                    <p className="text-xs text-white/50 mt-1">{event.displayDate}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Main Calendar */}
                        <div className="flex-1 min-w-0">
                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>
                                <h2 className="text-2xl font-bold text-white">{monthName}</h2>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                                >
                                    <ChevronRightIcon className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                                {/* Day Headers */}
                                <div className="grid grid-cols-7 border-b border-white/10">
                                    {DAYS.map(day => (
                                        <div key={day} className="py-3 text-center text-sm font-medium text-white/60">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Day Cells */}
                                <div className="grid grid-cols-7">
                                    {calendarDays.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`min-h-[100px] p-2 border-b border-r border-white/5 ${
                                                day ? 'hover:bg-white/5' : 'bg-white/[0.02]'
                                            } ${isToday(day || 0) ? 'bg-gold-500/10' : ''}`}
                                        >
                                            {day && (
                                                <>
                                                    <div className={`text-sm font-medium mb-1 ${
                                                        isToday(day) ? 'text-gold-400' : 'text-white/80'
                                                    }`}>
                                                        {day}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {eventsByDay[day]?.slice(0, 2).map(event => (
                                                            <button
                                                                key={event.id}
                                                                onClick={() => setSelectedEvent(event)}
                                                                className={`w-full text-left px-2 py-1 rounded text-xs truncate border ${getEventColorClass(event.color)}`}
                                                            >
                                                                {event.title}
                                                            </button>
                                                        ))}
                                                        {eventsByDay[day]?.length > 2 && (
                                                            <button
                                                                onClick={() => setSelectedEvent(eventsByDay[day][0])}
                                                                className="text-xs text-white/50 hover:text-white"
                                                            >
                                                                +{eventsByDay[day].length - 2} more
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Detail Modal */}
                {selectedEvent && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setSelectedEvent(null)}
                    >
                        <div
                            className="bg-maroon-900 border border-white/10 rounded-xl p-6 w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getEventColorClass(selectedEvent.color)}`}>
                                {selectedEvent.type_label}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                            <p className="text-white/60 text-sm mb-4">{selectedEvent.description}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-white/70">
                                    <CalendarDaysIcon className="h-4 w-4 text-gold-400" />
                                    {selectedEvent.displayDate}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/70">
                                    <ClockIcon className="h-4 w-4 text-gold-400" />
                                    {selectedEvent.time}
                                </div>
                                {selectedEvent.location && (
                                    <div className="flex items-center gap-2 text-sm text-white/70">
                                        <MapPinIcon className="h-4 w-4 text-gold-400" />
                                        {selectedEvent.location}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href={route('calendar.show', selectedEvent.slug)}
                                    className="flex-1 px-4 py-2 rounded-lg bg-gold-500 text-maroon-900 font-semibold text-center hover:bg-gold-400 transition-colors"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:bg-white/10 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
