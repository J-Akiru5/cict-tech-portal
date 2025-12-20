import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface SummarizerProps {
    text: string;
    className?: string;
}

/**
 * Summarizer - AI-powered text summarization component
 * 
 * Features:
 * - One-click TL;DR for announcements
 * - Multiple summary styles (brief, detailed, bullet)
 * - Inline display
 */
export function Summarizer({ text, className = '' }: SummarizerProps) {
    const [summary, setSummary] = useState<string | null>(null);
    const [style, setStyle] = useState<'brief' | 'detailed' | 'bullet'>('brief');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const summarize = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/ai/summarize', {
                text,
                style,
            });

            setSummary(response.data.summary);
            setIsExpanded(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to summarize. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const styleLabels = {
        brief: 'TL;DR',
        detailed: 'Detailed',
        bullet: 'Bullets',
    };

    // Only show if text is long enough to warrant summarization
    if (text.length < 300) {
        return null;
    }

    return (
        <div className={`${className}`}>
            {!summary ? (
                <div className="flex items-center gap-2">
                    <div className="flex border border-white/10 rounded-lg overflow-hidden">
                        {(Object.keys(styleLabels) as Array<keyof typeof styleLabels>).map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setStyle(key)}
                                className={`px-2 py-1 text-xs transition-colors ${
                                    style === key
                                        ? 'bg-purple-500/30 text-purple-300'
                                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                                }`}
                            >
                                {styleLabels[key]}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={summarize}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-xs text-purple-300 hover:bg-purple-500/30 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Summarizing...
                            </>
                        ) : (
                            <>
                                <span>✨</span>
                                Summarize
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-purple-300 flex items-center gap-1">
                                    <span>✨</span>
                                    AI Summary ({styleLabels[style]})
                                </span>
                                <button
                                    onClick={() => {
                                        setSummary(null);
                                        setIsExpanded(false);
                                    }}
                                    className="text-xs text-white/50 hover:text-white transition-colors"
                                >
                                    Hide
                                </button>
                            </div>
                            <p className="text-sm text-white/80 whitespace-pre-wrap">{summary}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {error && (
                <p className="mt-2 text-xs text-red-400">{error}</p>
            )}
        </div>
    );
}

export default Summarizer;
