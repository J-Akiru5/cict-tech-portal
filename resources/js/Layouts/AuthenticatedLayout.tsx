import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { ChatWidget } from '@/Components/AI/ChatWidget';
import NotificationBell from '@/Components/Notifications/NotificationBell';
import PrefetchLink from '@/Components/PrefetchLink';
import GlassPageHeader from '@/Components/GlassPageHeader';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

/**
 * AuthenticatedLayout - Glassmorphic layout for authenticated users
 * 
 * Features:
 * - Consistent with PublicLayout design (floating glass navbar)
 * - Role-aware navigation links (Student Portal focus)
 * - Mobile responsive
 */
export default function Authenticated({
    header,
    children,
    user: propUser
}: PropsWithChildren<{ header?: ReactNode; user?: any }>) {
    const user = usePage().props.auth.user || propUser;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Get user initials for avatar fallback
    const initials = user?.name
        ? user.name
            .split(' ')
            .map((part: string) => part[0]?.toUpperCase() || '')
            .slice(0, 2)
            .join('')
        : 'U';

    return (
        <div className="bg-page-core font-sans text-gray-100 antialiased">
            {/* Fixed Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/60 px-6 py-3 backdrop-blur-xl transition-all duration-300 shadow-glass">
                        {/* Left side - Logo & Nav Links */}
                        <div className="flex items-center gap-8">
                            <Link href="/dashboard" className="flex items-center gap-3 group">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 border border-gold-500/30 transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                                    <img
                                        src="/assets/logo/CICT_Logo.svg"
                                        alt="CICT" 
                                        className="h-8 w-8 object-contain"
                                    />
                                </div>
                                <span className="hidden lg:block text-sm font-bold text-white tracking-tight group-hover:text-gold-400 transition-colors">
                                    CICT Student Portal
                                </span>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden md:flex items-center gap-1">
                                <PrefetchLink
                                    href={route('dashboard')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${route().current('dashboard')
                                            ? 'bg-white/10 text-gold-400 shadow-sm'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    Dashboard
                                </PrefetchLink>
                                <PrefetchLink
                                    href={route('student.events.my')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${route().current('student.events.my')
                                            ? 'bg-white/10 text-gold-400 shadow-sm'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    My Events
                                </PrefetchLink>
                                {/* Add more student specific links here if needed */}
                            </div>
                        </div>

                        {/* Right side - Actions */}
                        <div className="flex items-center gap-4">
                            {/* View Public Portal Button */}
                            <a
                                href="/"
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white border border-transparent hover:border-white/10 rounded-lg transition-all"
                                title="View Public Website"
                            >
                                <span>Public Site</span>
                                <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                            </a>

                            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

                            {/* Notification Bell */}
                            <div className="text-white/70 hover:text-white transition-colors">
                                <NotificationBell />
                            </div>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                                >
                                    <img
                                        src={user.photo_url || `https://ui-avatars.com/api/?name=${initials}&background=d4a017&color=7f1d1d&bold=true&size=32`}
                                        alt={user.name}
                                        className="h-8 w-8 rounded-full border border-white/20"
                                    />
                                    <div className="hidden sm:block text-left">
                                        <span className="block text-xs font-medium text-white">{user.name}</span>
                                        <span className="block text-[10px] text-white/50 leading-none">Student</span>
                                    </div>
                                    <svg className={`h-4 w-4 text-white/40 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-glass py-2 z-50">
                                        <div className="px-4 py-2 border-b border-white/5 mb-1">
                                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                            <p className="text-xs text-white/50 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-gold-400 transition-colors"
                                        >
                                            Profile
                                        </Link>

                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                                        >
                                            Log Out
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Hamburger */}
                            <div className="-mr-2 flex items-center md:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 focus:outline-none transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {showingNavigationDropdown && (
                    <div className="md:hidden mt-2 mx-auto max-w-7xl px-4">
                        <div className="rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl overflow-hidden shadow-glass">
                            <div className="space-y-1 p-2">
                                <Link
                                    href={route('dashboard')}
                                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${route().current('dashboard')
                                            ? 'bg-white/10 text-gold-400'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('student.events.my')}
                                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${route().current('student.events.my')
                                            ? 'bg-white/10 text-gold-400'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    My Events
                                </Link>
                            </div>

                            <div className="border-t border-white/10 p-4 bg-white/5">
                                <div className="flex items-center px-2 mb-4">
                                    <div className="shrink-0">
                                        <img
                                            src={user.photo_url || `https://ui-avatars.com/api/?name=${initials}&background=d4a017&color=7f1d1d&bold=true&size=32`}
                                            alt={user.name}
                                            className="h-10 w-10 rounded-full border border-white/20"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-white">{user.name}</div>
                                        <div className="text-sm font-medium text-white/50">{user.email}</div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Link
                                        href={route('profile.edit')}
                                        className="block px-3 py-2 rounded-lg text-base font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/"
                                        className="block px-3 py-2 rounded-lg text-base font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Public Site
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-white/5 transition-colors"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Page Header (Optional) */}
            {header && (
                <div className="pt-24 border-b border-white/0">
                    {/* If header is passed, assume it might not be GlassPageHeader, so wrap it or leave it?
                         Ideally we want consistency. If the child is fully custom, we shouldn't force style.
                         But specific request: "A header bar like glassmorphic label".
                         I'll make sure it uses GlassPageHeader style if it's text.
                         For now, I'll just render it inside a container but let the page control the glass header if they use the component.
                         Actually, usually 'header' prop is used by Breeze to render basic headers.
                         I will Wrap it in a GlassPageHeader-like div if it's not one?
                         Better: Pages should be updated to use GlassPageHeader component directly and pass nothing to 'header' prop?
                         OR I replace the default header render with GlassPageHeader IF it's just a title string?
                         The prop is ReactNode.
                         I'll render it in a container that allows content to flow.
                     */}
                    {/* The Navbar occupies top space. Content starts after it. */}
                </div>
            )}

            {/* If header prop is used, we usually render it. 
                But let's encourage pages to use GlassPageHeader component for the "Header Bar like glassmorphic label".
                So I will render children in Main. 
            */}

            {/* Main Content */}
            <main className="pt-24 min-h-screen">
                {header && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                        {/* We render the header content here to align with standard layout */}
                        {header}
                    </div>
                )}
                {children}
            </main>

            <ChatWidget />
        </div>
    );
}
