import { PropsWithChildren, useLayoutEffect } from 'react';
import { Link } from '@inertiajs/react';
import { gsap, ScrollTrigger } from '@/Hooks/useGSAP';

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
                    <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl transition-all duration-300 rotating-border">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-maroon-800 border border-gold-500/30 transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                                <img 
                                    src="/assets/logo/CICT_Logo.svg" 
                                    alt="CICT Logo" 
                                    className="h-9 w-9 object-contain"
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

                            {/* IT Through the Years Dropdown */}
                            <div className="relative group">
                                <button className="text-sm font-medium text-white/70 transition-colors hover:text-white flex items-center gap-1">
                                    History
                                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl py-2 min-w-[180px] shadow-xl">
                                        <Link
                                            href="/it-through-the-years"
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-gold-400 hover:bg-white/5 transition-colors"
                                        >
                                            🏛️ IT Through the Years
                                        </Link>
                                        <Link
                                            href="/achievements"
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-gold-400 hover:bg-white/5 transition-colors"
                                        >
                                            🏆 Achievements
                                        </Link>
                                        <Link
                                            href="/timeline"
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-gold-400 hover:bg-white/5 transition-colors"
                                        >
                                            🚀 3D Timeline
                                        </Link>
                                    </div>
                                </div>
                            </div>

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
            <footer className="bg-black/60 backdrop-blur-xl border-t border-white/5 relative z-10">
                {/* Main Footer Content */}
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                        {/* Column 1: Branding & About */}
                        <div className="lg:col-span-1">
                            <Link href="/" className="flex items-center gap-3 group mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-800 border border-gold-500/30 overflow-hidden">
                                    <img
                                        src="/assets/logo/CICT_Logo.svg"
                                        alt="CICT Logo" 
                                        className="h-10 w-10 object-contain"
                                    />
                                </div>
                                <div>
                                    <span className="block text-lg font-bold text-white">CICT Tech Portal</span>
                                    <span className="block text-xs text-gold-400/70">Student Council</span>
                                </div>
                            </Link>
                            <p className="text-sm text-white/50 leading-relaxed mb-6">
                                The official digital platform of the CICT Student Council, connecting students with announcements, events, and campus resources.
                            </p>

                            {/* University Link */}
                            <a
                                href="https://isufst.edu.ph/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-400/30 transition-all group"
                            >
                                <img
                                    src="/assets/logo/ISUFST_LOGO.png"
                                    alt="ISUFST Logo"
                                    className="h-8 w-8 object-contain"
                                />
                                <div>
                                    <span className="block text-xs text-white/50">Part of</span>
                                    <span className="block text-sm font-medium text-white group-hover:text-gold-400 transition-colors">ISUFST - Dingle Campus</span>
                                </div>
                            </a>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/announcements" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                        Announcements
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/org-chart" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Organization
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/schedule" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Officer Schedule
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cbl" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Constitution & By-Laws
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="https://cict-dingle.onrender.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        CICT Shop
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Resources */}
                        <div>
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-6">Resources</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href={route('login')} className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Student Login
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('register')} className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Register Account
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="https://isufst.edu.ph/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        ISUFST Main Website
                                    </a>
                                </li>
                            </ul>

                            {/* Social Links */}
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mt-8 mb-4">Follow Us</h3>
                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-gold-500/20 hover:border-gold-400/30 hover:text-gold-400 transition-all"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-gold-500/20 hover:border-gold-400/30 hover:text-gold-400 transition-all"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a
                                    href="mailto:cict.council@isufst.edu.ph"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-gold-500/20 hover:border-gold-400/30 hover:text-gold-400 transition-all"
                                    aria-label="Email"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Column 4: Feedback Form */}
                        <div>
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-6">Send Feedback</h3>
                            <p className="text-sm text-white/50 mb-4">
                                Have suggestions or concerns? We'd love to hear from you!
                            </p>
                            <form className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/30 transition-all"
                                />
                                <textarea
                                    placeholder="Your message..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/30 transition-all resize-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    Send Feedback
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 px-6 py-6">
                    <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-xs text-white/40">
                            © 2025 CICT Student Council. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <span className="text-xs text-white/40">
                                Iloilo State University of Fisheries Science and Technology - Dingle Campus
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
