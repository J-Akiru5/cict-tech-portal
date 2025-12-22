import { ReactNode } from 'react';

interface Props {
    title: string;
    children?: ReactNode;
}

/**
 * GlassPageHeader
 * 
 * Standard page label/header component for consistent visual design.
 * Uses the glassmorphic style cohesive with the public navbar.
 */
export default function GlassPageHeader({ title, children }: Props) {
    return (
        <div className="glass-header backdrop-blur-xl bg-black/30 border-b border-white/10 sticky top-[72px] z-40 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent tracking-tight">
                        {title}
                    </h1>
                    {children && (
                        <div className="flex items-center gap-3">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
