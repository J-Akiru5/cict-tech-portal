import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { ChatWidget } from '@/Components/AI/ChatWidget';
import NotificationBell from '@/Components/Notifications/NotificationBell';

/**
 * AuthenticatedLayout - Glassmorphic layout for authenticated users
 * 
 * Features:
 * - Dark maroon gradient background
 * - Glassmorphic navigation bar
 * - Role-aware navigation links
 * - Mobile responsive with slide-out menu
 */
export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Get user initials for avatar fallback
    const initials = user.name
        .split(' ')
        .map((part: string) => part[0]?.toUpperCase() || '')
        .slice(0, 2)
        .join('');

    return (
        <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black">
            {/* Navigation */}
            <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Left side - Logo & Nav Links */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 transition-transform group-hover:scale-110">
                                        <img 
                                            src="/assets/logo/CICT_Logo.svg" 
                                            alt="CICT" 
                                            className="h-7 w-7 object-contain brightness-0 invert"
                                        />
                                    </div>
                                    <span className="hidden sm:block text-sm font-semibold text-white/80 group-hover:text-gold-400 transition-colors">
                                        CICT Portal
                                    </span>
                                </Link>
                            </div>

                            {/* Desktop Nav Links */}
                            <div className="hidden space-x-1 sm:ms-8 sm:flex">
                                <Link
                                    href={route('dashboard')}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        route().current('dashboard') || route().current('*.dashboard')
                                            ? 'bg-white/10 text-gold-400'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/announcements"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Announcements
                                </Link>
                                <Link
                                    href="/bulletin"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Bulletin
                                </Link>
                            </div>
                        </div>

                        {/* Right side - Notifications & User Menu */}
                        <div className="hidden sm:flex sm:items-center sm:gap-2">
                            {/* Notification Bell */}
                            <NotificationBell />

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 transition-colors"
                                >
                                    <img
                                        src={user.photo_url || `https://ui-avatars.com/api/?name=${initials}&background=d4a017&color=7f1d1d&bold=true&size=32`}
                                        alt={user.name}
                                        className="h-8 w-8 rounded-full border border-white/20"
                                    />
                                    <span className="text-white">{user.name}</span>
                                    <svg className="h-4 w-4 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-white/10 bg-maroon-900/95 backdrop-blur-xl shadow-lg">
                                            <div className="py-1">
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="block px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    Your Profile
                                                </Link>
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="block w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    Sign Out
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-white/70 hover:bg-white/10 transition-colors"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-white/10'}>
                    <div className="space-y-1 px-4 py-3">
                        <Link
                            href={route('dashboard')}
                            className="block rounded-lg px-3 py-2 text-base font-medium text-white/70 hover:bg-white/10 hover:text-white"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/announcements"
                            className="block rounded-lg px-3 py-2 text-base font-medium text-white/70 hover:bg-white/10 hover:text-white"
                        >
                            Announcements
                        </Link>
                    </div>

                    <div className="border-t border-white/10 px-4 py-3">
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={user.photo_url || `https://ui-avatars.com/api/?name=${initials}&background=d4a017&color=7f1d1d&bold=true&size=40`}
                                alt={user.name}
                                className="h-10 w-10 rounded-full border border-white/20"
                            />
                            <div>
                                <div className="text-base font-medium text-white">{user.name}</div>
                                <div className="text-sm text-white/50">{user.email}</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Link
                                href={route('profile.edit')}
                                className="block rounded-lg px-3 py-2 text-base font-medium text-white/70 hover:bg-white/10 hover:text-white"
                            >
                                Profile
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-white/70 hover:bg-white/10 hover:text-white"
                            >
                                Sign Out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header (optional) */}
            {header && (
                <header className="border-b border-white/5 bg-black/20">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main>{children}</main>

            {/* AI Chat Widget */}
            <ChatWidget />
        </div>
    );
}
