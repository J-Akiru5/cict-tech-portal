import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    content: string;
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

interface RelatedAnnouncement {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    published_at: string;
    featured_image: string | null;
}

interface Props {
    announcement: Announcement;
    related: RelatedAnnouncement[];
}

const categoryLabels: Record<string, string> = {
    general: 'General',
    event: 'Event',
    meeting: 'Meeting',
    academic: 'Academic',
    achievement: 'Achievement',
    urgent: 'Urgent',
};

const categoryColors: Record<string, string> = {
    general: 'bg-gray-500/20 text-gray-300',
    event: 'bg-gold-500/20 text-gold-300',
    meeting: 'bg-blue-500/20 text-blue-300',
    academic: 'bg-purple-500/20 text-purple-300',
    achievement: 'bg-green-500/20 text-green-300',
    urgent: 'bg-red-500/20 text-red-300',
};

export default function AnnouncementShow({ announcement, related }: Props) {
    const formattedDate = new Date(announcement.published_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <PublicLayout>
            <Head title={announcement.title} />
            
            <article className="min-h-screen pt-28 pb-16">
                <div className="mx-auto max-w-4xl px-6">
                    {/* Back Button */}
                    <Link 
                        href="/announcements"
                        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Announcements
                    </Link>

                    {/* Header */}
                    <header className="mb-10">
                        {/* Category & Priority */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${categoryColors[announcement.category]}`}>
                                {categoryLabels[announcement.category]}
                            </span>
                            {announcement.is_pinned && (
                                <span className="rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-medium text-gold-400">
                                    📌 Pinned
                                </span>
                            )}
                            {announcement.priority === 'high' && (
                                <span className="rounded-full bg-red-500/20 px-4 py-1.5 text-sm font-medium text-red-400">
                                    ⚡ High Priority
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight">
                            {announcement.title}
                        </h1>

                        {/* Meta */}
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/50">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gold-500/20 flex items-center justify-center">
                                    <span className="text-gold-400 text-xs font-bold">
                                        {announcement.author?.name?.[0] || 'A'}
                                    </span>
                                </div>
                                <span>{announcement.author?.name}</span>
                            </div>
                            <span>•</span>
                            <span>{formattedDate}</span>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {announcement.featured_image && (
                        <div className="mb-10 overflow-hidden rounded-2xl border border-white/10">
                            <img 
                                src={announcement.featured_image} 
                                alt={announcement.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div 
                        className="prose prose-invert prose-lg max-w-none
                                   prose-headings:text-white prose-headings:font-semibold
                                   prose-p:text-white/80 prose-p:leading-relaxed
                                   prose-a:text-gold-400 prose-a:no-underline hover:prose-a:underline
                                   prose-strong:text-white prose-strong:font-semibold
                                   prose-ul:text-white/80 prose-ol:text-white/80
                                   prose-li:marker:text-gold-500"
                        dangerouslySetInnerHTML={{ __html: announcement.content }}
                    />

                    {/* Divider */}
                    <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Related Announcements */}
                    {related.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-6">
                                Related Announcements
                            </h2>
                            <div className="grid gap-4 md:grid-cols-3">
                                {related.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/announcements/${item.slug}`}
                                        className="group rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-gold-500/30 hover:bg-white/10"
                                    >
                                        {item.featured_image && (
                                            <img 
                                                src={item.featured_image}
                                                alt={item.title}
                                                className="mb-3 h-24 w-full object-cover rounded-lg"
                                            />
                                        )}
                                        <h3 className="font-medium text-white group-hover:text-gold-400 transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-xs text-white/50">
                                            {new Date(item.published_at).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </article>
        </PublicLayout>
    );
}
