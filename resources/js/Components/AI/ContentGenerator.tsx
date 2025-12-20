import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface ContentGeneratorProps {
    onGenerated?: (content: string) => void;
    defaultType?: 'announcement' | 'event' | 'social';
    buttonClassName?: string;
}

/**
 * ContentGenerator - AI-powered content generation modal
 * 
 * Features:
 * - Generate announcements, event descriptions, social posts
 * - Copy to clipboard / Insert into editor
 * - Regenerate with same or modified prompt
 */
export function ContentGenerator({
    onGenerated,
    defaultType = 'announcement',
    buttonClassName = '',
}: ContentGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<'announcement' | 'event' | 'social'>(defaultType);
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const typeLabels = {
        announcement: { label: 'Announcement', icon: '📢', placeholder: 'E.g., Announce the upcoming coding competition on January 15...' },
        event: { label: 'Event Description', icon: '🎉', placeholder: 'E.g., Tech Talk about AI in Education, guest speaker from Google...' },
        social: { label: 'Social Media Post', icon: '📱', placeholder: 'E.g., Promote the upcoming SC election for engagement...' },
    };

    const generate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setGeneratedContent('');

        try {
            const response = await axios.post('/api/ai/generate', {
                type,
                prompt: prompt.trim(),
            });

            setGeneratedContent(response.data.content);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to generate content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleInsert = () => {
        if (onGenerated) {
            onGenerated(generatedContent);
            setIsOpen(false);
            setGeneratedContent('');
            setPrompt('');
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setGeneratedContent('');
        setError(null);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:from-purple-600 hover:to-pink-600 transition-all ${buttonClassName}`}
            >
                <span>✨</span>
                AI Assist
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={(e) => e.target === e.currentTarget && handleClose()}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-maroon-950 shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">✨</span>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">AI Content Generator</h2>
                                        <p className="text-sm text-white/50">Generate content with AI assistance</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Type Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Content Type</label>
                                    <div className="flex gap-2">
                                        {(Object.keys(typeLabels) as Array<keyof typeof typeLabels>).map((key) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setType(key)}
                                                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-all ${
                                                    type === key
                                                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                                                }`}
                                            >
                                                <span className="mr-2">{typeLabels[key].icon}</span>
                                                {typeLabels[key].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Prompt Input */}
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        What would you like to create?
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={typeLabels[type].placeholder}
                                        rows={3}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none"
                                    />
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={generate}
                                    disabled={!prompt.trim() || isLoading}
                                    className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-medium text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Generating...
                                        </span>
                                    ) : (
                                        'Generate Content'
                                    )}
                                </button>

                                {/* Error */}
                                {error && (
                                    <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                                        {error}
                                    </div>
                                )}

                                {/* Generated Content */}
                                {generatedContent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        <label className="block text-sm font-medium text-white/70">Generated Content</label>
                                        <div className="rounded-lg border border-white/10 bg-white/5 p-4 max-h-64 overflow-y-auto">
                                            <pre className="text-sm text-white whitespace-pre-wrap font-sans">{generatedContent}</pre>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCopy}
                                                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                            >
                                                {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                                            </button>
                                            {onGenerated && (
                                                <button
                                                    onClick={handleInsert}
                                                    className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
                                                >
                                                    ✓ Insert Content
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ContentGenerator;
