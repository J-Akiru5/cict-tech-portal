import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface AcademicYear {
    id: number;
    label: string;
    semester: string;
    isCurrent: boolean;
    enrollmentStart: string | null;
    enrollmentEnd: string | null;
    enrollmentStartFormatted: string | null;
    enrollmentEndFormatted: string | null;
    departmentFee: number;
    isEnrollmentOpen: boolean;
}

interface Stats {
    totalEnrolled: number;
    pendingPayment: number;
    totalPaid: number;
    totalCollected: string;
}

interface Props {
    academicYears: AcademicYear[];
    currentYearId: number | null;
    stats: Stats | null;
}

export default function EnrollmentAdminIndex({ academicYears, currentYearId, stats }: Props) {
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
    
    const { data, setData, put, processing, reset } = useForm({
        enrollment_start: '',
        enrollment_end: '',
        department_fee: 50,
    });

    const handleEdit = (year: AcademicYear) => {
        setEditingYear(year);
        setData({
            enrollment_start: year.enrollmentStart || '',
            enrollment_end: year.enrollmentEnd || '',
            department_fee: year.departmentFee,
        });
    };

    const handleSave = () => {
        if (!editingYear) return;
        put(route('manage.enrollment.update-period', editingYear.id), {
            onSuccess: () => setEditingYear(null),
        });
    };

    const handleCancel = () => {
        setEditingYear(null);
        reset();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Enrollment Management" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Enrollment Management</h1>
                            <p className="text-white/60">Configure enrollment periods and view enrolled students</p>
                        </div>
                        <Link
                            href={route('manage.enrollment.students')}
                            className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-medium text-maroon-900 hover:-translate-y-0.5 transition-all"
                        >
                            View All Students
                        </Link>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
                                <p className="text-2xl font-bold text-green-400">{stats.totalEnrolled}</p>
                                <p className="text-xs text-white/50">Enrolled</p>
                            </div>
                            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
                                <p className="text-2xl font-bold text-yellow-400">{stats.pendingPayment}</p>
                                <p className="text-xs text-white/50">Pending Payment</p>
                            </div>
                            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-center">
                                <p className="text-2xl font-bold text-blue-400">{stats.totalPaid}</p>
                                <p className="text-xs text-white/50">Paid</p>
                            </div>
                            <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-4 text-center">
                                <p className="text-2xl font-bold text-gold-400">{stats.totalCollected}</p>
                                <p className="text-xs text-white/50">Collected</p>
                            </div>
                        </div>
                    )}

                    {/* Academic Years */}
                    <h2 className="text-lg font-semibold text-white mb-4">Academic Years</h2>
                    <div className="space-y-4">
                        {academicYears.map((year) => (
                            <div
                                key={year.id}
                                className={`rounded-xl border p-5 backdrop-blur-sm ${
                                    year.isCurrent 
                                        ? 'border-gold-500/30 bg-gold-500/10' 
                                        : 'border-white/10 bg-white/5'
                                }`}
                            >
                                {editingYear?.id === year.id ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-white">{year.label}</h3>
                                                <p className="text-sm text-white/50">{year.semester} Semester</p>
                                            </div>
                                            {year.isCurrent && (
                                                <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-medium text-maroon-900">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div>
                                                <label className="auth-label">Enrollment Start</label>
                                                <input
                                                    type="date"
                                                    value={data.enrollment_start}
                                                    onChange={(e) => setData('enrollment_start', e.target.value)}
                                                    className="auth-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="auth-label">Enrollment End</label>
                                                <input
                                                    type="date"
                                                    value={data.enrollment_end}
                                                    onChange={(e) => setData('enrollment_end', e.target.value)}
                                                    className="auth-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="auth-label">Department Fee (₱)</label>
                                                <input
                                                    type="number"
                                                    value={data.department_fee}
                                                    onChange={(e) => setData('department_fee', parseFloat(e.target.value))}
                                                    min="0"
                                                    step="0.01"
                                                    className="auth-input"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSave}
                                                disabled={processing}
                                                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-white">{year.label}</h3>
                                                <span className="text-sm text-white/50">- {year.semester} Semester</span>
                                                {year.isCurrent && (
                                                    <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-medium text-maroon-900">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            {year.enrollmentStartFormatted && year.enrollmentEndFormatted ? (
                                                <p className={`text-sm mt-1 ${year.isEnrollmentOpen ? 'text-green-400' : 'text-white/50'}`}>
                                                    {year.isEnrollmentOpen ? '🟢 Open: ' : '🔴 Closed: '}
                                                    {year.enrollmentStartFormatted} - {year.enrollmentEndFormatted}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-white/40 mt-1">No enrollment period set</p>
                                            )}
                                            <p className="text-sm text-white/40">Fee: ₱{year.departmentFee.toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => handleEdit(year)}
                                            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                                        >
                                            Edit Period
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
