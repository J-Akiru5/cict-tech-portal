import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, FormEvent } from 'react';
import GlassPageHeader from '@/Components/GlassPageHeader';
import { 
    ChatBubbleLeftIcon, 
    HeartIcon, 
    HandThumbUpIcon,
    SparklesIcon,
    PaperAirplaneIcon,
    FunnelIcon,
    PlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, HandThumbUpIcon as ThumbSolid } from '@heroicons/react/24/solid';

interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    category_label: string;
    category_icon: string;
    image_url: string | null;
    is_pinned: boolean;
    reactions_count: number;
    comments_count: number;
    user_reaction?: string | null;
    reaction_counts?: Record<string, number>;
    created_at: string;
    author: {
        id: number;
        name: string;
        profile_photo_url?: string;
    };
    academic_year: {
        label: string;
    };
}

interface AchievementPageProps {
    posts: {
        data: Post[];
        links: any;
        current_page: number;
        last_page: number;
    };
    categories: Record<string, string>;
    academicYears: { id: number; label: string }[];
    canPost: boolean;
    filters: { category?: string; year?: string };
    auth?: { user?: { id: number; name: string } };
}

// Reaction emoji mapping
const REACTIONS = {
    like: { emoji: '👍', label: 'Like' },
    love: { emoji: '❤️', label: 'Love' },
    celebrate: { emoji: '🎉', label: 'Celebrate' },
    applaud: { emoji: '👏', label: 'Applaud' },
};

