import { Link } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useRef } from 'react';

/**
 * GuestLayout - Immersive glassmorphic layout for authentication pages
 * 
 * Features:
 * - Animated gradient background with floating orbs
 * - Particle-like decorations
 * - Glassmorphic card for auth forms
 * - Subtle grid pattern
 */
export default function Guest({ children }: PropsWithChildren) {
    const orbRef = useRef<HTMLDivElement>(null);

    // Subtle mouse parallax effect on orbs
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!orbRef.current) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-maroon-950 via-maroon-900 to-black px-4 py-12">
            {/* Animated Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated gradient mesh */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold-500/20 via-transparent to-maroon-500/20 animate-pulse" style={{ animationDuration: '4s' }} />
                </div>

                {/* Grid pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(212,160,23,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212,160,23,0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
                
                {/* Floating orbs with parallax */}
                <div ref={orbRef} className="transition-transform duration-500 ease-out">
                    <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-radial from-gold-500/25 via-gold-600/10 to-transparent blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
                    <div className="absolute top-1/3 -right-48 h-[400px] w-[400px] rounded-full bg-gradient-radial from-maroon-500/30 via-maroon-700/15 to-transparent blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                    <div className="absolute -bottom-24 left-1/4 h-[350px] w-[350px] rounded-full bg-gradient-radial from-gold-400/20 via-gold-500/10 to-transparent blur-[90px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
                </div>

                {/* Floating particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-400/40 rounded-full blur-[1px] animate-float" />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-gold-300/30 rounded-full blur-[1px] animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-gold-500/50 rounded-full blur-[0.5px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-gold-400/30 rounded-full blur-[1px] animate-float" style={{ animationDelay: '3s' }} />
            </div>

            {/* Logo */}
            <div className="relative z-10 mb-10">
                <Link href="/" className="group flex flex-col items-center gap-4">
                    {/* Logo with glow ring */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-2xl shadow-gold-500/40 transition-all duration-500 group-hover:scale-110 group-hover:shadow-gold-500/60 group-hover:rotate-3">
                            <img
                                src="/assets/logo/CICT_Logo.svg"
                                alt="CICT Logo" 
                                className="h-14 w-14 object-contain"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-white tracking-tight group-hover:text-gold-400 transition-colors duration-300">
                            CICT Tech Portal
                        </span>
                        <span className="block text-xs text-white/40 mt-1 tracking-wider uppercase">
                            Student Council
                        </span>
                    </div>
                </Link>
            </div>

            {/* Glass Card Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Multi-layer glow behind card */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold-500/15 via-transparent to-maroon-600/15 blur-2xl" />
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-gold-400/10 to-transparent blur-xl" />

                {/* Main card with enhanced glass effect */}
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-2xl">
                    {/* Top accent line with shimmer */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />

                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                    
                    {/* Content */}
                    <div className="relative p-8 sm:p-10">
                        {children}
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-10 text-center">
                <p className="text-sm text-white/30">
                    © 2025 CICT Student Council
                </p>
                <p className="text-xs text-white/20 mt-1">
                    Iloilo State University of Fisheries Science and Technology
                </p>
            </div>
        </div>
    );
}
