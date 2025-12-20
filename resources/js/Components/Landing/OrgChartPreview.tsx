import { Link } from '@inertiajs/react';

// Sample org chart data (will be replaced with real data from API)
const officers = [
    { name: 'President', position: 'Juan Dela Cruz', image: null },
    { name: 'Vice President', position: 'Maria Santos', image: null },
    { name: 'Secretary', position: 'Ana Reyes', image: null },
    { name: 'Treasurer', position: 'Pedro Garcia', image: null },
    { name: 'Auditor', position: 'Sofia Lopez', image: null },
];

/**
 * OrgChartPreview - Landing page organization chart preview
 */
export default function OrgChartPreview() {
    return (
        <section 
            data-scroll-section 
            className="relative py-32 bg-gradient-to-b from-black to-black"
        >
            {/* Background orb for subtle variation */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-maroon-950/20 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div 
                    data-scroll
                    data-scroll-speed="0.2"
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        Meet Your{' '}
                        <span className="text-gold-400">Student Council</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-white/50">
                        The dedicated officers serving the CICT community for 
                        Academic Year 2024-2025
                    </p>
                </div>

                {/* Officers Grid */}
                <div 
                    data-scroll
                    data-scroll-speed="0.1"
                    className="mt-16 flex flex-wrap justify-center gap-6"
                >
                    {officers.map((officer, index) => (
                        <div
                            key={officer.name}
                            className="group relative w-40 text-center"
                        >
                            {/* Avatar */}
                            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-1 transition-all duration-300 group-hover:border-gold-500/30 group-hover:shadow-lg group-hover:shadow-gold-500/10">
                                <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-900">
                                    <span className="text-2xl font-bold text-gold-400">
                                        {officer.position.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className="mt-4 text-sm font-semibold text-white">
                                {officer.position}
                            </h3>
                            <p className="mt-1 text-xs text-gold-400/70">
                                {officer.name}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div 
                    data-scroll
                    data-scroll-speed="0.05"
                    className="mt-12 text-center"
                >
                    <Link
                        href="/org-chart"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10"
                    >
                        View Full Organization
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
