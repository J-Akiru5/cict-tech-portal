import { useState, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    MegaphoneIcon,
    CalendarDaysIcon,
    ClipboardDocumentListIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    CircleStackIcon,
    Cog6ToothIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { Toaster } from 'sonner';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    current?: boolean;
    badge?: number;
}

const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Announcements', href: '/admin/announcements', icon: MegaphoneIcon },
    { name: 'Academic Years', href: '/admin/academic-years', icon: CalendarDaysIcon },
    { name: 'Event Calendar', href: '/admin/calendar', icon: CalendarDaysIcon },
    { name: 'Enrollment', href: '/admin/enrollment', icon: ClipboardDocumentListIcon },
    { name: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheckIcon },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: DocumentTextIcon },
    { name: 'Backups', href: '/admin/backups', icon: CircleStackIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage();
    const user = props.auth?.user as { name: string; email: string } | undefined;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return url === '/admin/dashboard' || url === '/admin';
        }
        return url.startsWith(href);
    };

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-maroon-900 font-bold text-lg">C</span>
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="font-bold text-white text-lg leading-tight">CICT</h1>
                        <p className="text-xs text-white/50">Admin Panel</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                                active
                                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                            } ${collapsed ? 'justify-center' : ''}`}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-gold-400' : 'text-white/40 group-hover:text-white/60'}`} />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className={`border-t border-white/10 p-4 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
                {user && (
                    <div className={`flex items-center gap-3 mb-3 ${collapsed ? 'flex-col' : ''}`}>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-maroon-600 to-maroon-800 flex items-center justify-center flex-shrink-0">
                            <UserCircleIcon className="h-6 w-6 text-white/80" />
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-white/50 truncate">{user.email}</p>
                            </div>
                        )}
                    </div>
                )}
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className={`flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors text-sm ${collapsed ? 'justify-center w-full' : ''}`}
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    {!collapsed && <span>Logout</span>}
                </Link>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-maroon-950 via-maroon-900 to-black">
            <Toaster 
                position="top-right"
                toastOptions={{
                    className: 'bg-maroon-950/60 backdrop-blur-2xl border border-white/20 text-white shadow-glass rounded-xl',
                    style: {
                        background: 'rgba(30, 10, 15, 0.7)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    },
                }}
            />
            
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-maroon-900/95 backdrop-blur-lg border-b border-white/10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <span className="text-maroon-900 font-bold">C</span>
                        </div>
                        <span className="font-bold text-white">CICT Admin</span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg text-white/60 hover:bg-white/10"
                    >
                        {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div 
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-maroon-900/98 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    <NavContent />
                </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col fixed top-0 left-0 h-full bg-maroon-900/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-40 ${
                    collapsed ? 'w-20' : 'w-64'
                }`}
            >
                <NavContent />
                
                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-maroon-800 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-maroon-700 transition-colors"
                >
                    {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
                </button>
            </aside>

            {/* Main Content */}
            <main
                className={`transition-all duration-300 pt-16 lg:pt-0 ${
                    collapsed ? 'lg:pl-20' : 'lg:pl-64'
                }`}
            >
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
