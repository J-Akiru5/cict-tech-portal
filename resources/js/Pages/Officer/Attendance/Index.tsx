import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface DutyRecord {
    dutyId: number;
    attendanceId: number;
    officerId: number;
    officerName: string;
    officerPhoto: string;
    position: string;
    startTime: string | null;
    endTime: string | null;
    location: string | null;
    status: string;
    statusLabel: string;
    checkedIn: string | null;
    checkedOut: string | null;
    lateMinutes: number;
    hasFine: boolean;
    fineAmount: string;
}

interface Props {
    todayDuties: DutyRecord[];
    weekStats: {
        present: number;
        late: number;
        absent: number;
        excused: number;
    };
    todayDate: string;
    isWeekend: boolean;
}

const statusColors: Record<string, string> = {
    present: 'bg-green-500/20 text-green-400 border-green-500/30',
    late: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    absent: 'bg-red-500/20 text-red-400 border-red-500/30',
    excused: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function AttendanceIndex({ todayDuties, weekStats, todayDate, isWeekend }: Props) {
    const checkInForm = useForm({});
    const checkOutForm = useForm({});
    const absentForm = useForm({});

    const handleCheckIn = (attendanceId: number) => {
        checkInForm.post(route('officer.attendance.check-in', attendanceId));
    };

    const handleCheckOut = (attendanceId: number) => {
        checkOutForm.post(route('officer.attendance.check-out', attendanceId));
    };

    const handleMarkAbsent = (attendanceId: number) => {
        if (confirm('Mark this officer as absent? A fine will be applied.')) {
            absentForm.post(route('officer.attendance.absent', attendanceId));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Attendance" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Duty Attendance</h1>
                            <p className="text-white/60">{todayDate}</p>
                        </div>
                        <Link
                            href={route('officer.attendance.report')}
                            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        >
                            📊 View Report
                        </Link>
                    </div>

                    {/* Week Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
                            <p className="text-2xl font-bold text-green-400">{weekStats.present}</p>
                            <p className="text-xs text-white/50">Present</p>
                        </div>
                        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
                            <p className="text-2xl font-bold text-yellow-400">{weekStats.late}</p>
                            <p className="text-xs text-white/50">Late</p>
                        </div>
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
                            <p className="text-2xl font-bold text-red-400">{weekStats.absent}</p>
                            <p className="text-xs text-white/50">Absent</p>
                        </div>
                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-center">
                            <p className="text-2xl font-bold text-blue-400">{weekStats.excused}</p>
                            <p className="text-xs text-white/50">Excused</p>
                        </div>
                    </div>

                    {/* Today's Duties */}
                    <h2 className="text-lg font-semibold text-white mb-4">Today's Scheduled Duties</h2>
                    
                    {isWeekend ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">🏖️</div>
                            <h3 className="text-lg font-medium text-white">It's the weekend!</h3>
                            <p className="text-white/50 mt-2">No scheduled duties today.</p>
                        </div>
                    ) : todayDuties.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">📅</div>
                            <h3 className="text-lg font-medium text-white">No duties scheduled</h3>
                            <p className="text-white/50 mt-2">There are no duty assignments for today.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {todayDuties.map((duty) => (
                                <div
                                    key={duty.attendanceId}
                                    className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={duty.officerPhoto}
                                            alt={duty.officerName}
                                            className="h-14 w-14 rounded-full border-2 border-white/20"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white">{duty.officerName}</h3>
                                            <p className="text-sm text-white/50">{duty.position}</p>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-white/40">
                                                <span>⏰ {duty.startTime} - {duty.endTime}</span>
                                                {duty.location && <span>📍 {duty.location}</span>}
                                            </div>
                                        </div>
                                        
                                        {/* Status & Actions */}
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[duty.status]}`}>
                                                {duty.statusLabel}
                                            </span>
                                            
                                            {duty.checkedIn && (
                                                <span className="text-xs text-white/40">
                                                    In: {duty.checkedIn}
                                                    {duty.checkedOut && ` → Out: ${duty.checkedOut}`}
                                                </span>
                                            )}
                                            
                                            {duty.hasFine && (
                                                <span className="text-xs text-red-400">
                                                    Fine: {duty.fineAmount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    {duty.status === 'absent' && !duty.checkedIn && (
                                        <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                                            <button
                                                onClick={() => handleCheckIn(duty.attendanceId)}
                                                disabled={checkInForm.processing}
                                                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
                                            >
                                                ✓ Check In
                                            </button>
                                            <button
                                                onClick={() => handleMarkAbsent(duty.attendanceId)}
                                                disabled={absentForm.processing}
                                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                                            >
                                                ✗ Mark Absent
                                            </button>
                                        </div>
                                    )}
                                    
                                    {(duty.status === 'present' || duty.status === 'late') && !duty.checkedOut && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <button
                                                onClick={() => handleCheckOut(duty.attendanceId)}
                                                disabled={checkOutForm.processing}
                                                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                                            >
                                                Check Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
