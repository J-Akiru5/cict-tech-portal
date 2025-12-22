import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { motion } from 'framer-motion';
import GlassPageHeader from '@/Components/GlassPageHeader';
import { UserCircleIcon, SparklesIcon, TrophyIcon, CalendarIcon, StarIcon } from '@heroicons/react/24/outline';

interface President {
    name: string;
    photo_url: string | null;
    position: string;
}

interface Highlight {
    id: number;
    title: string;
    description: string;
    type: string;
    icon: string;
}

interface AcademicYear {
    id: number;
    year_start: number;
    year_end: number;
    label: string;
    theme: string | null;
    is_current: boolean;
    president: President | null;
    highlights: Highlight[];
}

interface Props {
    academicYears: AcademicYear[];
}

// Fallback data if no academic years are provided
const fallbackYears: AcademicYear[] = [
    {
        id: 1,
        year_start: 2024,
        year_end: 2025,
        label: 'SY 2024-2025',
        theme: 'Digital Transformation Era',
        is_current: true,
        president: null,
        highlights: [
            { id: 1, title: 'Official Tech Portal Launch', description: 'Streamlined student services', type: 'event', icon: '🚀' },
            { id: 2, title: 'Hybrid IO Week', description: 'Innovation and outreach', type: 'event', icon: '💡' },
            { id: 3, title: 'Expanded Org Partnerships', description: 'Cross-college collaborations', type: 'award', icon: '🤝' },
        ],
    },
    {
        id: 2,
        year_start: 2023,
        year_end: 2024,
        label: 'SY 2023-2024',
        theme: 'Restructuring & Growth',
        is_current: false,
        president: null,
        highlights: [
            { id: 4, title: 'Constitution Amendments', description: 'Modernized governance', type: 'project', icon: '📜' },
            { id: 5, title: 'First Full F2F General Assembly', description: 'Post-pandemic milestone', type: 'event', icon: '🎤' },
            { id: 6, title: 'Skill Development Workshops', description: 'Technical training series', type: 'event', icon: '🛠️' },
        ],
    },
];

const getTypeIcon = (type: string): React.ReactNode => {
    switch (type) {
        case 'award': return <TrophyIcon className="w-5 h-5" />;
        case 'event': return <CalendarIcon className="w-5 h-5" />;
        case 'project': return <SparklesIcon className="w-5 h-5" />;
        default: return <StarIcon className="w-5 h-5" />;
    }
};

export default function History({ academicYears }: Props) {
    // Use fallback if no data provided
    const years = academicYears?.length > 0 ? academicYears : fallbackYears;

    return (
        <PublicLayout>
            <Head title="IT Through The Years" />
            
            <div className="pt-28">
                <GlassPageHeader title="IT Through the Years">
                    <div className="flex flex-wrap gap-2">
                        {years.slice(0, 5).map((year) => (
                            <a
                                key={year.id}
                                href={`#year-${year.year_start}`}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${year.is_current
                                    ? 'bg-gold-500 text-maroon-900 shadow-lg shadow-gold-500/30'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                {year.year_start}
                            </a>
                        ))}
                    </div>
                </GlassPageHeader>

                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <p className="text-lg text-white/70 max-w-2xl mx-auto">
                            Celebrating the legacy, leadership, and milestones that defined the College of Information and Communications Technology.
                        </p>
                    </motion.div>

                    {/* Timeline Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-16"
                    >
                        {years.map((year, index) => (
                            <YearSection key={year.id} year={year} index={index} />
                        ))}
                    </motion.div>

                    {/* Explore More Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-20 text-center"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Explore More</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/achievements"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20"
                            >
                                <TrophyIcon className="w-5 h-5" />
                                View Achievements
                            </Link>
                            <Link
                                href="/timeline"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 border border-white/10 transition-all backdrop-blur-sm"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                3D Timeline Experience
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PublicLayout>
    );
}

// Year Section Component
function YearSection({ year, index }: { year: AcademicYear; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <div id={`year-${year.year_start}`} className="relative group scroll-mt-32">
            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative glass-card rounded-2xl p-8 md:p-10 overflow-hidden border border-white/10 hover:border-gold-500/30 transition-all duration-500"
            >
                {/* Subtle glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-maroon-800/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                <div className={`grid md:grid-cols-2 gap-10 items-start ${!isEven ? 'md:grid-flow-dense' : ''}`}>
                    
                    {/* Text Content */}
                    <div className={!isEven ? 'md:col-start-2' : ''}>
                        {/* Year Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 font-bold text-sm">
                                {year.label}
                            </div>
                            {year.is_current && (
                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                                    Current
                                </span>
                            )}
                        </div>

                        {/* Theme Title */}
                        <h2 className="text-3xl font-bold text-white mb-4">
                            {year.theme || `Academic Year ${year.year_start}`}
                        </h2>

                        {/* President Info */}
                        {year.president && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                                {year.president.photo_url ? (
                                    <img 
                                        src={year.president.photo_url} 
                                        alt={year.president.name}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/50 shadow-lg"
                                    />
                                ) : (
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-maroon-600 flex items-center justify-center border-2 border-gold-500/50">
                                            <UserCircleIcon className="w-8 h-8 text-white/80" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-white/60 text-xs uppercase tracking-wider">President</p>
                                    <p className="text-lg font-bold text-white">{year.president.name}</p>
                                </div>
                            </div>
                        )}

                        {/* Highlights List */}
                        {year.highlights.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Key Highlights</p>
                                {year.highlights.map((highlight) => (
                                    <div key={highlight.id} className="flex items-start gap-3 text-white/80 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gold-500/20 text-gold-400">
                                            {highlight.icon ? (
                                                <span className="text-sm">{highlight.icon}</span>
                                            ) : (
                                                getTypeIcon(highlight.type)
                                            )}
                                        </span>
                                        <div>
                                            <p className="font-medium text-white">{highlight.title}</p>
                                            <p className="text-sm text-white/50">{highlight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {year.highlights.length === 0 && (
                            <p className="text-white/40 italic">No featured highlights recorded yet.</p>
                        )}
                    </div>
                    
                    {/* Photo Gallery Placeholder */}
                    <div className={`relative ${!isEven ? 'md:col-start-1 md:row-start-1' : ''}`}>
                        <div className="h-64 md:h-80 rounded-xl bg-gradient-to-br from-maroon-900/50 to-black border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-gold-500/20 transition-all">
                            {year.president?.photo_url ? (
                                <div className="relative w-full h-full">
                                    <img 
                                        src={year.president.photo_url} 
                                        alt={year.president.name}
                                        className="w-full h-full object-cover opacity-30"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider">Under the Leadership of</p>
                                        <p className="text-xl font-bold text-white mt-1">{year.president.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-maroon-600/20 flex items-center justify-center">
                                            <UserCircleIcon className="w-10 h-10 text-white/20" />
                                    </div>
                                        <p className="text-white/20 font-mono text-xs">Photo Gallery</p>
                                        <p className="text-gold-500/30 text-[10px] mt-2">
                                        [Images of {year.year_start} Events]
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
