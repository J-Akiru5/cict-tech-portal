import { Link } from '@inertiajs/react';
import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/Hooks/useGSAP';
import {
    RocketLaunchIcon,
    CpuChipIcon,
    CalendarDaysIcon,
    DocumentChartBarIcon,
    GlobeAltIcon,
    AcademicCapIcon,
    BuildingOfficeIcon,
    FlagIcon,
    SparklesIcon,
    DocumentTextIcon,
    HeartIcon,
    TrophyIcon,
    LightBulbIcon,
    StarIcon,
} from '@heroicons/react/24/outline';

/**
 * Icon name to component mapping
 */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'rocket-launch': RocketLaunchIcon,
    'cpu-chip': CpuChipIcon,
    'calendar-days': CalendarDaysIcon,
    'document-chart-bar': DocumentChartBarIcon,
    'globe-alt': GlobeAltIcon,
    'academic-cap': AcademicCapIcon,
    'building-office': BuildingOfficeIcon,
    'flag': FlagIcon,
    'sparkles': SparklesIcon,
    'document-text': DocumentTextIcon,
    'heart': HeartIcon,
    'trophy': TrophyIcon,
    'light-bulb': LightBulbIcon,
    'star': StarIcon,
};

/**
 * Color accent to tailwind classes
 */
const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    gold: {
        bg: 'bg-gold-500/20',
        text: 'text-gold-400',
        border: 'border-gold-500/30',
        glow: 'shadow-gold-500/30',
    },
    cyan: {
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        glow: 'shadow-cyan-500/30',
    },
    magenta: {
        bg: 'bg-fuchsia-500/20',
        text: 'text-fuchsia-400',
        border: 'border-fuchsia-500/30',
        glow: 'shadow-fuchsia-500/30',
    },
    purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        glow: 'shadow-purple-500/30',
    },
    green: {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-emerald-500/30',
    },
    red: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/30',
        glow: 'shadow-red-500/30',
    },
};

interface Highlight {
    id: number;
    term_label: string;
    theme: string;
    type: string;
    title: string;
    description: string;
    icon: string;
    accent_color: string;
    is_featured: boolean;
}

interface TermData {
    term: string;
    theme: string;
    highlights: Highlight[];
}

interface ThroughTheYearsPreviewProps {
    terms?: TermData[];
}

// Sample data (will be replaced with real data from API)
const sampleTerms: TermData[] = [
    {
        term: '2024-2025',
        theme: 'Digital Transformation',
        highlights: [
            {
                id: 1,
                term_label: '2024-2025',
                theme: 'Digital Transformation',
                type: 'milestone',
                title: 'CICT Tech Portal Launch',
                description: 'Launched the official digital platform connecting students with announcements, events, and campus resources.',
                icon: 'rocket-launch',
                accent_color: 'gold',
                is_featured: true,
            },
            {
                id: 2,
                term_label: '2024-2025',
                theme: 'Digital Transformation',
                type: 'initiative',
                title: 'AI-Powered Student Assistant',
                description: 'Integrated an AI chatbot to help students navigate campus resources and provide 24/7 support.',
                icon: 'cpu-chip',
                accent_color: 'cyan',
                is_featured: true,
            },
        ],
    },
    {
        term: '2023-2024',
        theme: 'Building Bridges',
        highlights: [
            {
                id: 3,
                term_label: '2023-2024',
                theme: 'Building Bridges',
                type: 'accomplishment',
                title: 'Council Digitalization Initiative',
                description: 'Began digital transformation of student council operations.',
                icon: 'document-chart-bar',
                accent_color: 'gold',
                is_featured: true,
            },
            {
                id: 4,
                term_label: '2023-2024',
                theme: 'Building Bridges',
                type: 'event',
                title: 'First Hybrid IT Week',
                description: 'Successfully organized hybrid IT Week with online and physical activities.',
                icon: 'globe-alt',
                accent_color: 'cyan',
                is_featured: true,
            },
        ],
    },
];

/**
 * ThroughTheYearsPreview - Landing page section showcasing council accomplishments by term
 */
export default function ThroughTheYearsPreview({ terms = sampleTerms }: ThroughTheYearsPreviewProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Animate timeline entries on scroll
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                gsap.fromTo(card,
                    { opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 30 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            end: 'top 60%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            });
        }, section);

        return () => ctx.revert();
    }, [terms]);

    // Flatten highlights and track index for refs
    let cardIndex = 0;

    return (
        <section 
            ref={sectionRef}
            data-scroll-section 
            className="relative py-32 bg-gradient-to-b from-black via-maroon-950/20 to-black overflow-hidden"
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Vertical line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/30 to-transparent" />
                
                {/* Glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div 
                    data-scroll
                    data-scroll-speed="0.2"
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
                        <SparklesIcon className="w-4 h-4 text-gold-400" />
                        <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Our Journey</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        IT{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-white">
                            Through the Years
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-white/50">
                        Celebrating the achievements and milestones of each CICT Student Council term
                    </p>
                </div>

                {/* Timeline */}
                <div ref={timelineRef} className="relative space-y-16">
                    {terms.map((termData, termIndex) => (
                        <div key={termData.term} className="relative">
                            {/* Term Header */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl">
                                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                                        {termData.term}
                                    </div>
                                    <div className="h-8 w-px bg-white/20" />
                                    <div className="text-sm text-white/60">
                                        <span className="text-gold-400">"</span>
                                        {termData.theme}
                                        <span className="text-gold-400">"</span>
                                    </div>
                                </div>
                            </div>

                            {/* Highlights Grid */}
                            <div className="grid gap-6 md:grid-cols-2">
                                {termData.highlights.filter(h => h.is_featured).map((highlight, highlightIndex) => {
                                    const IconComponent = iconMap[highlight.icon] || StarIcon;
                                    const colors = colorMap[highlight.accent_color] || colorMap.gold;
                                    const currentIndex = cardIndex++;

                                    return (
                                        <div
                                            key={highlight.id}
                                            ref={(el) => { cardsRef.current[currentIndex] = el; }}
                                            className={`
                                                group relative p-6 rounded-2xl
                                                bg-white/[0.02] backdrop-blur-sm
                                                border border-white/[0.05]
                                                hover:bg-white/[0.05] hover:border-white/10
                                                transition-all duration-500
                                                hover:-translate-y-1 hover:shadow-2xl ${colors.glow}
                                            `}
                                        >
                                            {/* Icon */}
                                            <div className={`
                                                inline-flex items-center justify-center
                                                w-12 h-12 rounded-xl mb-4
                                                ${colors.bg} ${colors.border} border
                                            `}>
                                                <IconComponent className={`w-6 h-6 ${colors.text}`} />
                                            </div>

                                            {/* Type Badge */}
                                            <span className={`
                                                inline-block px-3 py-1 rounded-full text-xs font-medium mb-3
                                                ${colors.bg} ${colors.text}
                                            `}>
                                                {highlight.type.charAt(0).toUpperCase() + highlight.type.slice(1)}
                                            </span>

                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                                                {highlight.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-white/50 leading-relaxed">
                                                {highlight.description}
                                            </p>

                                            {/* Hover glow */}
                                            <div className={`
                                                absolute -bottom-10 -right-10 w-32 h-32 rounded-full
                                                ${colors.bg} opacity-0 blur-2xl
                                                transition-opacity group-hover:opacity-100
                                            `} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <Link
                        href="/timeline"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-all hover:-translate-y-1"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        Explore Full Timeline
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
