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
    photoUrl: string;
}

interface DutySlot {
    id: number;
    startTime: string;
    endTime: string;
    location: string;
    officer: Officer;
}

interface DaySchedule {
    dayIndex: number;
    name: string;
    shortName: string;
    duties: DutySlot[];
}

interface Props {
    schedule: DaySchedule[];
    academicYears: AcademicYear[];
    selectedYear: AcademicYear | null;
    todayIndex: number;
}

export default function Schedule({ schedule, academicYears, selectedYear, todayIndex }: Props) {
    const handleYearChange = (yearId: string) => {
        router.get('/schedule', { year: yearId }, { preserveState: true, replace: true });
    };

    const hasSchedule = schedule.length > 0 && schedule.some(day => day.duties.length > 0);

    return (
        <PublicLayout>
            <Head title="Officer Schedule" />
            
            <div className="min-h-screen pt-28 pb-16">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-white md:text-5xl">
                            Officer of the Day
                        </h1>
                        <p className="mt-4 text-lg text-white/60">
                            Weekly duty schedule for Student Council officers
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

                    {/* Weekly Schedule Grid */}
                    {!hasSchedule ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl text-white/60">No schedule found</h3>
                            <p className="text-white/40 mt-2">
                                {selectedYear 
                                    ? `No duty schedule for ${selectedYear.label}`
                                    : 'Please select an academic year'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-5">
                            {schedule.slice(0, 5).map((day) => (
                                <div 
                                    key={day.dayIndex}
                                    className={`rounded-2xl border p-4 transition-all ${
                                        day.dayIndex === todayIndex
                                            ? 'border-gold-500/50 bg-gold-500/10 ring-2 ring-gold-500/30'
                                            : 'border-white/10 bg-white/5'
                                    }`}
                                >
                                    {/* Day Header */}
                                    <div className={`mb-4 text-center pb-3 border-b ${
                                        day.dayIndex === todayIndex
                                            ? 'border-gold-500/30'
                                            : 'border-white/10'
                                    }`}>
                                        <div className={`text-xs font-semibold uppercase tracking-wider ${
                                            day.dayIndex === todayIndex
                                                ? 'text-gold-400'
                                                : 'text-white/40'
                                        }`}>
                                            {day.dayIndex === todayIndex && (
                                                <span className="mr-1">●</span>
                                            )}
                                            {day.dayIndex === todayIndex ? 'Today' : ''}
                                        </div>
                                        <div className={`text-lg font-bold ${
                                            day.dayIndex === todayIndex
                                                ? 'text-gold-400'
                                                : 'text-white'
                                        }`}>
                                            {day.name}
                                        </div>
                                    </div>

                                    {/* Duty Slots */}
                                    <div className="space-y-4">
                                        {day.duties.length === 0 ? (
                                            <div className="text-center py-8 text-white/30 text-sm">
                                                No duty assigned
                                            </div>
                                        ) : (
                                            day.duties.map((duty) => (
                                                <div 
                                                    key={duty.id}
                                                    className="rounded-xl bg-white/5 p-3"
                                                >
                                                    {/* Time */}
                                                    <div className="text-xs font-medium text-gold-500 mb-2">
                                                        {duty.startTime} - {duty.endTime}
                                                    </div>

                                                    {/* Officer */}
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={duty.officer.photoUrl}
                                                            alt={duty.officer.name}
                                                            className="h-10 w-10 rounded-full border border-white/20 object-cover"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-medium text-white truncate">
                                                                {duty.officer.name}
                                                            </div>
                                                            <div className="text-xs text-white/50 truncate">
                                                                {duty.officer.position}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Location */}
                                                    <div className="mt-2 flex items-center gap-1 text-xs text-white/40">
                                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {duty.location}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Legend */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-white/40">
                            <span className="inline-flex items-center gap-1">
                                <span className="text-gold-400">●</span> = Current day
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
