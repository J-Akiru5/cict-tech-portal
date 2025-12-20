import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface FeedbackItem {
    id: number;
    subject: string;
    category: string;
    categoryLabel: string;
    priority: string;
    status: string;
    statusLabel: string;
    isAnonymous: boolean;
    hasResponse: boolean;
    createdAt: string;
}

interface Props {
    feedbacks: FeedbackItem[];
    categories: Record<string, string>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    in_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function FeedbackIndex({ feedbacks, categories }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="My Feedback" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">My Feedback</h1>
                            <p className="text-white/60">Track your submissions and responses</p>
                        </div>
                        <Link
                            href={route('student.feedback.create')}
                            className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 text-sm font-semibold text-maroon-900 shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all"
                        >
                            + New Feedback
                        </Link>
                    </div>

                    {/* Feedback List */}
                    {feedbacks.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">💬</div>
                            <h3 className="text-lg font-medium text-white">No feedback yet</h3>
                            <p className="text-white/50 mt-2">
                                Have suggestions or concerns? Let us know!
                            </p>
                            <Link
                                href={route('student.feedback.create')}
                                className="mt-4 inline-block rounded-xl bg-white/10 px-6 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                            >
                                Submit Feedback
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {feedbacks.map((feedback) => (
                                <Link
                                    key={feedback.id}
                                    href={route('student.feedback.show', feedback.id)}
                                    className="block rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-gold-500/30"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">{feedback.categoryLabel.split(' ')[0]}</span>
                                                <span className="text-xs text-white/40 uppercase tracking-wider">
                                                    {feedback.category}
                                                </span>
                                            </div>
                                            <h3 className="font-medium text-white truncate">
                                                {feedback.subject}
                                            </h3>
                                            <p className="text-sm text-white/50 mt-1">
                                                {feedback.createdAt}
                                                {feedback.isAnonymous && (
                                                    <span className="ml-2 text-white/30">• Anonymous</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[feedback.status]}`}>
                                                {feedback.statusLabel}
                                            </span>
                                            {feedback.hasResponse && (
                                                <span className="text-xs text-green-400">Has response</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
