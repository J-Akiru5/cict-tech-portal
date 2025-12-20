import { useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

// CBL Section data - can be moved to backend later
const cblSections = [
    {
        id: 'preamble',
        title: 'Preamble',
        content: `We, the students of the College of Information and Communications Technology (CICT), imploring the guidance of the Almighty God, in order to establish an organization that shall embody our ideals and aspirations, promote student welfare, uphold academic excellence, and foster unity among students, do hereby ordain and promulgate this Constitution and By-Laws.`,
    },
    {
        id: 'article-1',
        title: 'Article I - Name and Nature',
        content: `<p><strong>Section 1.</strong> The organization shall be known as the CICT Student Council.</p>
        <p><strong>Section 2.</strong> The Student Council is a non-profit, non-partisan, and non-sectarian organization dedicated to serving the students of CICT.</p>
        <p><strong>Section 3.</strong> The Student Council shall serve as the primary representative body of all CICT students in matters concerning their welfare, rights, and interests.</p>`,
    },
    {
        id: 'article-2',
        title: 'Article II - Objectives',
        content: `<p>The CICT Student Council shall:</p>
        <ul>
            <li>Uphold and promote the welfare, rights, and interests of all CICT students.</li>
            <li>Serve as the official voice of CICT students in matters affecting their academic and co-curricular activities.</li>
            <li>Foster unity, camaraderie, and cooperation among students.</li>
            <li>Promote academic excellence and professional development.</li>
            <li>Organize and support activities that enhance the holistic development of students.</li>
            <li>Maintain open communication channels between the administration and the student body.</li>
        </ul>`,
    },
    {
        id: 'article-3',
        title: 'Article III - Membership',
        content: `<p><strong>Section 1.</strong> All bonafide students of CICT are automatic members of the Student Council.</p>
        <p><strong>Section 2.</strong> Membership begins upon enrollment and ends upon graduation, transfer, or dismissal from the college.</p>
        <p><strong>Section 3.</strong> All members have the right to:</p>
        <ul>
            <li>Vote and be voted for in student council elections.</li>
            <li>Participate in all activities organized by the Student Council.</li>
            <li>Access services and benefits provided by the Student Council.</li>
            <li>Voice out concerns and suggestions to the officers.</li>
        </ul>`,
    },
    {
        id: 'article-4',
        title: 'Article IV - Officers',
        content: `<p><strong>Section 1.</strong> The Student Council shall be composed of the following officers:</p>
        <ul>
            <li>President</li>
            <li>Vice President</li>
            <li>Secretary</li>
            <li>Treasurer</li>
            <li>Auditor</li>
            <li>Public Information Officer (PIO)</li>
            <li>Business Manager</li>
            <li>Course Representatives</li>
        </ul>
        <p><strong>Section 2.</strong> All officers must be bonafide students of CICT with a GPA of at least 2.0 and no failing grades.</p>
        <p><strong>Section 3.</strong> Officers shall serve for one academic year and may run for re-election.</p>`,
    },
    {
        id: 'article-5',
        title: 'Article V - Duties and Responsibilities',
        content: `<p><strong>The President shall:</strong></p>
        <ul>
            <li>Preside over all meetings and assemblies.</li>
            <li>Represent the Student Council in official functions.</li>
            <li>Sign official documents on behalf of the organization.</li>
            <li>Supervise the implementation of programs and activities.</li>
        </ul>
        <p><strong>The Vice President shall:</strong></p>
        <ul>
            <li>Assist the President in all duties.</li>
            <li>Assume the presidency in case of absence or vacancy.</li>
            <li>Coordinate with different committees.</li>
        </ul>
        <p><strong>The Secretary shall:</strong></p>
        <ul>
            <li>Keep minutes of all meetings.</li>
            <li>Handle all correspondence.</li>
            <li>Maintain records and documents.</li>
        </ul>
        <p><strong>The Treasurer shall:</strong></p>
        <ul>
            <li>Manage all financial matters.</li>
            <li>Prepare financial reports.</li>
            <li>Collect and disburse funds as authorized.</li>
        </ul>`,
    },
    {
        id: 'article-6',
        title: 'Article VI - Elections',
        content: `<p><strong>Section 1.</strong> General elections shall be held during the second semester of each academic year.</p>
        <p><strong>Section 2.</strong> The Commission on Elections (COMELEC) shall be responsible for conducting fair and honest elections.</p>
        <p><strong>Section 3.</strong> Candidates must file their certificate of candidacy within the prescribed period.</p>
        <p><strong>Section 4.</strong> Winners shall be determined by plurality vote.</p>`,
    },
    {
        id: 'article-7',
        title: 'Article VII - Amendments',
        content: `<p><strong>Section 1.</strong> This Constitution and By-Laws may be amended by a two-thirds (2/3) vote of all members present in a general assembly called for this purpose.</p>
        <p><strong>Section 2.</strong> Proposed amendments must be submitted in writing at least one (1) week before the general assembly.</p>
        <p><strong>Section 3.</strong> Amendments shall take effect immediately upon ratification unless otherwise specified.</p>`,
    },
];

export default function CBL() {
    const [activeSection, setActiveSection] = useState('preamble');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results = cblSections
            .filter(section => 
                section.title.toLowerCase().includes(query.toLowerCase()) ||
                section.content.toLowerCase().includes(query.toLowerCase())
            )
            .map(section => section.id);
        
        setSearchResults(results);
        
        // Jump to first result
        if (results.length > 0) {
            setActiveSection(results[0]);
        }
    };

    const currentSection = cblSections.find(s => s.id === activeSection);

    return (
        <PublicLayout>
            <Head title="Constitution & By-Laws" />
            
            <div className="min-h-screen pt-28 pb-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-white md:text-5xl">
                            Constitution & By-Laws
                        </h1>
                        <p className="mt-4 text-lg text-white/60">
                            The governing document of the CICT Student Council
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-10 max-w-xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search in CBL..."
                                className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-3 pl-12 text-white placeholder:text-white/40 focus:border-gold-500/50 focus:outline-none focus:ring-0 backdrop-blur-sm"
                            />
                            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchResults.length > 0 && (
                            <p className="mt-2 text-sm text-gold-400 text-center">
                                Found in {searchResults.length} section(s)
                            </p>
                        )}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                        {/* Sidebar Navigation */}
                        <aside className="order-2 lg:order-1">
                            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                <h3 className="mb-4 px-3 text-sm font-semibold uppercase tracking-wider text-white/40">
                                    Table of Contents
                                </h3>
                                <nav className="space-y-1">
                                    {cblSections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                                                activeSection === section.id
                                                    ? 'bg-gold-500/20 text-gold-400 font-medium'
                                                    : searchResults.includes(section.id)
                                                    ? 'text-gold-300 bg-gold-500/10'
                                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            {section.title}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="order-1 lg:order-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                                {currentSection && (
                                    <article>
                                        <h2 className="text-2xl font-bold text-white mb-6">
                                            {currentSection.title}
                                        </h2>
                                        <div 
                                            className="prose prose-invert prose-lg max-w-none
                                                       prose-headings:text-white prose-headings:font-semibold
                                                       prose-p:text-white/80 prose-p:leading-relaxed
                                                       prose-strong:text-white
                                                       prose-ul:text-white/80 prose-ol:text-white/80
                                                       prose-li:marker:text-gold-500"
                                            dangerouslySetInnerHTML={{ __html: currentSection.content }}
                                        />
                                    </article>
                                )}

                                {/* Section Navigation */}
                                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                                    {cblSections.findIndex(s => s.id === activeSection) > 0 ? (
                                        <button
                                            onClick={() => {
                                                const currentIndex = cblSections.findIndex(s => s.id === activeSection);
                                                setActiveSection(cblSections[currentIndex - 1].id);
                                            }}
                                            className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 transition-all hover:bg-white/5 hover:text-white"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Previous
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    {cblSections.findIndex(s => s.id === activeSection) < cblSections.length - 1 && (
                                        <button
                                            onClick={() => {
                                                const currentIndex = cblSections.findIndex(s => s.id === activeSection);
                                                setActiveSection(cblSections[currentIndex + 1].id);
                                            }}
                                            className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 transition-all hover:bg-white/5 hover:text-white"
                                        >
                                            Next
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Download PDF */}
                            <div className="mt-6 text-center">
                                <a
                                    href="/assets/documents/CICT_CBL.pdf"
                                    download
                                    className="inline-flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-6 py-3 text-sm font-medium text-gold-400 transition-all hover:bg-gold-500/20"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Full PDF
                                </a>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
