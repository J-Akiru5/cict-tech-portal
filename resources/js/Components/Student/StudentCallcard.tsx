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
        name: 'Maroon Gradient',
        style: 'bg-gradient-to-br from-maroon-900 via-maroon-800 to-black',
    },
    gold_marble: {
        name: 'Gold Marble',
        style: 'bg-gradient-to-br from-yellow-900/60 via-gold-600/30 to-maroon-900',
    },
    tech_circuit: {
        name: 'Tech Circuit',
        style: 'bg-gradient-to-br from-slate-900 via-blue-900/40 to-black',
    },
    dark_honeycomb: {
        name: 'Dark Honeycomb',
        style: 'bg-gradient-to-br from-maroon-950 via-black to-maroon-900',
    },
    galaxy: {
        name: 'Galaxy',
        style: 'bg-gradient-to-br from-indigo-950 via-purple-900/50 to-black',
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
        <div className="relative mb-6">
            {/* ID Card Container */}
            <div 
                className={`relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl ${bgPreset.style}`}
            >
                {/* Decorative Pattern Overlay */}
                <div 
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a017' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                
                {/* Glow Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 opacity-60" />
                
                {/* Card Content */}
                <div className="relative z-10 flex items-center gap-6 p-6">
                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-gold-500/50 shadow-lg">
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
                        <h1 className="text-2xl font-bold text-white tracking-tight truncate">
                            {user.name}
                        </h1>
                        
                        {/* Details Line */}
                        <p className="text-white/70 text-sm mt-1 flex flex-wrap items-center gap-x-2">
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
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.classes}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusInfo.label}
                            </span>
                        </div>
                    </div>
                    
                    {/* Customize Button */}
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={() => setShowPresets(!showPresets)}
                            className="p-2 rounded-lg border border-white/20 bg-white/5 text-white/60 hover:bg-white/10 hover:text-gold-400 transition-all"
                            title="Customize Background"
                        >
                            <Cog6ToothIcon className="w-5 h-5" />
                        </button>
                        
                        {/* Presets Dropdown */}
                        {showPresets && (
                            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/20 bg-black/90 backdrop-blur-xl shadow-2xl z-50 overflow-hidden">
                                <div className="p-2">
                                    <p className="text-xs text-white/50 px-2 pb-2 font-semibold uppercase tracking-wider">
                                        Background Presets
                                    </p>
                                    {Object.entries(BACKGROUND_PRESETS).map(([key, preset]) => (
                                        <button
                                            key={key}
                                            onClick={() => changeBackground(key)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                                                currentBackground === key
                                                    ? 'bg-gold-500/20 text-gold-400'
                                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <span className={`w-4 h-4 rounded-full ${preset.style} border border-white/20`} />
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
                
                {/* Bottom Accent Bar */}
                <div className="h-1.5 bg-gradient-to-r from-maroon-700 via-gold-500 to-maroon-700" />
            </div>
        </div>
    );
}
