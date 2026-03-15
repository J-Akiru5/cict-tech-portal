import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Cog6ToothIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface StudentCallcardProps {
    user: {
        name: string;
        student_id: string | null;
        course: string | null;
        year_level: string | null;
        section: string | null;
        photo_url: string;
        callcard_background: string;
    };
    enrollmentStatus: string;
}

/**
 * Background preset configurations
 */
const BACKGROUND_PRESETS: Record<string, { name: string; style: string }> = {
    default: {
        name: 'Maroon Glass',
        style: 'bg-gradient-to-br from-maroon-900/80 via-maroon-900/60 to-black/80',
    },
    gold_marble: {
        name: 'Gold Glass',
        style: 'bg-gradient-to-br from-yellow-900/60 via-gold-600/20 to-maroon-900/60',
    },
    tech_circuit: {
        name: 'Tech Glass',
        style: 'bg-gradient-to-br from-slate-900/80 via-blue-900/30 to-black/80',
    },
    dark_honeycomb: {
        name: 'Obsidian Glass',
        style: 'bg-gradient-to-br from-maroon-950/90 via-black/80 to-maroon-900/90',
    },
    galaxy: {
        name: 'Cosmic Glass',
        style: 'bg-gradient-to-br from-indigo-950/80 via-purple-900/30 to-black/80',
    },
};

/**
 * Get enrollment status display info
 */
function getEnrollmentStatusInfo(status: string) {
    switch (status) {
        case 'enrolled':
            return {
                label: 'ENROLLED',
                icon: CheckCircleIcon,
                classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            };
        case 'pending':
            return {
                label: 'PENDING',
                icon: ClockIcon,
                classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            };
        default:
            return {
                label: 'NOT ENROLLED',
                icon: XCircleIcon,
                classes: 'bg-red-500/20 text-red-400 border-red-500/30',
            };
    }
}

/**
 * StudentCallcard - Horizontal ID Card Style Component
 * 
 * Features:
 * - Horizontal ID card layout with photo on left
 * - Student info display (name, ID, course, year, section)
 * - Enrollment status badge
 * - Customizable background with presets
 */
export default function StudentCallcard({ user, enrollmentStatus }: StudentCallcardProps) {
    const [showPresets, setShowPresets] = useState(false);
    const [currentBackground, setCurrentBackground] = useState(user.callcard_background || 'default');
    
    const statusInfo = getEnrollmentStatusInfo(enrollmentStatus);
    const StatusIcon = statusInfo.icon;
    const bgPreset = BACKGROUND_PRESETS[currentBackground] || BACKGROUND_PRESETS.default;
    
    // Handle background change
    const changeBackground = (preset: string) => {
        setCurrentBackground(preset);
        setShowPresets(false);
        
        // Save to server
        router.patch('/student/profile/callcard-background', { callcard_background: preset }, {
            preserveScroll: true,
            only: [],
        });
    };

    return (
        <div className="relative mb-6" style={{ zIndex: 30 }}>
            {/* Glass Background Layer (Clipped) */}
            <div className={`absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-3xl transition-all duration-500 ${bgPreset.style}`}>
                {/* Decorative Pattern Overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Content Layer (Visible Overflow for Dropdown) */}
            <div className="relative z-10 p-8 flex items-center gap-6">
                {/* Photo */}
                <div className="relative flex-shrink-0">
                    <div className="w-28 h-32 rounded-xl overflow-hidden border-2 border-gold-500/50 shadow-lg">
                        <img
                            src={user.photo_url}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Photo Frame Decoration */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-[10px] font-bold text-maroon-900">CICT</span>
                    </div>
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h1 className="text-3xl font-bold text-white tracking-tight truncate drop-shadow-md">
                        {user.name}
                    </h1>

                    {/* Details Line */}
                    <p className="text-white/80 text-sm mt-1 flex flex-wrap items-center gap-x-2 font-medium">
                        {user.student_id && (
                            <span className="font-mono text-gold-400">{user.student_id}</span>
                        )}
                        {user.course && (
                            <>
                                <span className="text-white/30">•</span>
                                <span>{user.course}</span>
                            </>
                        )}
                        {user.year_level && (
                            <>
                                <span className="text-white/30">•</span>
                                <span>{user.year_level}</span>
                            </>
                        )}
                        {user.section && (
                            <>
                                <span className="text-white/30">•</span>
                                <span>Section {user.section}</span>
                            </>
                        )}
                    </p>

                    {/* Enrollment Status Badge */}
                    <div className="mt-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${statusInfo.classes}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusInfo.label}
                        </span>
                    </div>
                </div>

                {/* Customize Button */}
                <div className="relative flex-shrink-0">
                    <button
                        onClick={() => setShowPresets(!showPresets)}
                        className="p-2 rounded-lg border border-white/20 bg-white/10 text-white/70 hover:bg-white/20 hover:text-gold-400 transition-all backdrop-blur-md shadow-lg"
                        title="Customize Background"
                    >
                        <Cog6ToothIcon className="w-5 h-5" />
                    </button>

                    {/* Presets Dropdown - Now outside the overflow-hidden container effectively, because the container is separate */}
                    {showPresets && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/20 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden" style={{ zIndex: 9999 }}>
                            <div className="p-2">
                                <p className="text-xs text-white/50 px-2 pb-2 font-semibold uppercase tracking-wider">
                                    Background Presets
                                </p>
                                {Object.entries(BACKGROUND_PRESETS).map(([key, preset]) => (
                                    <button
                                        key={key}
                                        onClick={() => changeBackground(key)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${currentBackground === key
                                                ? 'bg-gold-500/20 text-gold-400'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <span className={`w-4 h-4 rounded-full border border-white/20 ${preset.style}`} />
                                        {preset.name}
                                        {currentBackground === key && (
                                            <CheckCircleIcon className="w-4 h-4 ml-auto text-gold-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
