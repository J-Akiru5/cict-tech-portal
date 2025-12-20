import { PropsWithChildren, useLayoutEffect } from 'react';
import { Link } from '@inertiajs/react';
import { gsap, ScrollTrigger } from '../hooks/useGSAP';

/**
 * PublicLayout - GSAP-powered layout for public-facing pages
 * 
 * Features:
 * - GSAP ScrollTrigger for smooth animations
 * - Glassmorphic navigation bar (fixed)
 * - Maroon/Gold theme
 */
export default function PublicLayout({ children }: PropsWithChildren) {
    
    useLayoutEffect(() => {
        // Initialize GSAP ScrollTrigger with smooth defaults
        ScrollTrigger.defaults({
            markers: false, // Set to true for debugging
        });

        // Navbar hide/show on scroll
        const navbar = document.querySelector('.main-navbar');
        if (navbar) {
            let lastScrollY = 0;
            ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                onUpdate: (self) => {
                    const scrollY = self.scroll();
                    const direction = scrollY > lastScrollY ? 'down' : 'up';
                    
                    if (direction === 'down' && scrollY > 200) {
                        gsap.to(navbar, { y: -100, duration: 0.3 });
                    } else {
                        gsap.to(navbar, { y: 0, duration: 0.3 });
                    }
                    lastScrollY = scrollY;
                },
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black">
            {/* Fixed Navigation */}
            <nav className="main-navbar fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl transition-all duration-300">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 transition-transform duration-300 group-hover:scale-110">
                                <img 
                                    src="/assets/logo/CICT_Logo.svg" 
                                    alt="CICT Logo" 
                                    className="h-8 w-8 object-contain brightness-0 invert filter"
                                />
                            </div>
                            <span className="text-lg font-semibold text-white tracking-tight group-hover:text-gold-400 transition-colors">
                                CICT Tech Portal
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden items-center gap-8 md:flex">
                            <Link href="/announcements" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                                Announcements
                            </Link>
                            <Link href="/org-chart" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                                Organization
                            </Link>
                            <Link href="/schedule" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                                Schedule
                            </Link>
                            <Link href="/cbl" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                                CBL
                            </Link>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('login')}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white hover:bg-white/5"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2 text-sm font-semibold text-maroon-900 shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-0.5 hover:shadow-gold-500/40"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-black/40 px-6 py-12 relative z-10">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 transition-transform group-hover:rotate-12">
                                <img 
                                    src="/assets/logo/CICT_Logo.svg" 
                                    alt="CICT Logo" 
                                    className="h-6 w-6 object-contain brightness-0 invert filter"
                                />
                            </div>
                            <span className="text-sm font-medium text-white/60 group-hover:text-gold-400 transition-colors">
                                CICT Student Council
                            </span>
                        </Link>
                        <p className="text-sm text-white/40">
                            © 2025 CICT Student Council - ISUFST Dingle Campus
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
