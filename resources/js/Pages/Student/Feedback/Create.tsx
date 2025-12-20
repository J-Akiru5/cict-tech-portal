import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormEventHandler } from 'react';

interface Props {
    categories: Record<string, string>;
    priorities: Record<string, string>;
}

export default function CreateFeedback({ categories, priorities }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        category: 'suggestion',
        subject: '',
        message: '',
        priority: 'medium',
        is_anonymous: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.feedback.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Submit Feedback" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('student.feedback.index')}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            ← Back to My Feedback
                        </Link>
                        <h1 className="text-2xl font-bold text-white mt-4">Submit Feedback</h1>
                        <p className="text-white/60">Share your thoughts, suggestions, or concerns</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Category */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <label className="auth-label">Category</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                                {Object.entries(categories).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setData('category', key)}
                                        className={`rounded-xl border p-3 text-left transition-all ${
                                            data.category === key
                                                ? 'border-gold-500 bg-gold-500/20 text-gold-400'
                                                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="text-lg">{label.split(' ')[0]}</span>
                                        <span className="block text-xs mt-1 opacity-70">
                                            {label.split(' ').slice(1).join(' ')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <label className="auth-label">Subject</label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Brief summary of your feedback"
                                className="auth-input"
                            />
                            {errors.subject && <p className="mt-2 text-sm text-red-400">{errors.subject}</p>}
                        </div>

                        {/* Message */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <label className="auth-label">Message</label>
                            <textarea
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows={5}
                                placeholder="Describe your feedback in detail..."
                                className="auth-input resize-none"
                            />
                            <p className="mt-1 text-xs text-white/40">{data.message.length}/2000 characters</p>
                            {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message}</p>}
                        </div>

                        {/* Priority */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <label className="auth-label">Priority</label>
                            <div className="flex gap-3 mt-2">
                                {Object.entries(priorities).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setData('priority', key)}
                                        className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-all ${
                                            data.priority === key
                                                ? key === 'high'
                                                    ? 'border-red-500 bg-red-500/20 text-red-400'
                                                    : key === 'medium'
                                                    ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                                                    : 'border-green-500 bg-green-500/20 text-green-400'
                                                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Anonymous */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_anonymous}
                                    onChange={(e) => setData('is_anonymous', e.target.checked)}
                                    className="h-5 w-5 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/50"
                                />
                                <div>
                                    <span className="font-medium text-white">Submit anonymously</span>
                                    <p className="text-sm text-white/50">Your name won't be visible to reviewers</p>
                                </div>
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={route('student.feedback.index')}
                                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-3 text-sm font-semibold text-maroon-900 shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
