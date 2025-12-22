import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { motion } from 'framer-motion';
import HoneycombBackground from '@/Components/Landing/HoneycombBackground';
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
            
            <div className="relative min-h-screen pt-24 pb-20 overflow-hidden">
                {/* Background */}
                <HoneycombBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/90 via-black/80 to-black z-0 pointer-events-none" />

                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-white to-gold-400 mb-6 drop-shadow-sm"
                        >
                            IT THROUGH THE YEARS
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/80 max-w-2xl mx-auto font-light"
                        >
                            Celebrating the legacy, leadership, and milestones that defined the College of Information and Communications Technology.
                        </motion.p>

                        {/* Quick Navigation */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-3 mt-8"
                        >
                            {years.map((year) => (
                                <a
                                    key={year.id}
                                    href={`#year-${year.year_start}`}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        year.is_current
                                            ? 'bg-gold-500 text-maroon-900 shadow-lg shadow-gold-500/30'
                                            : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                                    }`}
                                >
                                    {year.year_start}
                                </a>
                            ))}
                        </motion.div>
                    </div>

                    {/* Timeline / Gallery Section */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-24"
                    >
                        {years.map((year, index) => (
                            <YearSection key={year.id} year={year} index={index} />
                        ))}
                    </motion.div>

                    {/* Explore More Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-24 text-center"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Explore More</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/achievements"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/30"
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
    const gradientColors = isEven
        ? 'from-gold-500 to-maroon-600'
        : 'from-maroon-600 to-gold-600';
    const accentColor = isEven ? 'gold' : 'maroon';

    return (
        <div id={`year-${year.year_start}`} className="relative group scroll-mt-32">
            {/* Glow Background */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${gradientColors} rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000`} />
            
            {/* Card */}
            <div className={`relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 overflow-hidden hover:border-${accentColor}-500/30 transition-all duration-300`}>
                <div className={`grid md:grid-cols-2 gap-12 items-start ${!isEven ? 'md:grid-flow-dense' : ''}`}>
                    
                    {/* Text Content */}
                    <div className={!isEven ? 'md:col-start-2' : ''}>
                        {/* Year Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`inline-block px-4 py-1 rounded-full ${
                                isEven 
                                    ? 'bg-gold-400/10 border border-gold-400/20 text-gold-400' 
                                    : 'bg-maroon-400/10 border border-maroon-400/20 text-maroon-300'
                            } font-bold`}>
                                {year.label}
                            </div>
                            {year.is_current && (
                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                                    Current
                                </span>
                            )}
                        </div>

                        {/* Theme Title */}
                        <h2 className="text-4xl font-bold text-white mb-4">
                            {year.theme || `Academic Year ${year.year_start}`}
                        </h2>

                        {/* President Info */}
                        {year.president && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                                {year.president.photo_url ? (
                                    <img 
                                        src={year.president.photo_url} 
                                        alt={year.president.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gold-500/50 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-maroon-600 flex items-center justify-center border-2 border-gold-500/50">
                                        <UserCircleIcon className="w-10 h-10 text-white/80" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-white/60 text-sm">President</p>
                                    <p className="text-xl font-bold text-white">{year.president.name}</p>
                                </div>
                            </div>
                        )}

                        {/* Highlights List */}
                        {year.highlights.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-white/60 text-sm font-medium uppercase tracking-wide mb-2">Key Highlights</p>
                                {year.highlights.map((highlight) => (
                                    <div key={highlight.id} className="flex items-start gap-3 text-white/80">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                            isEven ? 'bg-gold-500/20 text-gold-400' : 'bg-maroon-500/20 text-maroon-300'
                                        }`}>
                                            {highlight.icon ? (
                                                <span className="text-sm">{highlight.icon}</span>
                                            ) : (
                                                getTypeIcon(highlight.type)
                                            )}
                                        </span>
                                        <div>
                                            <p className="font-medium text-white">{highlight.title}</p>
                                            <p className="text-sm text-white/60">{highlight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {year.highlights.length === 0 && (
                            <p className="text-white/50 italic">No featured highlights recorded yet.</p>
                        )}
                    </div>
                    
                    {/* Photo Gallery Placeholder */}
                    <div className={`relative ${!isEven ? 'md:col-start-1 md:row-start-1' : ''}`}>
                        <div className={`h-64 md:h-96 rounded-xl bg-gradient-to-br from-${accentColor === 'gold' ? 'maroon' : 'maroon'}-900/50 to-black border border-white/10 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden`}>
                            {/* Large President Photo or Placeholder */}
                            {year.president?.photo_url ? (
                                <div className="relative w-full h-full">
                                    <img 
                                        src={year.president.photo_url} 
                                        alt={year.president.name}
                                        className="w-full h-full object-cover opacity-40"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <p className="text-gold-400 text-sm font-medium">Under the Leadership of</p>
                                        <p className="text-2xl font-bold text-white">{year.president.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-maroon-600/20 flex items-center justify-center">
                                        <UserCircleIcon className="w-12 h-12 text-white/30" />
                                    </div>
                                    <p className="text-white/30 font-mono text-sm">Photo Gallery</p>
                                    <p className={`text-${accentColor === 'gold' ? 'gold' : 'maroon'}-500/50 text-xs mt-2`}>
                                        [Images of {year.year_start} Events]
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
