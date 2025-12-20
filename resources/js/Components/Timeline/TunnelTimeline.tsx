import { useRef, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

/**
 * TunnelTimeline - A Maroon/Gold styled scroll-driven 3D grid tunnel
 * 
 * As the user scrolls, the camera flies forward through a wireframe tunnel,
 * passing floating cards representing timeline events from the database.
 */

// Timeline event data type (from database)
interface TimelineHighlight {
    id: number;
    year: number;
    term_label: string;
    title: string;
    description: string;
    type: string;
    icon: string;
    color: string;
    is_featured: boolean;
}

// Internal event type for rendering
interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    color: 'gold' | 'maroon' | 'white';
}

// Props for the TunnelTimeline component
interface TunnelTimelineProps {
    highlights?: TimelineHighlight[];
}

// Fallback sample data if no highlights provided
const fallbackEvents: TimelineEvent[] = [
    { year: '2024', title: 'Portal Launch', description: 'The CICT Tech Portal officially launches.', color: 'gold' },
    { year: '2023', title: 'Council Digitalization', description: 'Student Council begins digital transformation.', color: 'maroon' },
    { year: '2022', title: 'IT Week Innovation', description: 'First hybrid IT Week event.', color: 'gold' },
];

// Timeline card component
interface TimelineCardProps {
    event: TimelineEvent;
    index: number;
    worldZ: MotionValue<number>;
    total: number;
}

