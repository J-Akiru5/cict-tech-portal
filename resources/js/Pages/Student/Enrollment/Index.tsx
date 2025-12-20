import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormEventHandler } from 'react';

interface CurrentYear {
    id: number;
    label: string;
    semester: string;
    enrollmentStart: string | null;
    enrollmentEnd: string | null;
    isEnrollmentOpen: boolean;
    departmentFee: string;
}

interface CurrentEnrollment {
    id: number;
    course: string;
    yearLevel: string;
    section: string;
    status: string;
    statusLabel: string;
    feePaid: boolean;
    feeAmount: string;
}

interface EnrollmentHistory {
    id: number;
    semester: string;
    course: string;
    yearLevel: string;
    section: string;
    fullSection: string;
    status: string;
    statusLabel: string;
    feePaid: boolean;
    feeAmount: string;
    enrolledAt: string | null;
}

interface Props {
    currentYear: CurrentYear | null;
    currentEnrollment: CurrentEnrollment | null;
    enrollmentHistory: EnrollmentHistory[];
    courses: Record<string, string>;
    yearLevels: Record<string, string>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    enrolled: 'bg-green-500/20 text-green-400 border-green-500/30',
    dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function EnrollmentIndex({ currentYear, currentEnrollment, enrollmentHistory, courses, yearLevels }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        course: currentEnrollment?.course || '',
        year_level: currentEnrollment?.yearLevel || '',
        section: currentEnrollment?.section || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (currentEnrollment) {
            put(route('student.enrollment.update', currentEnrollment.id));
        } else {
            post(route('student.enrollment.enroll'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Enrollment" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white">SC Enrollment</h1>
                        <p className="text-white/60">Enroll for the current semester and pay the department fee</p>
                    </div>

                    {/* Current Semester Info */}
                    {currentYear ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{currentYear.label}</h2>
                                    <p className="text-white/50">{currentYear.semester} Semester</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gold-400">{currentYear.departmentFee}</p>
                                    <p className="text-xs text-white/40">Department Fee</p>
                                </div>
                            </div>
                            
                            {currentYear.enrollmentStart && currentYear.enrollmentEnd && (
                                <div className={`rounded-lg p-3 ${currentYear.isEnrollmentOpen ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                                    <p className={`text-sm ${currentYear.isEnrollmentOpen ? 'text-green-400' : 'text-red-400'}`}>
                                        {currentYear.isEnrollmentOpen ? '✓ Enrollment is OPEN' : '✗ Enrollment is CLOSED'}
                                    </p>
                                    <p className="text-xs text-white/50 mt-1">
                                        {currentYear.enrollmentStart} - {currentYear.enrollmentEnd}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-center mb-6">
                            <p className="text-yellow-400">No active academic year configured.</p>
                        </div>
                    )}

                    {/* Current Enrollment Status */}
                    {currentEnrollment && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm mb-6">
                            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">Current Enrollment</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xl font-semibold text-white">
                                        {currentEnrollment.course} {currentEnrollment.yearLevel}-{currentEnrollment.section}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[currentEnrollment.status]}`}>
                                            {currentEnrollment.statusLabel}
                                        </span>
                                        <span className={`text-sm ${currentEnrollment.feePaid ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {currentEnrollment.feePaid ? '✓ Fee Paid' : '⏳ Payment Pending'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-white">{currentEnrollment.feeAmount}</p>
                                </div>
                            </div>
                            
                            {!currentEnrollment.feePaid && (
                                <div className="mt-4 p-4 rounded-lg bg-gold-500/10 border border-gold-500/30">
                                    <p className="text-sm text-gold-400">
                                        💰 Please pay the department fee to complete your enrollment.
                                    </p>
                                    <Link
                                        href={route('student.payments.index')}
                                        className="inline-block mt-2 text-sm text-gold-400 hover:underline"
                                    >
                                        Go to Payments →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Enrollment Form */}
                    {currentYear?.isEnrollmentOpen && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm mb-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                {currentEnrollment ? 'Update Enrollment' : 'Enroll for This Semester'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="auth-label">Course</label>
                                        <select
                                            value={data.course}
                                            onChange={(e) => setData('course', e.target.value)}
                                            className="auth-input"
                                        >
                                            <option value="">Select Course</option>
                                            {Object.entries(courses).map(([key, label]) => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
                                        </select>
                                        {errors.course && <p className="mt-1 text-sm text-red-400">{errors.course}</p>}
                                    </div>
                                    <div>
                                        <label className="auth-label">Year Level</label>
                                        <select
                                            value={data.year_level}
                                            onChange={(e) => setData('year_level', e.target.value)}
                                            className="auth-input"
                                        >
                                            <option value="">Select Year</option>
                                            {Object.entries(yearLevels).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                        {errors.year_level && <p className="mt-1 text-sm text-red-400">{errors.year_level}</p>}
                                    </div>
                                    <div>
                                        <label className="auth-label">Section</label>
                                        <input
                                            type="text"
                                            value={data.section}
                                            onChange={(e) => setData('section', e.target.value.toUpperCase())}
                                            placeholder="A, B, C..."
                                            maxLength={10}
                                            className="auth-input uppercase"
                                        />
                                        {errors.section && <p className="mt-1 text-sm text-red-400">{errors.section}</p>}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 text-sm font-semibold text-maroon-900 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : currentEnrollment ? 'Update Enrollment' : 'Submit Enrollment'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Enrollment History */}
                    {enrollmentHistory.length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-white mb-4">Enrollment History</h3>
                            <div className="space-y-3">
                                {enrollmentHistory.map((enrollment) => (
                                    <div key={enrollment.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                                        <div>
                                            <p className="font-medium text-white">{enrollment.fullSection}</p>
                                            <p className="text-sm text-white/50">{enrollment.semester}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs ${enrollment.feePaid ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {enrollment.feePaid ? '✓ Paid' : '⏳ Unpaid'}
                                            </span>
                                            <span className={`rounded-full border px-2 py-0.5 text-xs ${statusColors[enrollment.status]}`}>
                                                {enrollment.statusLabel}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