export default function AchievementFeed({ posts, categories, academicYears, canPost, filters, auth }: AchievementPageProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [expandedComments, setExpandedComments] = useState<number[]>([]);

    const handleFilter = (key: string, value: string | undefined) => {
        router.get('/achievements', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleReact = async (postId: number, reactionType: string) => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }
        
        try {
            await fetch(`/achievements/${postId}/react`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ reaction_type: reactionType }),
            });
            router.reload({ only: ['posts'] });
        } catch (e) {
            console.error('Reaction failed', e);
        }
    };

    const toggleComments = (postId: number) => {
        setExpandedComments(prev => 
            prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
        );
    };

    return (
        <PublicLayout>
            <Head title="CICT Achievements" />
            
            <div className="pt-28">
                <GlassPageHeader title="CICT Achievements">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                            <FunnelIcon className="w-5 h-5" />
                        </button>
                        {canPost && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 text-maroon-900 font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Post
                            </button>
                        )}
                    </div>
                </GlassPageHeader>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6 flex flex-wrap gap-4">
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleFilter('category', e.target.value || undefined)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                            >
                                <option value="">All Categories</option>
                                {Object.entries(categories).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            <select
                                value={filters.year || ''}
                                onChange={(e) => handleFilter('year', e.target.value || undefined)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                            >
                                <option value="">All Years</option>
                                {academicYears.map((year) => (
                                    <option key={year.id} value={year.id}>{year.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {posts.data.length === 0 ? (
                            <div className="text-center py-20 text-white/40">
                                <SparklesIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No achievements yet. Be the first to post!</p>
                            </div>
                        ) : (
                            posts.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all"
                                >
                                    {/* Author Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-maroon-600 flex items-center justify-center text-white font-bold">
                                            {post.author.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{post.author.name}</p>
                                            <p className="text-white/40 text-xs">
                                                {new Date(post.created_at).toLocaleDateString()} • {post.academic_year?.label}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            post.category === 'award' ? 'bg-gold-500/20 text-gold-400' :
                                            post.category === 'event' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>
                                            {post.category_icon || '📢'} {post.category_label || post.category}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                                    <p className="text-white/70 leading-relaxed mb-4">{post.content}</p>

                                    {/* Image */}
                                    {post.image_url && (
                                        <div className="rounded-xl overflow-hidden mb-4">
                                            <img src={post.image_url} alt={post.title} className="w-full object-cover" />
                                        </div>
                                    )}

                                    {/* Reactions & Comments */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        {/* Reaction Buttons */}
                                        <div className="flex gap-1">
                                            {Object.entries(REACTIONS).map(([type, { emoji, label }]) => (
                                                <button
                                                    key={type}
                                                    onClick={() => handleReact(post.id, type)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                                                        post.user_reaction === type 
                                                            ? 'bg-gold-500/30 text-gold-400' 
                                                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                                                    }`}
                                                    title={label}
                                                >
                                                    <span>{emoji}</span>
                                                    {post.reaction_counts?.[type] ? (
                                                        <span className="text-xs">{post.reaction_counts[type]}</span>
                                                    ) : null}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Comments Toggle */}
                                        <button
                                            onClick={() => toggleComments(post.id)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-all"
                                        >
                                            <ChatBubbleLeftIcon className="w-4 h-4" />
                                            <span className="text-sm">{post.comments_count} Comments</span>
                                        </button>
                                    </div>

                                    {/* Comments Section (Expanded) */}
                                    {expandedComments.includes(post.id) && (
                                        <CommentSection postId={post.id} isLoggedIn={!!auth?.user} />
                                    )}
                                </article>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="flex justify-center mt-10 gap-2">
                            {Array.from({ length: posts.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`/achievements?page=${page}`}
                                    preserveState
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                                        page === posts.current_page
                                            ? 'bg-gold-500 text-maroon-900'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Create Post Modal */}
            {showCreateModal && canPost && (
                <CreatePostModal onClose={() => setShowCreateModal(false)} categories={categories} />
            )}
        </PublicLayout>
    );
}

// Comment Section Component
function CommentSection({ postId, isLoggedIn }: { postId: number; isLoggedIn: boolean }) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Load comments
    useState(() => {
        fetch(`/achievements/${postId}/comments`)
            .then(res => res.json())
            .then(data => {
                setComments(data.comments || []);
                setLoading(false);
            });
    });

    const submitComment = async (e: FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/achievements/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ content: newComment }),
            });
            const data = await res.json();
            if (data.success) {
                setComments([data.comment, ...comments]);
                setNewComment('');
            }
        } catch (e) {
            console.error('Comment failed', e);
        }
        setSubmitting(false);
    };

    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            {/* Comment Form */}
            {isLoggedIn ? (
                <form onSubmit={submitComment} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm placeholder:text-white/40"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="p-2 rounded-lg bg-gold-500 text-maroon-900 disabled:opacity-50"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            ) : (
                <p className="text-white/40 text-sm mb-4">
                    <Link href="/login" className="text-gold-400 hover:underline">Log in</Link> to comment
                </p>
            )}

            {/* Comments List */}
            {loading ? (
                <p className="text-white/40 text-sm">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-white/40 text-sm">No comments yet. Be the first!</p>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400/50 to-maroon-600/50 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {comment.author?.name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1">
                                <p className="text-white text-sm">
                                    <span className="font-medium">{comment.author?.name}</span>
                                    <span className="text-white/40 text-xs ml-2">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </p>
                                <p className="text-white/70 text-sm">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Create Post Modal
function CreatePostModal({ onClose, categories }: { onClose: () => void; categories: Record<string, string> }) {
    const [form, setForm] = useState({ title: '', content: '', category: 'event', image: null as File | null });
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('category', form.category);
        if (form.image) formData.append('image', form.image);

        router.post('/achievements', formData, {
            onSuccess: () => onClose(),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-maroon-950 border border-white/20 rounded-2xl w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Create Achievement Post</h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
                        <XMarkIcon className="w-6 h-6 text-white" />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-white/60 text-sm mb-1">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-white/60 text-sm mb-1">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        >
                            {Object.entries(categories).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-white/60 text-sm mb-1">Content</label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            required
                            rows={4}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-white/60 text-sm mb-1">Image (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
                            className="w-full text-white/60 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold-500 file:text-maroon-900 file:font-medium"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-2 rounded-lg bg-gold-500 text-maroon-900 font-bold hover:bg-gold-400 disabled:opacity-50"
                        >
                            {submitting ? 'Posting...' : 'Post Achievement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
