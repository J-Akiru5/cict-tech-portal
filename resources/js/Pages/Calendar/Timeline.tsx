import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, HomeIcon, CalendarDaysIcon, ChevronDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Calendar Tunnel Timeline
 * 
 * A 3D scroll-driven tunnel timeline for university calendar events.
 * Events fly toward the camera as you scroll down.
 * Now matches the TunnelTimeline component with full 3D walls and grid runners.
 */

interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    month: string;
    day: number;
    type: string;
    type_label: string;
    location: string;
    time: string;
    is_featured: boolean;
    is_upcoming: boolean;
    slug: string;
    color: string;
}

interface Props {
    events: CalendarEvent[];
    eventsByMonth: Record<string, CalendarEvent[]>;
    currentYear: number;
    availableYears: number[];
}

// Visibility constants - matched to TunnelTimeline
const CARD_SPACING = 1000;
const FADE_IN_START = -1500;
const FADE_IN_END = -500;
const FADE_OUT_START = 100;
const FADE_OUT_END = 600;
const RUNWAY_BUFFER = 3000;

const calculateOpacity = (z: number): number => {
    if (z < FADE_IN_START) return 0;
    if (z < FADE_IN_END) return (z - FADE_IN_START) / (FADE_IN_END - FADE_IN_START);
    if (z < FADE_OUT_START) return 1;
    if (z < FADE_OUT_END) return 1 - (z - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
    return 0;
};

const calculateScale = (z: number): number => {
    if (z < FADE_IN_START) return 0.5;
    if (z > 0) return 1;
    return 0.5 + 0.5 * ((z - FADE_IN_START) / (0 - FADE_IN_START));
};

// Event card component
interface EventCardProps {
    event: CalendarEvent;
    index: number;
    worldZ: number;
}

function EventCard({ event, index, worldZ }: EventCardProps) {
    const baseZ = -1000 - (index * CARD_SPACING);
    const actualZ = baseZ + worldZ;
    
    const opacity = calculateOpacity(actualZ);
    const scale = calculateScale(actualZ);
    const shouldDisplay = actualZ <= FADE_OUT_END && actualZ >= FADE_IN_START - 500;

    const colors: Record<string, { accent: string; glow: string; border: string }> = {
        gold: { accent: 'from-gold-400 to-gold-600', glow: 'shadow-gold-500/60', border: 'border-gold-500/50' },
        maroon: { accent: 'from-maroon-400 to-maroon-600', glow: 'shadow-maroon-400/60', border: 'border-maroon-400/50' },
        blue: { accent: 'from-blue-400 to-blue-600', glow: 'shadow-blue-500/40', border: 'border-blue-500/50' },
        purple: { accent: 'from-purple-400 to-purple-600', glow: 'shadow-purple-500/40', border: 'border-purple-500/50' },
        green: { accent: 'from-green-400 to-green-600', glow: 'shadow-green-500/40', border: 'border-green-500/50' },
        pink: { accent: 'from-pink-400 to-pink-600', glow: 'shadow-pink-500/40', border: 'border-pink-500/50' },
    };

    const cardColor = colors[event.color] || colors.gold;

    if (!shouldDisplay) return null;

    return (
        <div
            className="absolute left-1/2 top-1/2 w-96 pointer-events-auto"
            style={{
                transform: `translate(-50%, -50%) translateZ(${baseZ}px) scale(${scale})`,
                opacity,
                zIndex: 1000 - index,
                willChange: 'transform, opacity',
            }}
        >
            <div className={`
                relative p-8 rounded-2xl
                bg-maroon-950
                border-2 ${cardColor.border}
                shadow-2xl ${cardColor.glow}
                transform-gpu
            `}>
                {/* Top glow line */}
                <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-gradient-to-r ${cardColor.accent}`} />
                
                {/* Featured badge */}
                {event.is_featured && (
                    <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-gold-500 text-maroon-900 text-xs font-bold shadow-lg">
                        ⭐ Featured
                    </div>
                )}

                {/* Date badge */}
                <div className={`
                    inline-block px-5 py-2 mb-3 rounded-full text-sm font-bold
                    bg-gradient-to-r ${cardColor.accent} text-maroon-900
                    shadow-lg
                `}>
                    {event.month} {event.day}
                </div>

                {/* Time */}
                <p className="text-gold-400/80 text-xs font-medium mb-3 tracking-wide">
                    🕐 {event.time}
                </p>

                {/* Event type */}
                <span className="inline-block px-2 py-1 rounded-md bg-white/10 text-gold-400 text-xs font-medium mb-2">
                    {event.type_label}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-base text-white/80 leading-relaxed mb-4 line-clamp-3">
                    {event.description}
                </p>

                {/* Location */}
                {event.location && (
                    <p className="text-sm text-white/50 mb-4">
                        📍 {event.location}
                    </p>
                )}

                {/* View Details Button */}
                <Link
                    href={route('calendar.show', event.slug)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md shadow-lg"
                >
                    View Details
                    <ArrowRightIcon className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

// Grid Runners for animated neon lines
interface GridRunnersProps {
    instanceId: string;
    count: number;
    length: number;
    cross: number;
    direction: 'vertical' | 'horizontal';
}

const GridRunners = React.memo(({ instanceId, count, length, cross, direction }: GridRunnersProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const runners = useMemo(() => {
        const seed = instanceId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        return Array.from({ length: count }).map((_, i) => {
            const pseudoRandom = ((seed + i * 7919) % 1000) / 1000;
            const colorRandom = ((seed + i * 6971) % 1000) / 1000;
            return {
                id: `${instanceId}-${i}`,
                crossPos: Math.floor(pseudoRandom * (cross / 100)) * 100,
                color: colorRandom > 0.66 ? 'gold' : (colorRandom > 0.33 ? 'maroon' : 'white'),
                speed: (pseudoRandom * 10) + 10,
                delay: pseudoRandom * 10,
                trailLength: (pseudoRandom * 300) + 200,
            };
        });
    }, [instanceId, count, cross]);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            runners.forEach((runner) => {
                const selector = `[data-runner="${runner.id}"]`;
                if (direction === 'vertical') {
                    gsap.to(selector, {
                        y: length,
                        duration: runner.speed,
                        ease: "none",
                        repeat: -1,
                        delay: runner.delay,
                        startAt: { y: -500 },
                    });
                } else {
                    gsap.to(selector, {
                        x: length,
                        duration: runner.speed,
                        ease: "none",
                        repeat: -1,
                        delay: runner.delay,
                        startAt: { x: -500 },
                    });
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [runners, length, direction]);

    const getColors = (color: string) => {
        switch (color) {
            case 'gold': return 'from-yellow-300 via-yellow-500/50 to-transparent shadow-[0_0_15px_rgba(253,224,71,0.6)]';
            case 'maroon': return 'from-red-500 via-maroon-500/50 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.6)]';
            case 'white': return 'from-white via-blue-100/50 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.8)]';
            default: return 'from-gold-400 to-transparent';
        }
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ contain: 'strict' }}
        >
            {runners.map((runner) => (
                <div
                    key={runner.id}
                    data-runner={runner.id}
                    className={`absolute rounded-full bg-gradient-to-b ${getColors(runner.color)} mix-blend-screen`}
                    style={{
                        opacity: 0.9,
                        willChange: 'transform',
                        ...(direction === 'vertical' ? {
                            width: '4px',
                            height: runner.trailLength,
                            left: runner.crossPos - 1,
                            top: -500,
                        } : {
                            height: '4px',
                            width: runner.trailLength,
                            top: runner.crossPos - 1,
                            left: -500,
                            background: `linear-gradient(to right, ${runner.color === 'gold' ? '#fde047' : runner.color === 'maroon' ? '#ef4444' : '#ffffff'}, transparent)`,
                        })
                    }}
                >
                    {direction === 'horizontal' && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${getColors(runner.color)}`} />
                    )}
                </div>
            ))}
        </div>
    );
});

