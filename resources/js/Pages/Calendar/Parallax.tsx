import React, { useRef, useLayoutEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, HomeIcon, CalendarDaysIcon, ChevronDownIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Calendar Horizontal Parallax Timeline
 * 
 * A horizontal timeline layout with vertical scroll triggering horizontal movement.
 * Events are laid out horizontally, but you scroll vertically to navigate.
 */

interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    month: string;
    monthShort: string;
    day: number;
    year: number;
    type: string;
    type_label: string;
    location: string;
    time: string;
    is_featured: boolean;
    is_online: boolean;
    slug: string;
    color: string;
}

interface Props {
    events: CalendarEvent[];
    currentYear: number;
    availableYears: number[];
}

// Event card component with parallax effect
interface EventCardProps {
    event: CalendarEvent;
    index: number;
}

function EventCard({ event, index }: EventCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const colors: Record<string, { bg: string; border: string; accent: string; glow: string }> = {
        gold: { bg: 'from-gold-500/20 to-gold-600/10', border: 'border-gold-500/40', accent: 'text-gold-400', glow: 'shadow-gold-500/20' },
        maroon: { bg: 'from-maroon-500/20 to-maroon-600/10', border: 'border-maroon-400/40', accent: 'text-maroon-300', glow: 'shadow-maroon-500/20' },
        blue: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/40', accent: 'text-blue-400', glow: 'shadow-blue-500/20' },
        purple: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/40', accent: 'text-purple-400', glow: 'shadow-purple-500/20' },
        green: { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/40', accent: 'text-green-400', glow: 'shadow-green-500/20' },
        pink: { bg: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/40', accent: 'text-pink-400', glow: 'shadow-pink-500/20' },
    };

    const cardColor = colors[event.color] || colors.gold;

    useLayoutEffect(() => {
        if (!cardRef.current) return;

        const ctx = gsap.context(() => {
            // Simple fade-in animation without containerAnimation
            gsap.set(cardRef.current, { 
                opacity: 1,
                y: 0,
                scale: 1,
            });
        }, cardRef);

        return () => ctx.revert();
    }, [index]);

    return (
        <div
            ref={cardRef}
            className="flex-shrink-0 w-80"
        >
            <Link
                href={route('calendar.show', event.slug)}
                className={`
                    block relative p-6 rounded-2xl
                    bg-gradient-to-br ${cardColor.bg}
                    border ${cardColor.border}
                    backdrop-blur-xl
                    shadow-2xl ${cardColor.glow}
                    hover:scale-105 transition-transform duration-300
                    group
                `}
            >
                {/* Timeline connector dot */}
                <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                    <div className={`w-4 h-4 rounded-full ${event.is_featured ? 'bg-gold-500' : 'bg-white/30'} ring-4 ring-maroon-950`} />
                </div>

                {/* Date badge */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cardColor.bg} border ${cardColor.border} flex flex-col items-center justify-center`}>
                            <span className={`text-lg font-bold ${cardColor.accent}`}>{event.day}</span>
                            <span className={`text-xs ${cardColor.accent} opacity-80`}>{event.monthShort}</span>
                        </div>
                        <div>
                            <span className={`text-xs font-medium ${cardColor.accent}`}>{event.type_label}</span>
                            {event.is_online && <span className="ml-2 text-xs text-green-400">• Online</span>}
                        </div>
                    </div>
                    {event.is_featured && (
                        <span className="px-2 py-1 rounded-full bg-gold-500 text-maroon-900 text-xs font-bold">
                            ⭐
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/60 line-clamp-2 mb-4">
                    {event.description}
                </p>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {event.time}
                    </span>
                    {event.location && (
                        <span className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            {event.location}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}

// Month marker component
function MonthMarker({ month, year, isFirst }: { month: string; year: number; isFirst?: boolean }) {
    return (
        <div className={`flex-shrink-0 flex flex-col items-center justify-end h-full ${isFirst ? 'pl-8' : 'px-8'}`}>
            <div className="mb-4 text-center">
                <span className="block text-3xl font-bold text-gold-400">{month}</span>
                <span className="text-sm text-white/40">{year}</span>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-gold-500/50 to-transparent" />
        </div>
    );
}

export default function CalendarParallax({ events, currentYear, availableYears }: Props) {
    const [showYearSelect, setShowYearSelect] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const horizontalRef = useRef<HTMLDivElement>(null);

    // Group events by month
    const eventsByMonth = events.reduce((acc, event) => {
        const key = event.month;
        if (!acc[key]) acc[key] = [];
        acc[key].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    const changeYear = (year: number) => {
        router.get(route('calendar.parallax'), { year }, { preserveState: true });
        setShowYearSelect(false);
    };

    // Horizontal scroll driven by vertical scroll
    useLayoutEffect(() => {
        if (!containerRef.current || !scrollContainerRef.current || !horizontalRef.current || events.length === 0) return;

        const horizontal = horizontalRef.current;
        const scrollWidth = horizontal.scrollWidth - window.innerWidth;

        const ctx = gsap.context(() => {
            const tween = gsap.to(horizontal, {
                x: -scrollWidth,
                ease: 'none',
                scrollTrigger: {
                    id: 'horizontal-scroll',
                    trigger: scrollContainerRef.current,
                    start: 'top top',
                    end: () => `+=${scrollWidth}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [events.length]);

    return (
        <>
            <Head title={`Calendar Timeline - ${currentYear}`} />
            
            <div ref={containerRef} className="min-h-screen bg-maroon-950">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-maroon-950/80 backdrop-blur-lg border-b border-gold-500/20">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={route('calendar.index')} className="flex items-center gap-2 text-white/60 hover:text-white">
                                <ArrowLeftIcon className="h-5 w-5" />
                                <span className="hidden sm:inline">Calendar</span>
                            </Link>
                            <Link href={route('home')} className="text-white/40 hover:text-white">
                                <HomeIcon className="h-5 w-5" />
                            </Link>
                        </div>

                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <CalendarDaysIcon className="h-5 w-5 text-gold-400" />
                            Parallax Timeline
                        </h1>

                        {/* Year Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowYearSelect(!showYearSelect)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                                {currentYear}
                                <ChevronDownIcon className="h-4 w-4" />
                            </button>
                            {showYearSelect && (
                                <div className="absolute right-0 mt-2 py-2 w-32 bg-maroon-900 border border-white/10 rounded-lg shadow-xl z-50">
                                    {availableYears.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => changeYear(year)}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                                                year === currentYear ? 'text-gold-400' : 'text-white/70'
                                            }`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {events.length > 0 ? (
                    /* Scroll container */
                    <div ref={scrollContainerRef} className="pt-16">
                        {/* Horizontal scroll container */}
                        <div
                            ref={horizontalRef}
                            className="flex items-end min-h-screen px-8"
                            style={{ paddingBottom: '200px' }}
                        >
                            {/* Timeline base line */}
                            <div className="absolute bottom-[180px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

                            {/* Events grouped by month */}
                            {Object.entries(eventsByMonth).map(([month, monthEvents], monthIndex) => (
                                <div key={month} className="flex items-end">
                                    <MonthMarker month={month} year={currentYear} isFirst={monthIndex === 0} />
                                    <div className="flex gap-8 pb-16">
                                        {monthEvents.map((event, eventIndex) => (
                                            <EventCard
                                                key={event.id}
                                                event={event}
                                                index={monthIndex * 10 + eventIndex}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* End spacer */}
                            <div className="flex-shrink-0 w-screen flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white/40">End of {currentYear}</p>
                                    <p className="text-white/30 mt-2">{events.length} events</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty state */
                    <div className="pt-16 flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <CalendarDaysIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
                            <p className="text-white/50 mb-6">No events scheduled for {currentYear}</p>
                            <Link
                                href={route('calendar.index')}
                                className="px-6 py-3 rounded-lg bg-gold-500 text-maroon-900 font-semibold hover:bg-gold-400 inline-block"
                            >
                                View Calendar
                            </Link>
                        </div>
                    </div>
                )}

                {/* Scroll hint */}
                {events.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                        <p className="text-white/40 text-sm mb-2">Scroll to explore</p>
                        <div className="flex items-center gap-2 text-white/30">
                            <span>↑</span>
                            <div className="w-12 h-1 rounded-full bg-white/20" />
                            <span>↓</span>
                        </div>
                    </div>
                )}

                {/* Footer navigation */}
                <div className="fixed bottom-4 right-4 flex gap-2 z-40">
                    <Link
                        href={route('calendar.index')}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
                    >
                        Grid View
                    </Link>
                    <Link
                        href={route('calendar.timeline')}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
                    >
                        3D Timeline
                    </Link>
                </div>
            </div>
        </>
    );
}
