import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/Hooks/useGSAP';
import { 
    MegaphoneIcon, 
    CalendarDaysIcon, 
    UserGroupIcon, 
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const features = [
    {
        icon: MegaphoneIcon,
        title: 'Announcements',
        description: 'Stay updated with the latest news, events, and important notices from the CICT Student Council.',
    },
    {
        icon: CalendarDaysIcon,
        title: 'Events & Programs',
        description: 'Track upcoming events, seminars, and activities. Never miss an opportunity to participate.',
    },
    {
        icon: UserGroupIcon,
        title: 'Organization',
        description: 'Meet your student council officers and learn about their roles and responsibilities.',
    },
    {
        icon: ChatBubbleLeftRightIcon,
        title: 'AI Assistant',
        description: 'Get instant answers to your questions with our intelligent chatbot assistant.',
    },
    {
        icon: DocumentTextIcon,
        title: 'CBL Access',
        description: 'Read and understand the Constitution and By-Laws of the CICT Student Council.',
    },
    {
        icon: ClipboardDocumentCheckIcon,
        title: 'Attendance',
        description: 'Track your attendance for events and programs. Stay accountable and engaged.',
    },
];

/**
 * FeaturesSection - Parallax split layout
 * 
 * Left: Sticky section label
 * Right: Glassmorphic container with scrolling content inside
 */
export default function FeaturesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Animate each feature content as it comes into view
            contentRefs.current.forEach((content, index) => {
                if (!content) return;

                gsap.fromTo(content,
                    { 
                        opacity: 0, 
                        y: 60,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: content,
                            start: 'top 80%',
                            end: 'top 40%',
                            scrub: 0.5,
                        }
                    }
                );
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section 
            ref={sectionRef}
            className="relative min-h-screen bg-gradient-to-b from-black via-maroon-900/40 to-black"
        >

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
                {/* Split Layout: Left sticky label + Right scrolling content */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    
                    {/* Left Side - Sticky Label */}
                    <div 
                        ref={labelRef}
                        className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start"
                    >
                        <div className="mb-4">
                            <span className="text-sm font-semibold tracking-widest text-gold-400 uppercase">
                                Features
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold text-white lg:text-5xl">
                            Everything you need,{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
                                in one place
                            </span>
                        </h2>
                        <p className="mt-6 text-lg text-white/50 leading-relaxed">
                            A comprehensive portal designed to streamline communication and 
                            engagement between students and the CICT Student Council.
                        </p>
                    </div>

                    {/* Right Side - Glassmorphic Container with Scrolling Features */}
                    <div 
                        ref={containerRef}
                        className="lg:w-2/3"
                    >
                        {/* Glassmorphic Container */}
                        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 lg:p-12">
                            {/* Features list - each animates on scroll */}
                            <div className="space-y-12">
                                {features.map((feature, index) => (
                                    <div
                                        key={feature.title}
                                        ref={el => contentRefs.current[index] = el}
                                        className="group flex gap-6 items-start"
                                    >
                                        {/* Icon */}
                                        <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/5 ring-1 ring-white/10 group-hover:ring-gold-500/30 transition-all">
                                            <feature.icon className="h-7 w-7 text-gold-400" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-2 text-white/50 leading-relaxed">
                                                {feature.description}
                                            </p>
                                            
                                            {/* Learn more link */}
                                            <a 
                                                href="#" 
                                                className="inline-flex items-center mt-4 text-sm text-gold-400/70 hover:text-gold-400 transition-colors"
                                            >
                                                <span>Learn more</span>
                                                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
