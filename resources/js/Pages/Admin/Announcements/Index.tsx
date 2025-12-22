import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon,
    FunnelIcon,
    MegaphoneIcon,
    EyeIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface Announcement {
    id: number;
    title: string;
    excerpt: string | null;
    priority: 'normal' | 'important' | 'urgent';
    is_published: boolean;
    is_pinned: boolean;
    published_at: string | null;
    archived_at: string | null;
    created_at: string;
    author: { name: string } | null;
}

interface Props {
    announcements: {
        data: Announcement[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function AnnouncementsIndex({ announcements, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.announcements.index'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        router.delete(route('admin.announcements.destroy', id), {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const handlePublish = (id: number) => {
        router.post(route('admin.announcements.publish', id));
    };

    const handleArchive = (id: number) => {
        router.post(route('admin.announcements.archive', id));
    };

    const getPriorityBadge = (priority: string) => {
        const badges: Record<string, string> = {
            'normal': 'bg-white/10 text-white/60 border-white/20',
            'important': 'bg-gold-500/20 text-gold-400 border-gold-500/30',
            'urgent': 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return badges[priority] || badges.normal;
    };

    const getStatusBadge = (announcement: Announcement) => {
        if (announcement.archived_at) {
            return { label: 'Archived', class: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
        }
        if (announcement.is_published) {
            return { label: 'Published', class: 'bg-green-500/20 text-green-400 border-green-500/30' };
        }
        return { label: 'Draft', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    };

    return (
        <AdminLayout>
            <Head title="Announcement Management" />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Announcements</h1>
                            <p className="text-white/60">Manage announcements and notices</p>
                        </div>
                        <Link
                            href={route('admin.announcements.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 font-semibold text-maroon-900 transition-all hover:bg-gold-400"
                        >
                            <PlusIcon className="h-5 w-5" />
                            New Announcement
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 backdrop-blur-sm">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Search announcements..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FunnelIcon className="h-5 w-5 text-white/40" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                >
                                    <option value="">All Status</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
                            >
                                Filter
                            </button>
                        </form>
                    </div>

                    {/* Announcements Table */}
                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="border-b border-white/10 bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Priority</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Author</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80">Date</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/80">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {announcements.data.map((announcement) => {
                                    const status = getStatusBadge(announcement);
                                    return (
                                        <tr key={announcement.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{announcement.title}</p>
                                                    {announcement.excerpt && (
                                                        <p className="text-sm text-white/50 truncate max-w-md">{announcement.excerpt}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(announcement.priority)}`}>
                                                    {announcement.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${status.class}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white/60">
                                                {announcement.author?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-white/60">
                                                {new Date(announcement.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!announcement.is_published && !announcement.archived_at && (
                                                        <button
                                                            onClick={() => handlePublish(announcement.id)}
                                                            className="rounded-lg p-2 text-green-400 hover:bg-green-500/20 transition-colors"
                                                            title="Publish"
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    {announcement.is_published && !announcement.archived_at && (
                                                        <button
                                                            onClick={() => handleArchive(announcement.id)}
                                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-500/20 transition-colors"
                                                            title="Archive"
                                                        >
                                                            <ArchiveBoxIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={route('admin.announcements.edit', announcement.id)}
                                                        className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </Link>
                                                    {deleteConfirm === announcement.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleDelete(announcement.id)}
                                                                className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/20"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(announcement.id)}
                                                            className="rounded-lg p-2 text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {announcements.data.length === 0 && (
                            <div className="p-12 text-center">
                                <MegaphoneIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No Announcements</h3>
                                <p className="text-white/60 mb-4">Create your first announcement to get started.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {announcements.last_page > 1 && (
                            <div className="border-t border-white/10 px-6 py-4 flex justify-center gap-2">
                                {announcements.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-gold-500 text-maroon-900'
                                                : link.url
                                                ? 'text-white/60 hover:bg-white/10'
                                                : 'text-white/30 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
