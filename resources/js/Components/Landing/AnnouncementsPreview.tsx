import { Link } from '@inertiajs/react';
import { CalendarIcon } from '@heroicons/react/24/outline';

// Sample announcements data (will be replaced with real data from API)
const announcements = [
    {
        id: 1,
        title: 'Welcome Back, CICTzens!',
        excerpt: 'The CICT Student Council welcomes all students for the new semester. Check out our upcoming events and programs.',
        date: 'Dec 19, 2025',
        category: 'General',
    },
    {
        id: 2,
        title: 'IT Week 2025 Registration Open',
        excerpt: 'Register now for IT Week activities including coding competitions, tech talks, and networking events.',
        date: 'Dec 18, 2025',
        category: 'Events',
    },
    {
        id: 3,
        title: 'Council Meeting Minutes',
        excerpt: 'The latest council meeting minutes are now available. Stay informed about current initiatives.',
        date: 'Dec 15, 2025',
        category: 'Updates',
    },
];

/**
 * AnnouncementsPreview - Landing page announcements section
 */
export default function AnnouncementsPreview() {
    return (
        <section 
            data-scroll-section 
            className="relative py-32 bg-gradient-to-b from-black via-maroon-950/30 to-black"
        >
            {/* Background Orb */}
            <div 
                data-scroll
                data-scroll-speed="-1"
                className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-maroon-700/20 to-transparent blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div 
                    data-scroll
                    data-scroll-speed="0.2"
                    className="flex items-end justify-between"
                >
                    <div>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">
                            Latest{' '}
                            <span className="text-gold-400">Announcements</span>
                        </h2>
                        <p className="mt-2 text-white/50">
                            Stay updated with what's happening in CICT
                        </p>
                    </div>
                    <Link 
                        href="/announcements"
                        className="hidden items-center gap-2 text-sm text-gold-400 transition-colors hover:text-gold-300 md:flex"
                    >
                        View all
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Announcements Grid */}
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {announcements.map((announcement, index) => (
                        <article
                            key={announcement.id}
                            data-scroll
                            data-scroll-speed={0.1 * (index + 1)}
                            className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                        >
                            {/* Category Badge */}
                            <span className="inline-flex items-center rounded-full border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-400">
                                {announcement.category}
                            </span>

                            {/* Title */}
                            <h3 className="mt-4 text-lg font-semibold text-white transition-colors group-hover:text-gold-400">
                                {announcement.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="mt-2 line-clamp-2 text-sm text-white/50">
                                {announcement.excerpt}
                            </p>

                            {/* Date */}
                            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                                <CalendarIcon className="h-4 w-4" />
                                {announcement.date}
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-gold-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                        </article>
                    ))}
                </div>

                {/* Mobile View All Link */}
                <div className="mt-8 text-center md:hidden">
                    <Link 
                        href="/announcements"
                        className="inline-flex items-center gap-2 text-sm text-gold-400"
                    >
                        View all announcements
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
