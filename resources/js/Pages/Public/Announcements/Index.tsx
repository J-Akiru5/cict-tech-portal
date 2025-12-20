import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    priority: string;
    is_pinned: boolean;
    published_at: string;
    featured_image: string | null;
    author: {
        id: number;
        name: string;
    };
}

interface Props {
    announcements: {
        data: Announcement[];
        current_page: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: Record<string, string>;
    currentCategory: string;
}

const categoryColors: Record<string, string> = {
    general: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    event: 'bg-gold-500/20 text-gold-300 border-gold-500/30',
    meeting: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    academic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    achievement: 'bg-green-500/20 text-green-300 border-green-500/30',
    urgent: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function AnnouncementsIndex({ announcements, categories, currentCategory }: Props) {
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        router.get('/announcements', { category }, { preserveState: true, replace: true });
    };

    return (
        <PublicLayout>
            <Head title="Announcements" />
            
            <div className="min-h-screen pt-28 pb-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-white md:text-5xl">
                            Announcements
                        </h1>
                        <p className="mt-4 text-lg text-white/60">
                            Stay updated with the latest news from the Student Council
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-10 flex flex-wrap justify-center gap-3">
                        {Object.entries(categories).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => handleCategoryChange(key)}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                    selectedCategory === key
                                        ? 'bg-gold-500 text-maroon-900 shadow-lg shadow-gold-500/30'
                                        : 'border border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Announcements Grid */}
                    {announcements.data.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl text-white/60">No announcements found</h3>
                            <p className="text-white/40 mt-2">Check back later for updates</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {announcements.data.map((announcement) => (
                                <Link
                                    key={announcement.id}
                                    href={`/announcements/${announcement.slug}`}
                                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10 hover:-translate-y-1"
                                >
                                    {/* Pinned Badge */}
                                    {announcement.is_pinned && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-medium text-gold-400">
                                            <span>📌</span> Pinned
                                        </div>
                                    )}

                                    {/* Featured Image */}
                                    {announcement.featured_image && (
                                        <div className="mb-4 overflow-hidden rounded-lg">
                                            <img 
                                                src={announcement.featured_image} 
                                                alt={announcement.title}
                                                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${categoryColors[announcement.category] || categoryColors.general}`}>
                                        {categories[announcement.category] || announcement.category}
                                    </div>

                                    {/* Title */}
                                    <h2 className="mt-4 text-xl font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                                        {announcement.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="mt-3 text-sm text-white/60 line-clamp-3">
                                        {announcement.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="mt-4 flex items-center justify-between text-xs text-white/40">
                                        <span>{announcement.author?.name}</span>
                                        <span>{new Date(announcement.published_at).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {announcements.last_page > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {announcements.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`rounded-lg px-4 py-2 text-sm transition-all ${
                                        link.active
                                            ? 'bg-gold-500 text-maroon-900'
                                            : link.url
                                            ? 'border border-white/20 text-white hover:bg-white/10'
                                            : 'text-white/30 cursor-not-allowed'
                                    }`}
                                    preserveState
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
