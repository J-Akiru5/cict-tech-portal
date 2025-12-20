import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

/**
 * GuestLayout - Glassmorphic layout for authentication pages
 * 
 * Features:
 * - Dark maroon gradient background
 * - Floating orb decorations
 * - Glassmorphic card for auth forms
 */
export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-maroon-950 via-maroon-900 to-black px-4 py-12">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Grid pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }}
                />
                
                {/* Floating orbs */}
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/10 blur-[100px]" />
                <div className="absolute top-1/4 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-maroon-600/30 to-maroon-800/20 blur-[80px]" />
                <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-gold-400/15 to-transparent blur-[80px]" />
            </div>

            {/* Logo */}
            <div className="relative z-10 mb-8">
                <Link href="/" className="group flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold-500/50">
                        <img 
                            src="/assets/logo/CICT_Logo.svg" 
                            alt="CICT Logo" 
                            className="h-12 w-12 object-contain brightness-0 invert filter"
                        />
                    </div>
                    <span className="text-lg font-semibold text-white/80 tracking-tight group-hover:text-gold-400 transition-colors">
                        CICT Tech Portal
                    </span>
                </Link>
            </div>

            {/* Glass Card Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Glow behind card */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold-500/10 via-transparent to-maroon-600/10 blur-xl opacity-50" />
                
                {/* Main card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
                    
                    {/* Content */}
                    <div className="p-8">
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-8 text-center">
                <p className="text-sm text-white/30">
                    © 2025 CICT Student Council
                </p>
            </div>
        </div>
    );
}