function TimelineCard({ event, index, worldZ }: TimelineCardProps) {
    // FIX: Reduced spacing to 1000px to eliminate visibility gaps
    // This ensures overlapping visibility ranges between cards
    const cardSpacing = 1000;
    const baseZ = -600 - (index * cardSpacing);
    
    // NO SCATTER - strictly centered
    const xOffset = 0;
    const yOffset = 0;
    
    // Calculate card's actual Z position relative to camera
    const cardActualZ = useTransform(worldZ, (wz) => baseZ + wz);
    
    // FIXED visibility window - cards stay visible longer
    // Full opacity from -1000 to 0, quick fade in/out
    const opacity = useTransform(
        cardActualZ, 
        [-1200, -600, -100, 50, 150], 
        [0, 1, 1, 0.5, 0]
    );
    
    // Scale based on distance
    const scale = useTransform(cardActualZ, [-1000, -300, 0], [0.5, 0.85, 1.1]);
    
    // Color scheme
    const colors: Record<string, { accent: string; glow: string; border: string; text: string; bg: string }> = {
// ... existing colors ...
        gold: {
            accent: 'from-gold-400 to-gold-600',
            glow: 'shadow-gold-500/60',
            border: 'border-gold-500/50',
            text: 'text-maroon-900',
            bg: 'bg-maroon-950',
        },
        maroon: {
            accent: 'from-maroon-400 to-maroon-600',
            glow: 'shadow-maroon-400/60',
            border: 'border-maroon-400/50',
            text: 'text-white',
            bg: 'bg-maroon-950',
        },
        white: {
            accent: 'from-white to-gray-200',
            glow: 'shadow-white/40',
            border: 'border-white/50',
            text: 'text-maroon-900',
            bg: 'bg-maroon-950',
        },
    };
    
    const cardColor = colors[event.color] || colors.gold;

    return (
        <motion.div
            className="absolute left-1/2 top-1/2 w-96 pointer-events-auto"
            style={{
                x: '-50%',
                y: '-50%',
                z: cardActualZ, // ANIMATED Z position - this was the bug!
                opacity,
                scale,
                zIndex: 1000 - index, // Force correct stacking order
            }}
        >
            <div className={`
                relative p-8 rounded-2xl
                ${cardColor.bg} backdrop-blur-xl
                border-2 ${cardColor.border}
                shadow-2xl ${cardColor.glow}
                transform-gpu
            `}>
                {/* Glow line at top */}
                <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-gradient-to-r ${cardColor.accent}`} />
                
                {/* Year badge */}
                <div className={`
                    inline-block px-5 py-2 mb-4 rounded-full text-sm font-bold
                    bg-gradient-to-r ${cardColor.accent} ${cardColor.text}
                    shadow-lg
                `}>
                    {event.year}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {event.title}
                </h3>
                
                {/* Description */}
                <p className="text-base text-white/80 leading-relaxed">
                    {event.description}
                </p>
            </div>
        </motion.div>
    );
}

// CLEANER Grid pattern - White/Grey lines on black
const gridPattern = `
    linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
`;

export default function TunnelTimeline({ highlights }: TunnelTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const tunnelSize = 1000;
    const tunnelHalf = tunnelSize / 2;
    
    // Convert database highlights to timeline events
    const timelineEvents = useMemo<TimelineEvent[]>(() => {
        if (!highlights || highlights.length === 0) {
            return fallbackEvents;
        }
        
        return highlights.map((h) => ({
            year: String(h.year),
            title: h.title,
            description: h.description,
            color: (h.color === 'gold' || h.color === 'maroon' || h.color === 'white' 
                ? h.color 
                : (h.is_featured ? 'gold' : 'maroon')) as 'gold' | 'maroon' | 'white',
        }));
    }, [highlights]);
    
    // Extract unique years for the side indicator
    const years = useMemo(() => {
        const seen = new Set<string>();
        return timelineEvents.filter((e) => {
            if (seen.has(e.year)) return false;
            seen.add(e.year);
            return true;
        }).map(e => e.year);
    }, [timelineEvents]);
    
    // Track scroll progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });
    
    // DYNAMIC SCROLLING: Based on number of cards
    // Each card gets 150vh of scroll distance for comfortable viewing
    const vhPerCard = 150;
    const scrollHeight = `${100 + (timelineEvents.length * vhPerCard)}vh`;
    
    // Card spacing in Z-space
    const cardSpacing = 1000;
    
    // Total depth: each card needs to travel through the visibility window
    // Card at index N is at baseZ = -600 - (N * 1000)
    // For it to reach Z = 0 (visible), worldZ must equal |baseZ|
    const totalDepth = 600 + (timelineEvents.length * cardSpacing) + 200;
    
    // Map scroll to world Z position
    const worldZ = useTransform(scrollYProgress, [0, 1], [0, totalDepth]);

    return (
        <div 
            ref={containerRef}
            className="relative bg-black"
            style={{ height: scrollHeight }}
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                
                {/* === NAVIGATION HEADER === */}
                <header className="absolute top-0 left-0 right-0 z-[100] px-6 py-4">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link 
                                    href="/"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-maroon-900/80 border border-gold-500/30 text-white hover:bg-maroon-800 transition-all backdrop-blur-xl"
                                >
                                    <ArrowLeftIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">Back</span>
                                </Link>
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 border border-gold-500/30 overflow-hidden">
                                        <img 
                                            src="/assets/logo/CICT_Logo.svg" 
                                            alt="CICT Logo" 
                                            className="h-8 w-8 object-contain"
                                        />
                                    </div>
                                    <span className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
                                        CICT Tech Portal
                                    </span>
                                </Link>
                            </div>
                            
                            <Link 
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-maroon-900 font-semibold hover:bg-gold-400 transition-all"
                            >
                                <HomeIcon className="w-4 h-4" />
                                <span className="text-sm">Home</span>
                            </Link>
                        </div>
                    </div>
                </header>
                
                {/* Vignette overlay */}
                <div 
                    className="absolute inset-0 z-50 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.9) 100%)',
                    }}
                />
                
                {/* 3D Perspective Container */}
                <div 
                    className="relative w-full h-full flex items-center justify-center"
                    style={{
                        perspective: '800px',
                        perspectiveOrigin: '50% 50%',
                    }}
                >
                    {/* 3D World */}
                    <motion.div
                        className="relative w-full h-full"
                        style={{
                            transformStyle: 'preserve-3d',
                            z: worldZ,
                        }}
                    >
                        {/* === TUNNEL WALLS (Strict Cube) === */}
                        
                        {/* Floor */}
                        <div
                            className="absolute left-1/2 top-1/2"
                            style={{
                                width: '4000px',
                                height: '10000px',
                                transformOrigin: 'center center',
                                transform: `translate(-50%, -50%) translateY(${tunnelHalf}px) rotateX(90deg)`,
                                backgroundSize: '100px 100px',
                                backgroundImage: gridPattern,
                                backfaceVisibility: 'hidden',
                            }}
                        />
                        
                        {/* Ceiling */}
                        <div
                            className="absolute left-1/2 top-1/2"
                            style={{
                                width: '4000px',
                                height: '10000px',
                                transformOrigin: 'center center',
                                transform: `translate(-50%, -50%) translateY(-${tunnelHalf}px) rotateX(90deg) rotateY(180deg)`,
                                backgroundSize: '100px 100px',
                                backgroundImage: gridPattern,
                                backfaceVisibility: 'hidden',
                            }}
                        />
                        
                        {/* Left Wall */}
                        <div
                            className="absolute left-1/2 top-1/2"
                            style={{
                                width: '10000px',
                                height: '1000px',
                                transformOrigin: 'center center',
                                transform: `translate(-50%, -50%) translateX(-${tunnelHalf}px) rotateY(90deg)`,
                                backgroundSize: '100px 100px',
                                backgroundImage: gridPattern,
                                backfaceVisibility: 'hidden',
                            }}
                        />
                        
                        {/* Right Wall */}
                        <div
                            className="absolute left-1/2 top-1/2"
                            style={{
                                width: '10000px',
                                height: '1000px',
                                transformOrigin: 'center center',
                                transform: `translate(-50%, -50%) translateX(${tunnelHalf}px) rotateY(-90deg)`,
                                backgroundSize: '100px 100px',
                                backgroundImage: gridPattern,
                                backfaceVisibility: 'hidden',
                            }}
                        />
                        
                        {/* === TIMELINE CARDS === */}
                        {timelineEvents.map((event, index) => (
                            <TimelineCard
                                key={`${event.year}-${index}`}
                                event={event}
                                index={index}
                                worldZ={worldZ}
                                total={timelineEvents.length}
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
                    </motion.div>
                </div>
                
                {/* UI Overlay - Title */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] text-center">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-white to-gold-400 tracking-tight drop-shadow-lg">
                        CICT TIMELINE
                    </h1>
                    <p className="text-sm text-gold-400/80 mt-2 tracking-[0.5em] uppercase font-bold">
                        Scroll to Navigate
                    </p>
                </div>
                
                {/* === YEAR INDICATORS ON LEFT SIDE === */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2 z-[60] space-y-4">
                    {years.map((year, index) => {
                        const threshold = index / years.length;
                        return (
                            <motion.div
                                key={year}
                                className="flex items-center gap-3"
                                style={{
                                    opacity: useTransform(
                                        scrollYProgress, 
                                        [Math.max(0, threshold - 0.15), threshold, Math.min(1, threshold + 0.15)], 
                                        [0.3, 1, 0.3]
                                    ),
                                }}
                            >
                                <motion.div 
                                    className="w-3 h-3 rounded-full bg-gold-400"
                                    style={{
                                        scale: useTransform(
                                            scrollYProgress,
                                            [Math.max(0, threshold - 0.1), threshold, Math.min(1, threshold + 0.1)],
                                            [0.6, 1.3, 0.6]
                                        ),
                                    }}
                                />
                                <span className="text-sm font-mono font-bold text-white">{year}</span>
                            </motion.div>
                        );
                    })}
                </div>
                
                {/* Progress Bar - Right */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-1 h-64 bg-white/10 rounded-full overflow-hidden z-[60]">
                     <motion.div 
                        className="w-full bg-gold-400"
                        style={{
                            height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
                        }}
                    />
                </div>
                
                {/* Footer CTA */}
                <motion.div 
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[60]"
                    style={{
                        opacity: useTransform(scrollYProgress, [0.9, 1], [0, 1]),
                        pointerEvents: useTransform(scrollYProgress, (val) => val > 0.9 ? 'auto' : 'none') as any,
                    }}
                >
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-500 text-maroon-900 font-bold hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/30 text-lg"
                    >
                        <HomeIcon className="w-6 h-6" />
                        Return to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
