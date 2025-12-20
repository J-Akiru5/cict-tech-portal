import { useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * TunnelTimeline - A Maroon/Gold styled scroll-driven 3D grid tunnel
 * 
 * REFACTORED: Now uses GSAP ScrollTrigger instead of Framer Motion
 * for reliable scroll tracking and animation.
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

// === VISIBILITY CONSTANTS ===
const CARD_SPACING = 1000;     // Z-distance between cards
const FADE_IN_START = -1500;   // Start fading in (far away)
const FADE_IN_END = -500;      // Fully visible here
const FADE_OUT_START = 100;    // Start fading out (passing camera)
const FADE_OUT_END = 600;      // Completely gone
const RUNWAY_BUFFER = 3000;    // Extra depth to ensure last card clears

// === HELPER FUNCTIONS ===
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

// Timeline card component (now using regular divs instead of motion.div)
interface TimelineCardProps {
    event: TimelineEvent;
    index: number;
  worldZ: number;
    total: number;
}

function TimelineCard({ event, index, worldZ, total }: TimelineCardProps) {
  const baseZ = -1000 - (index * CARD_SPACING);
  // actualZ is for visibility calculations (relative to camera)
  // Since parent container moves by worldZ, the effective position is baseZ + worldZ
  const actualZ = baseZ + worldZ;
    
  const opacity = calculateOpacity(actualZ);
  const scale = calculateScale(actualZ);
  const shouldDisplay = actualZ <= FADE_OUT_END && actualZ >= FADE_IN_START - 500;

  // Cards are positioned at their BASE Z (parent handles worldZ movement)
  const cardZ = baseZ;
    
    // Color scheme
  const colors: Record<string, { accent: string; glow: string; border: string; text: string; bg: string }> = {
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

  if (!shouldDisplay) return null;

    return (
      <div
            className="absolute left-1/2 top-1/2 w-96 pointer-events-auto"
            style={{
              // USE cardZ (baseZ) for position - parent container handles worldZ movement
              transform: `translate(-50%, -50%) translateZ(${cardZ}px) scale(${scale})`,
                opacity,
              zIndex: 1000 - index,
              willChange: 'transform, opacity',
            }}
        >
            <div className={`
                relative p-8 rounded-2xl
                ${cardColor.bg}
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
      </div>
    );
}

// Main TunnelTimeline component
export default function TunnelTimeline({ highlights }: TunnelTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
  const [worldZ, setWorldZ] = useState(0);
    
  // Transform database highlights to internal format
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!highlights || highlights.length === 0) return fallbackEvents;
        
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
    
  // Calculate dimensions
  const totalDepth = (timelineEvents.length * CARD_SPACING) + RUNWAY_BUFFER;
  const vhPerCard = 150;
  const scrollHeight = `${100 + (timelineEvents.length * vhPerCard)}vh`;

  // GSAP ScrollTrigger setup
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Smooth 1-second delay
      onUpdate: (self) => {
        // Map scroll progress (0-1) to world Z position
        const newWorldZ = self.progress * totalDepth;
        setWorldZ(newWorldZ);
      },
    });

    // Cleanup
    return () => {
      trigger.kill();
    };
  }, [totalDepth]);
    
  // Calculate current year based on worldZ
  const currentYearIndex = useMemo(() => {
    const cardIndex = Math.floor((worldZ - 500) / CARD_SPACING);
    return Math.max(0, Math.min(cardIndex, timelineEvents.length - 1));
  }, [worldZ, timelineEvents.length]);
    
  // Grid pattern for tunnel walls
  const gridPattern = `
        linear-gradient(rgba(218,165,32,0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(218,165,32,0.15) 1px, transparent 1px)
    `;
    
  const tunnelHalf = 500;

    return (
        <div 
            ref={containerRef}
            className="relative bg-black"
        style={{ height: scrollHeight, position: 'relative' }}
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
                    <span className="text-lg font-bold text-white/90 group-hover:text-gold-400 transition-colors">
                                        CICT Tech Portal
                                    </span>
                                </Link>
                </div>
                            <Link 
                                href="/"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-maroon-900 font-semibold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/25"
                            >
                                <HomeIcon className="w-4 h-4" />
                  <span>Home</span>
                            </Link>
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
                          transform: `translateZ(${worldZ}px)`, // Camera moves forward
                        }}
            >
                        {/* Floor */}
                        <div
                            className="absolute left-1/2 top-1/2"
                            style={{
                                width: '4000px',
                              height: '15000px',
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
                              height: '15000px',
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
                              width: '15000px',
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
                              width: '15000px',
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
            </div>
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
                
          {/* Year Indicator Left side */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-3">
            {years.map((year, index) => (
              <div
                key={year}
                className={`flex items-center gap-3 transition-all duration-300 ${index === currentYearIndex ? 'opacity-100' : 'opacity-40'
                  }`}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentYearIndex
                  ? 'bg-gold-400 shadow-lg shadow-gold-400/50 scale-125'
                  : 'bg-white/30'
                  }`} />
                <span className={`text-sm font-bold transition-all duration-300 ${index === currentYearIndex ? 'text-gold-400' : 'text-white/50'
                  }`}>
                  {year}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll Progress Bar Right side */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[60]">
            <div className="w-1 h-40 bg-white/10 rounded-full overflow-hidden">
              <div
                className="w-full bg-gradient-to-b from-gold-400 to-maroon-500 rounded-full transition-all duration-100"
                style={{ height: `${(worldZ / totalDepth) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* End of Timeline CTA with CICT Logo */}
        <div className="absolute bottom-0 left-0 right-0 h-screen flex items-center justify-center z-[70]">
          <div className="text-center">
            {/* CICT Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src="/assets/logo/CICT_Logo.svg"
                alt="CICT Logo"
                className="w-24 h-24 object-contain opacity-80 drop-shadow-lg"
              />
            </div>
            <p className="text-white/60 text-lg mb-4">End of Timeline</p>
                    <Link 
                        href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 text-maroon-900 font-bold text-lg hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/30"
                    >
              <HomeIcon className="w-5 h-5" />
              Return Home
                    </Link>
          </div>
            </div>
        </div>
    );
}
