import { PropsWithChildren, useLayoutEffect, useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { gsap, ScrollTrigger } from '@/Hooks/useGSAP';
import PrefetchLink from '@/Components/PrefetchLink';

/**
 * PublicLayout - GSAP-powered layout for public-facing pages
 * 
 * Features:
 * - GSAP ScrollTrigger for smooth animations
 * - Glassmorphic navigation bar (fixed)
 * - Maroon/Gold theme
 * - Accessible dropdowns (click-based with keyboard support)
 * - Mobile hamburger menu
 */
export default function PublicLayout({ children }: PropsWithChildren) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false);

    const orgDropdownRef = useRef<HTMLDivElement>(null);
    const historyDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
                setOrgDropdownOpen(false);
            }
            if (historyDropdownRef.current && !historyDropdownRef.current.contains(event.target as Node)) {
                setHistoryDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdowns on Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOrgDropdownOpen(false);
                setHistoryDropdownOpen(false);
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);
    
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
        <div className="bg-page-core">
            {/* Skip to Content Link - Accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-maroon-900 focus:rounded-lg focus:font-semibold"
            >
                Skip to main content
            </a>

            {/* Fixed Navigation */}
            <nav className="main-navbar fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4" aria-label="Main navigation">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 sm:px-6 py-3 backdrop-blur-xl transition-all duration-300 rotating-border">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-xl bg-maroon-800 border border-gold-500/30 transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                                <img 
                                    src="/assets/logo/CICT_Logo.svg" 
                                    alt=""
                                    aria-hidden="true"
                                    className="h-8 sm:h-9 w-8 sm:w-9 object-contain"
                                />
                            </div>
                            <span className="text-base sm:text-lg font-semibold text-white tracking-tight group-hover:text-gold-400 transition-colors">
                                CICT Tech Portal
                            </span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden items-center gap-6 lg:flex">
                            <PrefetchLink href="/announcements" className="text-sm font-medium text-white/70 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1">
                                Announcements
                            </PrefetchLink>
                            <PrefetchLink href="/calendar" className="text-sm font-medium text-white/70 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1">
                                Calendar
                            </PrefetchLink>

                            {/* Organization Dropdown - Accessible */}
                            <div className="relative" ref={orgDropdownRef}>
                                <button
                                    onClick={() => {
                                        setOrgDropdownOpen(!orgDropdownOpen);
                                        setHistoryDropdownOpen(false);
                                    }}
                                    aria-expanded={orgDropdownOpen}
                                    aria-haspopup="menu"
                                    className="text-sm font-medium text-white/70 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 rounded px-2 py-1 flex items-center gap-1"
                                >
                                    Organization
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${orgDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {orgDropdownOpen && (
                                    <div
                                        className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl py-2 min-w-[180px] shadow-xl"
                                        role="menu"
                                        aria-label="Organization submenu"
                                    >
                                        <PrefetchLink
                                            href="/org-chart"
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-gold-400 hover:bg-white/5 transition-colors focus:bg-white/5 focus:text-gold-400 focus:outline-none"
                                            role="menuitem"
                                            onClick={() => setOrgDropdownOpen(false)}
                                        >
                                            👥 Org Chart
                                        </PrefetchLink>
                                        <PrefetchLink
                                            href="/schedule"
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-gold-400 hover:bg-white/5 transition-colors focus:bg-white/5 focus:text-gold-400 focus:outline-none"
                                            role="menuitem"
                                            onClick={() => setOrgDropdownOpen(false)}
                                        >
                                            📅 Officer Schedule
                                        </PrefetchLink>
                                    </div>
                                )}
                            </div>

                            {/* History Dropdown - Accessible */}
                            <div className="relative" ref={historyDropdownRef}>
                                <button
                                    onClick={() => {
                                        setHistoryDropdownOpen(!historyDropdownOpen);
                                        setOrgDropdownOpen(false);
                                    }}
                                    aria-expanded={historyDropdownOpen}
                                    aria-haspopup="menu"
                                    className="text-sm font-medium text-white/70 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 rounded px-2 py-1 flex items-center gap-1"
                                >
                                    History
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${historyDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {historyDropdownOpen && (
                                    <div
                                        className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl py-2 min-w-[200px] shadow-xl"
                                        role="menu"
                                        aria-label="History submenu"
                                    >
                                        <PrefetchLink
                                            href="/it-through-the-years"
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-gold-400 hover:bg-white/5 transition-colors focus:bg-white/5 focus:text-gold-400 focus:outline-none"
                                            role="menuitem"
                                            onClick={() => setHistoryDropdownOpen(false)}
                                        >
                                            🏛️ IT Through the Years
                                        </PrefetchLink>
                                        <PrefetchLink
                                            href="/achievements"
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-gold-400 hover:bg-white/5 transition-colors focus:bg-white/5 focus:text-gold-400 focus:outline-none"
                                            role="menuitem"
                                            onClick={() => setHistoryDropdownOpen(false)}
                                        >
                                            🏆 Achievements
                                        </PrefetchLink>
                                        <PrefetchLink
                                            href="/timeline"
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-gold-400 hover:bg-white/5 transition-colors focus:bg-white/5 focus:text-gold-400 focus:outline-none"
                                            role="menuitem"
                                            onClick={() => setHistoryDropdownOpen(false)}
                                        >
                                            🚀 3D Timeline
                                        </PrefetchLink>
                                    </div>
                                )}
                            </div>

                            <PrefetchLink
                                href="/cbl"
                                className="text-sm font-medium text-white/70 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 rounded px-2 py-1"
                                title="Constitution & By-Laws"
                            >
                                CBL
                            </PrefetchLink>
                        </div>

                        {/* Right side: Auth buttons + Mobile menu toggle */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Auth Buttons - Hidden on mobile when menu is closed */}
                            <div className="hidden sm:flex items-center gap-3">
                                <Link
                                    href={route('login')}
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2 text-sm font-semibold text-maroon-900 shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-0.5 hover:shadow-gold-500/40 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
                                >
                                    Get Started
                                </Link>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-colors"
                                aria-expanded={mobileMenuOpen}
                                aria-controls="mobile-menu"
                                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div
                            id="mobile-menu"
                            className="lg:hidden mt-2 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl overflow-hidden shadow-xl"
                        >
                            <div className="p-4 space-y-2">
                                <PrefetchLink
                                    href="/announcements"
                                    className="block px-4 py-3 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    📢 Announcements
                                </PrefetchLink>
                                <PrefetchLink
                                    href="/calendar"
                                    className="block px-4 py-3 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    📅 Calendar
                                </PrefetchLink>

                                {/* Organization Section */}
                                <div className="px-4 py-2">
                                    <span className="text-xs font-bold text-gold-400/70 uppercase tracking-wider">Organization</span>
                                </div>
                                <PrefetchLink
                                    href="/org-chart"
                                    className="block px-4 py-2 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors ml-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    👥 Org Chart
                                </PrefetchLink>
                                <PrefetchLink
                                    href="/schedule"
                                    className="block px-4 py-2 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors ml-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    🕐 Officer Schedule
                                </PrefetchLink>

                                {/* History Section */}
                                <div className="px-4 py-2">
                                    <span className="text-xs font-bold text-gold-400/70 uppercase tracking-wider">History</span>
                                </div>
                                <PrefetchLink
                                    href="/it-through-the-years"
                                    className="block px-4 py-2 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors ml-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    🏛️ IT Through the Years
                                </PrefetchLink>
                                <PrefetchLink
                                    href="/achievements"
                                    className="block px-4 py-2 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors ml-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    🏆 Achievements
                                </PrefetchLink>
                                <PrefetchLink
                                    href="/timeline"
                                    className="block px-4 py-2 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors ml-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    🚀 3D Timeline
                                </PrefetchLink>

                                <PrefetchLink
                                    href="/cbl"
                                    className="block px-4 py-3 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    📜 Constitution & By-Laws
                                </PrefetchLink>

                                {/* Mobile Auth Buttons */}
                                <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                                    <Link
                                        href={route('login')}
                                        className="block w-full px-4 py-3 text-center text-base font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block w-full px-4 py-3 text-center text-base font-semibold bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 rounded-xl shadow-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main id="main-content">
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

                        {/* Column 2: Navigation Links */}
                        <div>
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-6">Navigation</h3>
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
                                    <Link href="/calendar" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Calendar
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                            </ul>
                        </div>

                        {/* Column 3: History & Account */}
                        <div>
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-6">History & More</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/it-through-the-years" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        IT Through the Years
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/achievements" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        Achievements
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/timeline" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4 text-gold-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        3D Timeline
                                    </Link>
                                </li>
                            </ul>

                            {/* Account Links */}
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mt-8 mb-4">Account</h3>
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
                            </ul>
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