export default function CalendarTimeline({ events, eventsByMonth, currentYear, availableYears }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [worldZ, setWorldZ] = useState(0);
    const [showYearSelect, setShowYearSelect] = useState(false);

    const totalDepth = useMemo(() => {
        return (events.length * CARD_SPACING) + RUNWAY_BUFFER;
    }, [events.length]);

    const vhPerCard = 150;
    const scrollHeight = `${100 + (events.length * vhPerCard)}vh`;
    const gridLength = useMemo(() => Math.max(15000, totalDepth + 5000), [totalDepth]);
    const tunnelHalf = 500;

    // Grid pattern for tunnel walls
    const gridPattern = `
        linear-gradient(rgba(220,20,60,0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(220,20,60,0.4) 1px, transparent 1px),
        linear-gradient(rgba(180,0,0,0.2) 3px, transparent 3px),
        linear-gradient(90deg, rgba(180,0,0,0.2) 3px, transparent 3px)
    `;

    // Extract months for side indicator
    const months = useMemo(() => {
        const seen = new Set<string>();
        return events.filter((e) => {
            if (seen.has(e.month)) return false;
            seen.add(e.month);
            return true;
        }).map(e => e.month);
    }, [events]);

    // Calculate current month based on worldZ
    const currentMonthIndex = useMemo(() => {
        const cardIndex = Math.floor((worldZ - 500) / CARD_SPACING);
        return Math.max(0, Math.min(cardIndex, events.length - 1));
    }, [worldZ, events.length]);

    useLayoutEffect(() => {
        if (!containerRef.current || events.length === 0) return;

        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
                const newZ = self.progress * totalDepth;
                setWorldZ(newZ);
            },
        });

        return () => trigger.kill();
    }, [totalDepth, events.length]);

    const changeYear = (year: number) => {
        router.get(route('calendar.timeline'), { year }, { preserveState: true });
        setShowYearSelect(false);
    };

    return (
        <>
            <Head title={`Event Timeline - ${currentYear}`} />
            
            <div 
                ref={containerRef}
                className="relative bg-black"
                style={{ height: scrollHeight }}
            >
                {/* Sticky viewport */}
                <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                    
                    {/* Navigation Header */}
                    <header className="absolute top-0 left-0 right-0 z-[100] px-6 py-4">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link 
                                        href={route('calendar.index')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-maroon-900/80 border border-gold-500/30 text-white hover:bg-maroon-800 transition-all backdrop-blur-xl"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium hidden sm:inline">Calendar</span>
                                    </Link>
                                    <Link href={route('home')} className="flex items-center gap-3 group">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 border border-gold-500/30 overflow-hidden">
                                            <CalendarDaysIcon className="h-6 w-6 text-gold-400" />
                                        </div>
                                        <span className="text-lg font-bold text-white/90 group-hover:text-gold-400 transition-colors hidden md:inline">
                                            Event Timeline
                                        </span>
                                    </Link>
                                </div>

                                {/* Year Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowYearSelect(!showYearSelect)}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-maroon-900 font-semibold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/25"
                                    >
                                        {currentYear}
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </button>
                                    {showYearSelect && (
                                        <div className="absolute right-0 mt-2 py-2 w-32 bg-maroon-900 border border-white/10 rounded-xl shadow-xl backdrop-blur-xl z-50">
                                            {availableYears.map(year => (
                                                <button
                                                    key={year}
                                                    onClick={() => changeYear(year)}
                                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${
                                                        year === currentYear ? 'text-gold-400 font-bold' : 'text-white/70'
                                                    }`}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Vignette overlay */}
                    <div 
                        className="absolute inset-0 pointer-events-none z-[50]"
                        style={{
                            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
                        }}
                    />

                    {/* 3D Perspective Container */}
                    <div 
                        className="relative w-full h-full flex items-center justify-center"
                        style={{
                            perspective: '1000px',
                            perspectiveOrigin: '50% 50%',
                        }}
                    >
                        {/* 3D World - Moves forward with scroll */}
                        <div
                            className="relative w-full h-full"
                            style={{
                                transformStyle: 'preserve-3d',
                                transform: `translateZ(${worldZ}px)`,
                            }}
                        >
                            {/* Floor */}
                            <div
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    width: '4000px',
                                    height: `${gridLength}px`,
                                    transformOrigin: 'center center',
                                    transform: `translate(-50%, -50%) translateY(${tunnelHalf}px) rotateX(90deg)`,
                                    backgroundSize: '100px 100px',
                                    backgroundImage: gridPattern,
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <GridRunners instanceId="floor-v" count={15} length={gridLength} cross={4000} direction="vertical" />
                                <GridRunners instanceId="floor-h" count={8} length={4000} cross={gridLength} direction="horizontal" />
                            </div>

                            {/* Ceiling */}
                            <div
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    width: '4000px',
                                    height: `${gridLength}px`,
                                    transformOrigin: 'center center',
                                    transform: `translate(-50%, -50%) translateY(-${tunnelHalf}px) rotateX(90deg) rotateY(180deg)`,
                                    backgroundSize: '100px 100px',
                                    backgroundImage: gridPattern,
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <GridRunners instanceId="ceiling-v" count={15} length={gridLength} cross={4000} direction="vertical" />
                                <GridRunners instanceId="ceiling-h" count={8} length={4000} cross={gridLength} direction="horizontal" />
                            </div>

                            {/* Left Wall */}
                            <div
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    width: `${gridLength}px`,
                                    height: '1000px',
                                    transformOrigin: 'center center',
                                    transform: `translate(-50%, -50%) translateX(-${tunnelHalf}px) rotateY(90deg)`,
                                    backgroundSize: '100px 100px',
                                    backgroundImage: gridPattern,
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <GridRunners instanceId="left-wall" count={20} length={gridLength} cross={1000} direction="horizontal" />
                            </div>

                            {/* Right Wall */}
                            <div
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    width: `${gridLength}px`,
                                    height: '1000px',
                                    transformOrigin: 'center center',
                                    transform: `translate(-50%, -50%) translateX(${tunnelHalf}px) rotateY(-90deg)`,
                                    backgroundSize: '100px 100px',
                                    backgroundImage: gridPattern,
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <GridRunners instanceId="right-wall" count={20} length={gridLength} cross={1000} direction="horizontal" />
                            </div>

                            {/* Event Cards */}
                            {events.map((event, index) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    index={index}
                                    worldZ={worldZ}
                                />
                            ))}

                            {/* Horizon Light */}
                            <div
                                className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    transform: 'translateZ(-9000px)',
                                    background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)',
                                    filter: 'blur(80px)',
                                }}
                            />
                        </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] text-center">
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-white to-gold-400 tracking-tight drop-shadow-lg">
                            {currentYear} EVENTS
                        </h1>
                        <p className="text-sm text-gold-400/80 mt-2 tracking-[0.5em] uppercase font-bold">
                            Scroll to Navigate
                        </p>
                    </div>

                    {/* Month Indicator Left */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-3">
                        {months.slice(0, 6).map((month, index) => (
                            <div
                                key={month}
                                className={`flex items-center gap-3 transition-all duration-300 ${
                                    index === Math.floor(currentMonthIndex / Math.max(1, events.length / months.length)) 
                                        ? 'opacity-100' 
                                        : 'opacity-40'
                                }`}
                            >
                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === Math.floor(currentMonthIndex / Math.max(1, events.length / months.length))
                                        ? 'bg-gold-400 shadow-lg shadow-gold-400/50 scale-125'
                                        : 'bg-white/30'
                                }`} />
                                <span className={`text-sm font-bold transition-all duration-300 ${
                                    index === Math.floor(currentMonthIndex / Math.max(1, events.length / months.length))
                                        ? 'text-gold-400'
                                        : 'text-white/50'
                                }`}>
                                    {month}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Scroll Progress Bar */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[60]">
                        <div className="w-1 h-40 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="w-full bg-gradient-to-b from-gold-400 to-maroon-500 rounded-full transition-all duration-100"
                                style={{ height: `${(worldZ / totalDepth) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    {worldZ < 200 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center animate-bounce z-[60]">
                            <p className="text-white/50 text-sm mb-2">Scroll to explore</p>
                            <div className="w-6 h-10 rounded-full border-2 border-white/30 mx-auto flex justify-center">
                                <div className="w-1.5 h-3 bg-gold-400 rounded-full mt-2 animate-pulse" />
                            </div>
                        </div>
                    )}
                </div>

                {/* End of Timeline CTA */}
                <div className="absolute bottom-0 left-0 right-0 h-screen flex items-center justify-center z-[70]">
                    <div className="text-center">
                        <CalendarDaysIcon className="w-20 h-20 text-gold-400/60 mx-auto mb-4" />
                        <p className="text-white/60 text-lg mb-4">End of Timeline</p>
                        <Link 
                            href={route('calendar.index')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 text-maroon-900 font-bold text-lg hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/30"
                        >
                            <HomeIcon className="w-5 h-5" />
                            Back to Calendar
                        </Link>
                    </div>
                </div>

                {/* Empty state */}
                {events.length === 0 && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black z-[100]">
                        <div className="text-center">
                            <CalendarDaysIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">No Events Found</h2>
                            <p className="text-white/50 mb-6">No events scheduled for {currentYear}</p>
                            <Link
                                href={route('calendar.index')}
                                className="px-6 py-3 rounded-lg bg-gold-500 text-maroon-900 font-semibold hover:bg-gold-400"
                            >
                                View Calendar
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
