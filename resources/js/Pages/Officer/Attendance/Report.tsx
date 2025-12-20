import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface OfficerReport {
    id: number;
    name: string;
    position: string;
    photoUrl: string;
    summary: {
        present: number;
        late: number;
        absent: number;
        excused: number;
    };
    totalDuties: number;
    attendanceRate: number;
    totalFines: string;
    unpaidFines: string;
    hasUnpaidFines: boolean;
}

interface Props {
    officers: OfficerReport[];
    month: number;
    year: number;
    monthLabel: string;
}

export default function AttendanceReport({ officers, month, year, monthLabel }: Props) {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    return (
        <AuthenticatedLayout>
            <Head title="Attendance Report" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('officer.attendance.index')}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            ← Back to Attendance
                        </Link>
                        <h1 className="text-2xl font-bold text-white mt-4">Attendance Report</h1>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <Link
                            href={route('officer.attendance.report', { month: prevMonth, year: prevYear })}
                            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                        >
                            ← Previous
                        </Link>
                        <span className="text-xl font-semibold text-white">{monthLabel}</span>
                        <Link
                            href={route('officer.attendance.report', { month: nextMonth, year: nextYear })}
                            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                        >
                            Next →
                        </Link>
                    </div>

                    {/* Officers Report */}
                    <div className="space-y-4">
                        {officers.map((officer) => (
                            <div
                                key={officer.id}
                                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={officer.photoUrl}
                                        alt={officer.name}
                                        className="h-14 w-14 rounded-full border-2 border-white/20"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-white">{officer.name}</h3>
                                                <p className="text-sm text-white/50">{officer.position}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-2xl font-bold ${
                                                    officer.attendanceRate >= 80 ? 'text-green-400' :
                                                    officer.attendanceRate >= 60 ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                    {officer.attendanceRate}%
                                                </p>
                                                <p className="text-xs text-white/40">Attendance Rate</p>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-4 gap-2 mt-4">
                                            <div className="rounded-lg bg-green-500/10 p-2 text-center">
                                                <p className="text-lg font-semibold text-green-400">{officer.summary.present}</p>
                                                <p className="text-xs text-white/40">Present</p>
                                            </div>
                                            <div className="rounded-lg bg-yellow-500/10 p-2 text-center">
                                                <p className="text-lg font-semibold text-yellow-400">{officer.summary.late}</p>
                                                <p className="text-xs text-white/40">Late</p>
                                            </div>
                                            <div className="rounded-lg bg-red-500/10 p-2 text-center">
                                                <p className="text-lg font-semibold text-red-400">{officer.summary.absent}</p>
                                                <p className="text-xs text-white/40">Absent</p>
                                            </div>
                                            <div className="rounded-lg bg-blue-500/10 p-2 text-center">
                                                <p className="text-lg font-semibold text-blue-400">{officer.summary.excused}</p>
                                                <p className="text-xs text-white/40">Excused</p>
                                            </div>
                                        </div>

                                        {/* Fines */}
                                        {officer.hasUnpaidFines && (
                                            <div className="mt-3 flex items-center justify-between rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
                                                <span className="text-sm text-red-400">Unpaid Fines</span>
                                                <span className="font-medium text-red-400">{officer.unpaidFines}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {officers.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">📊</div>
                            <h3 className="text-lg font-medium text-white">No attendance data</h3>
                            <p className="text-white/50 mt-2">No attendance records for this month.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
