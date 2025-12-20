import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Enrollment {
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    userStudentId: string | null;
    userPhotoUrl: string;
    course: string;
    yearLevel: string;
    section: string;
    fullSection: string;
    status: string;
    statusLabel: string;
    feePaid: boolean;
    feeAmount: string;
    enrolledAt: string | null;
    createdAt: string;
}

interface AcademicYearOption {
    id: number;
    label: string;
}

interface Props {
    enrollments: Enrollment[];
    academicYears: AcademicYearOption[];
    selectedYearId: number;
    selectedStatus: string | null;
    selectedPaid: string | null;
    statuses: Record<string, string>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    enrolled: 'bg-green-500/20 text-green-400 border-green-500/30',
    dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function EnrollmentStudents({ enrollments, academicYears, selectedYearId, selectedStatus, selectedPaid, statuses }: Props) {
    const markPaidForm = useForm({});

    const handleMarkPaid = (enrollmentId: number) => {
        markPaidForm.post(route('manage.enrollment.mark-paid', enrollmentId));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Enrolled Students" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('manage.enrollment.index')}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            ← Back to Enrollment Management
                        </Link>
                        <h1 className="text-2xl font-bold text-white mt-4">Enrolled Students</h1>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <select
                            value={selectedYearId}
                            onChange={(e) => window.location.href = route('manage.enrollment.students', { year_id: e.target.value })}
                            className="auth-input w-auto"
                        >
                            {academicYears.map((year) => (
                                <option key={year.id} value={year.id}>{year.label}</option>
                            ))}
                        </select>
                        
                        <div className="flex gap-2">
                            <Link
                                href={route('manage.enrollment.students', { year_id: selectedYearId })}
                                className={`rounded-lg px-3 py-2 text-sm ${!selectedStatus && !selectedPaid ? 'bg-gold-500 text-maroon-900' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                            >
                                All
                            </Link>
                            <Link
                                href={route('manage.enrollment.students', { year_id: selectedYearId, paid: 'false' })}
                                className={`rounded-lg px-3 py-2 text-sm ${selectedPaid === 'false' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                            >
                                Unpaid
                            </Link>
                            <Link
                                href={route('manage.enrollment.students', { year_id: selectedYearId, paid: 'true' })}
                                className={`rounded-lg px-3 py-2 text-sm ${selectedPaid === 'true' ? 'bg-green-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                            >
                                Paid
                            </Link>
                        </div>
                    </div>

                    {/* Students List */}
                    {enrollments.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">📋</div>
                            <h3 className="text-lg font-medium text-white">No students found</h3>
                            <p className="text-white/50 mt-2">No enrollments match your filter criteria.</p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10">
                            {enrollments.map((enrollment) => (
                                <div key={enrollment.id} className="p-4 flex items-center gap-4">
                                    <img
                                        src={enrollment.userPhotoUrl}
                                        alt={enrollment.userName}
                                        className="h-12 w-12 rounded-full border border-white/20"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white truncate">{enrollment.userName}</p>
                                            <span className={`rounded-full border px-2 py-0.5 text-xs ${statusColors[enrollment.status]}`}>
                                                {enrollment.statusLabel}
                                            </span>
                                        </div>
                                        <p className="text-sm text-white/50">
                                            {enrollment.userStudentId || enrollment.userEmail}
                                        </p>
                                        <p className="text-sm text-white/40">{enrollment.fullSection}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-white">{enrollment.feeAmount}</p>
                                        {enrollment.feePaid ? (
                                            <span className="text-xs text-green-400">✓ Paid</span>
                                        ) : (
                                            <button
                                                onClick={() => handleMarkPaid(enrollment.id)}
                                                disabled={markPaidForm.processing}
                                                className="mt-1 rounded-lg bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Summary */}
                    <div className="mt-6 text-center text-sm text-white/50">
                        Showing {enrollments.length} student{enrollments.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
