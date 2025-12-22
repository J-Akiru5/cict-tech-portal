import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';

export default function CreateAnnouncement() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        excerpt: '',
        image: null as File | null,
        priority: 'normal',
        is_published: false,
        is_pinned: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.announcements.store'), {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AdminLayout>
            <Head title="Create Announcement" />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('admin.announcements.index')}
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Announcements
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Create Announcement</h1>
                        <p className="text-white/60">Create a new announcement for students</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    placeholder="Announcement title"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Excerpt (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    placeholder="Brief summary for preview"
                                    maxLength={500}
                                />
                                <p className="mt-1 text-xs text-white/40">{data.excerpt.length}/500 characters</p>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Content
                                </label>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={10}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    placeholder="Write your announcement content here..."
                                />
                                {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content}</p>}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Featured Image (Optional)
                                </label>
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 rounded-lg bg-red-500/80 px-3 py-1 text-sm text-white hover:bg-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-white/40 transition-colors"
                                    >
                                        <PhotoIcon className="h-12 w-12 text-white/20 mx-auto mb-2" />
                                        <p className="text-white/60">Click to upload image</p>
                                        <p className="text-xs text-white/40 mt-1">PNG, JPG, GIF up to 2MB</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Priority
                                </label>
                                <div className="flex gap-4">
                                    {['normal', 'important', 'urgent'].map((priority) => (
                                        <label
                                            key={priority}
                                            className={`flex-1 cursor-pointer rounded-lg border p-3 text-center transition-all ${
                                                data.priority === priority
                                                    ? priority === 'urgent'
                                                        ? 'border-red-500/50 bg-red-500/20 text-red-400'
                                                        : priority === 'important'
                                                        ? 'border-gold-500/50 bg-gold-500/20 text-gold-400'
                                                        : 'border-white/50 bg-white/10 text-white'
                                                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={priority}
                                                checked={data.priority === priority}
                                                onChange={(e) => setData('priority', e.target.value)}
                                                className="sr-only"
                                            />
                                            <span className="capitalize font-medium">{priority}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="rounded border-white/30 bg-white/10 text-gold-500 focus:ring-gold-500/50"
                                    />
                                    <span className="text-sm text-white/80">Publish immediately</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_pinned}
                                        onChange={(e) => setData('is_pinned', e.target.checked)}
                                        className="rounded border-white/30 bg-white/10 text-gold-500 focus:ring-gold-500/50"
                                    />
                                    <span className="text-sm text-white/80">Pin to top</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex items-center justify-end gap-4">
                            <Link
                                href={route('admin.announcements.index')}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-gold-500 px-6 py-2 font-semibold text-maroon-900 transition-all hover:bg-gold-400 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Announcement'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
