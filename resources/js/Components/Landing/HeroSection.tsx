import { Link } from '@inertiajs/react';
import { useRef, useLayoutEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '@/Hooks/useGSAP';
import MouseTrail from './MouseTrail';
import { HexIslands } from '@/Components/HexIslands';

interface HeroSectionProps {
    isLoggedIn: boolean;
}

/**
 * HeroSection - Cinematic Scroll-Triggered Hero
 * 
 * Animation Flow:
 * 1. Initial: Logo centered full-screen with scroll hint
 * 2. On scroll: Logo shrinks, text flies in from sides at different depths
 * 3. Assembly: Text settles into final position
 * 
 * Layer Structure:
 * - z-0: Dark background
 * - z-10: Hex Islands (interactive)
 * - z-20: Vignette/gradients
 * - z-30: Logo
 * - z-40: Content (flies in)
 * - z-50: Scroll hint
 */
export default function HeroSection({ isLoggedIn }: HeroSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const logoContainerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const headlineLeftRef = useRef<HTMLDivElement>(null);
    const headlineRightRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            // Initial state - hide all content elements
            gsap.set([headlineLeftRef.current, headlineRightRef.current, subtitleRef.current, ctaRef.current, badgeRef.current], {
                opacity: 0,
            });

            // Logo starts large and centered
            gsap.set(logoContainerRef.current, {
                scale: 1.5,
            });

            // TIMELINE: Scroll-triggered animation sequence
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '50% top',
                    scrub: 0.8,
                    // markers: true, // Enable for debugging
                }
            });

            // 1. Shrink logo and move up
            scrollTl.to(logoContainerRef.current, {
                scale: 0.6,
                y: -100,
                duration: 1,
            });

            // 2. Hide scroll hint
            scrollTl.to(scrollHintRef.current, {
                opacity: 0,
                y: 50,
                duration: 0.3,
            }, 0);

            // 3. Fly in badge from top
            scrollTl.fromTo(badgeRef.current, 
                { opacity: 0, y: -100 },
                { opacity: 1, y: 0, duration: 0.5 },
                0.3
            );

            // 4. Fly in "YOUR GATEWAY TO" from LEFT
            scrollTl.fromTo(headlineLeftRef.current,
                { opacity: 0, x: -300, rotateY: 30 },
                { opacity: 1, x: 0, rotateY: 0, duration: 0.8 },
                0.4
            );

            // 5. Fly in "STUDENT EXCELLENCE" from RIGHT
            scrollTl.fromTo(headlineRightRef.current,
                { opacity: 0, x: 300, rotateY: -30 },
                { opacity: 1, x: 0, rotateY: 0, duration: 0.8 },
                0.5
            );

            // 6. Fly in subtitle from bottom
            scrollTl.fromTo(subtitleRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.5 },
                0.7
            );

            // 7. Fly in CTA buttons
            scrollTl.fromTo(ctaRef.current,
                { opacity: 0, y: 30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5 },
                0.8
            );

            // Parallax on continued scroll
            const parallaxTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: '40% top',
                    end: 'bottom top',
                    scrub: 0.5,
                }
            });

            parallaxTl.to(logoContainerRef.current, {
                y: -400,
                opacity: 0.3,
                scale: 0.4,
            });

            parallaxTl.to([headlineLeftRef.current, headlineRightRef.current], {
                y: -200,
                opacity: 0,
            }, 0);

            parallaxTl.to(subtitleRef.current, {
                y: -150,
                opacity: 0,
            }, 0);

            parallaxTl.to(ctaRef.current, {
                y: -100,
                opacity: 0,
            }, 0);

            // Badge fades out too
            parallaxTl.to(badgeRef.current, {
                y: -50,
                opacity: 0,
            }, 0);

        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section 
            ref={sectionRef}
            className="relative min-h-[200vh] overflow-hidden bg-black"
        >
            {/* Layer 0: Dark Background */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/assets/images/original_bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.4)',
                }}
            />

            {/* Layer 10: Hex Islands - Interactive - Above logo for hover */}
            <div className="absolute inset-0 z-40">
                <HexIslands tileSize={85} />
            </div>

            {/* Layer 20: Vignette */}
            <div 
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                    background: `
                        radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.6) 80%),
                        linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8) 100%)
                    `
                }}
            />

            {/* Layer 30: Logo Container - Centered Initially, pointer-events-none for hex hover */}
            <div 
                ref={logoContainerRef}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
                <div className="relative">
                    {/* Glow behind logo */}
                    <div className="absolute inset-0 bg-gold-500/30 blur-[100px] rounded-full scale-[2]" />
                    <img 
                        ref={logoRef}
                        src="/assets/images/CICT_logo_animation.gif" 
                        alt="CICT Logo"
                        className="relative h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 object-contain drop-shadow-2xl pointer-events-none"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/assets/logo/CICT_Logo.svg';
                        }}
                    />
                </div>
            </div>

            {/* Layer 50: Content wrapper - Takes up scroll space */}
            <div className="h-screen" /> {/* Spacer for scroll */}
            
            {/* Fixed content container - anchored at bottom center */}
            <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center pb-16 pointer-events-none" style={{ top: '40%' }}>
                {/* Badge */}
                <div 
                    ref={badgeRef}
                    className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold-500/30 bg-black/60 px-6 py-3 backdrop-blur-xl pointer-events-auto"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span>
                    </span>
                    <span className="text-sm font-semibold tracking-widest text-gold-100 uppercase">
                        Welcome to the Future
                    </span>
                </div>

                {/* Headlines - Fly from sides */}
                <div className="text-center perspective-1000">
                    <div 
                        ref={headlineLeftRef}
                        className="text-5xl font-black leading-none tracking-tighter text-white md:text-7xl lg:text-8xl"
                    >
                        YOUR GATEWAY TO
                    </div>
                    <div 
                        ref={headlineRightRef}
                        className="text-5xl font-black leading-none tracking-tighter md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500"
                    >
                        STUDENT EXCELLENCE
                    </div>
                </div>

                {/* Subtitle */}
                <p 
                    ref={subtitleRef}
                    className="mt-8 max-w-2xl text-center text-lg text-white/60 md:text-xl font-light"
                >
                    The official portal of the CICT Student Council.<br className="hidden md:block"/>
                    Stay connected with announcements, events, and your community.
                </p>

                {/* CTA Buttons */}
                <div 
                    ref={ctaRef}
                    className="mt-10 flex flex-col items-center gap-5 sm:flex-row pointer-events-auto"
                >
                    {isLoggedIn ? (
                        <Link
                            href={route('dashboard')}
                            className="group flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-black transition-all hover:bg-gold-400 hover:scale-105"
                        >
                            Enter Portal
                            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('register')}
                                className="flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-black transition-all hover:bg-gold-400 hover:scale-105"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/announcements"
                                className="flex h-14 items-center justify-center rounded-full border border-white/30 px-10 text-lg font-medium text-white transition-all hover:bg-white/10"
                            >
                                Explore
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Layer 50: Scroll Hint - Visible initially, clipped to section */}
            <div 
                ref={scrollHintRef}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50"
            >
                <div className="flex flex-col items-center gap-3 animate-bounce">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/60">Scroll</span>
                    <div className="h-12 w-[1px] bg-gradient-to-b from-white/60 to-transparent" />
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            {/* Mouse Trail */}
            <MouseTrail className="z-[5]" />

            {/* CSS for perspective */}
            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes slowRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
}
