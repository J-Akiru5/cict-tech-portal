import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    feedback: {
        id: number;
        subject: string;
        message: string;
        category: string;
        categoryLabel: string;
        priority: string;
        status: string;
        statusLabel: string;
        isAnonymous: boolean;
        response: string | null;
        respondedAt: string | null;
        responderName: string | null;
        createdAt: string;
    };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    in_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function ShowFeedback({ feedback }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title={feedback.subject} />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-2xl">
                    {/* Back Link */}
                    <Link
                        href={route('student.feedback.index')}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                        ← Back to My Feedback
                    </Link>

                    {/* Header */}
                    <div className="mt-6 mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{feedback.categoryLabel.split(' ')[0]}</span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[feedback.status]}`}>
                                {feedback.statusLabel}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">{feedback.subject}</h1>
                        <p className="text-white/50 mt-1">
                            Submitted on {feedback.createdAt}
                            {feedback.isAnonymous && <span className="ml-2">• Submitted anonymously</span>}
                        </p>
                    </div>

                    {/* Message */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm mb-6">
                        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                            Your Message
                        </h3>
                        <p className="text-white whitespace-pre-wrap">{feedback.message}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-white/40">
                            <span>Priority: <span className="text-white/60 capitalize">{feedback.priority}</span></span>
                        </div>
                    </div>

                    {/* Response */}
                    {feedback.response ? (
                        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">💬</span>
                                <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider">
                                    Response
                                </h3>
                            </div>
                            <p className="text-white whitespace-pre-wrap">{feedback.response}</p>
                            <div className="mt-4 text-sm text-white/50">
                                Responded by {feedback.responderName} on {feedback.respondedAt}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                            <div className="text-3xl mb-2">⏳</div>
                            <p className="text-white/50">Awaiting response</p>
                            <p className="text-sm text-white/30 mt-1">
                                You'll be notified when there's an update
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
