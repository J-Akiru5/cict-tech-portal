import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface AcademicYear {
    id: number;
    label: string;
    is_current: boolean;
}

interface Officer {
    id: number;
    name: string;
    position: string;
    position_short: string | null;
    photo_url: string;
    course: string | null;
    year_level: string | null;
    motto: string | null;
    email: string | null;
    facebook_url: string | null;
}

interface Props {
    academicYears: AcademicYear[];
    selectedYear: AcademicYear | null;
    groupedOfficers: Record<string, Officer[]>;
}

const levelLabels: Record<string, string> = {
    '0': 'Adviser',
    '1': 'Executive Officers',
    '2': 'Core Officers',
    '3': 'Staff Officers',
    '4': 'Representatives',
};

const OfficerCard = ({ officer }: { officer: Officer }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/30 hover:bg-white/10 hover:-translate-y-1">
                {/* Photo */}
                <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-gold-500/30 transition-all group-hover:border-gold-500/60">
                    <img 
                        src={officer.photo_url}
                        alt={officer.name}
                        className="h-full w-full object-cover"
                    />
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
                        {officer.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-gold-500">
                        {officer.position}
                    </p>
                    {officer.course && (
                        <p className="mt-2 text-xs text-white/50">
                            {officer.course} {officer.year_level && `• ${officer.year_level}`}
                        </p>
                    )}
                </div>

                {/* Motto - shows on hover */}
                {officer.motto && (
                    <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        <p className="text-xs text-center text-white/80 italic">
                            "{officer.motto}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function OrgChart({ academicYears, selectedYear, groupedOfficers }: Props) {
    const handleYearChange = (yearId: string) => {
        router.get('/org-chart', { year: yearId }, { preserveState: true, replace: true });
    };

    const hasOfficers = Object.keys(groupedOfficers).length > 0;

    return (
        <PublicLayout>
            <Head title="Organizational Chart" />
            
            <div className="min-h-screen pt-28 pb-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-white md:text-5xl">
                            Organizational Chart
                        </h1>
                        <p className="mt-4 text-lg text-white/60">
                            Meet the CICT Student Council Officers
                        </p>
                    </div>

                    {/* Academic Year Filter */}
                    {academicYears.length > 0 && (
                        <div className="mb-12 flex justify-center">
                            <select
                                value={selectedYear?.id || ''}
                                onChange={(e) => handleYearChange(e.target.value)}
                                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-white backdrop-blur-sm focus:border-gold-500/50 focus:outline-none focus:ring-0"
                            >
                                {academicYears.map((year) => (
                                    <option key={year.id} value={year.id} className="bg-maroon-900 text-white">
                                        {year.label} {year.is_current && '(Current)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Org Chart Tree */}
                    {!hasOfficers ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-xl text-white/60">No officers found</h3>
                            <p className="text-white/40 mt-2">
                                {selectedYear 
                                    ? `No officers for ${selectedYear.label}`
                                    : 'Please select an academic year'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {Object.entries(groupedOfficers)
                                .sort(([a], [b]) => Number(a) - Number(b))
                                .map(([level, officers]) => (
                                    <div key={level} className="relative">
                                        {/* Level Label */}
                                        <div className="mb-8 text-center">
                                            <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-6 py-2 text-sm font-semibold text-gold-400">
                                                {levelLabels[level] || `Level ${level}`}
                                            </span>
                                        </div>

                                        {/* Connecting Line */}
                                        {Number(level) > 0 && (
                                            <div className="absolute left-1/2 -top-8 h-8 w-px bg-gradient-to-b from-gold-500/50 to-gold-500/20" />
                                        )}

                                        {/* Officers Grid */}
                                        <div className={`grid gap-6 justify-center ${
                                            officers.length === 1 
                                                ? 'grid-cols-1 max-w-xs mx-auto'
                                                : officers.length === 2
                                                ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                                                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                                        }`}>
                                            {officers.map((officer) => (
                                                <OfficerCard key={officer.id} officer={officer} />
                                            ))}
                                        </div>

                                        {/* Horizontal connecting lines for multiple officers */}
                                        {officers.length > 1 && Number(level) > 0 && (
                                            <div className="absolute left-1/4 right-1/4 top-0 h-px bg-gold-500/20" style={{ top: '-1rem' }} />
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
