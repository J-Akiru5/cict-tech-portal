import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormEventHandler } from 'react';
import {
    AcademicCapIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

interface CurrentYear {
    id: number;
    label: string;
    semester: string;
    enrollmentStart: string | null;
    enrollmentEnd: string | null;
    isEnrollmentOpen: boolean;
    departmentFee: string;
    totalEnrolled?: number;
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

const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
    pending: { bg: 'bg-yellow-500/20 border-yellow-500/30', text: 'text-yellow-400', icon: '⏳' },
    enrolled: { bg: 'bg-green-500/20 border-green-500/30', text: 'text-green-400', icon: '✓' },
    dropped: { bg: 'bg-red-500/20 border-red-500/30', text: 'text-red-400', icon: '✗' },
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
            <Head title="SC Enrollment" />

            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <AcademicCapIcon className="h-8 w-8 text-gold-400" />
                            SC Enrollment
                        </h1>
                        <p className="text-white/60 mt-2">Join the Student Council for exclusive benefits and events</p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Current Semester */}
                        <div className="rounded-2xl bg-gradient-to-br from-maroon-800/50 to-maroon-900/50 border border-white/10 backdrop-blur-xl p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/50 text-sm">Current Semester</p>
                                    <p className="text-xl font-bold text-white mt-1">
                                        {currentYear?.label || 'Not Set'}
                                    </p>
                                    <p className="text-white/40 text-sm">{currentYear?.semester} Semester</p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                                    <CalendarDaysIcon className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Fee Status */}
                        <div className={`rounded-2xl border backdrop-blur-xl p-5 ${currentEnrollment?.feePaid
                            ? 'bg-gradient-to-br from-green-900/30 to-green-950/30 border-green-500/20'
                            : 'bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 border-yellow-500/20'
                            }`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/50 text-sm">Department Fee</p>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {currentEnrollment?.feeAmount || currentYear?.departmentFee || '₱50.00'}
                                    </p>
                                    <p className={`text-sm mt-1 ${currentEnrollment?.feePaid ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {currentEnrollment?.feePaid ? '✓ Paid' : '⏳ Pending Payment'}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl ${currentEnrollment?.feePaid
                                    ? 'bg-green-500/20 border border-green-500/30'
                                    : 'bg-yellow-500/20 border border-yellow-500/30'
                                    }`}>
                                    <CurrencyDollarIcon className={`h-6 w-6 ${currentEnrollment?.feePaid ? 'text-green-400' : 'text-yellow-400'
                                        }`} />
                                </div>
                            </div>
                        </div>

                        {/* Enrollment Status */}
                        <div className={`rounded-2xl border backdrop-blur-xl p-5 ${currentEnrollment
                            ? statusConfig[currentEnrollment.status]?.bg || 'bg-white/5 border-white/10'
                            : 'bg-white/5 border-white/10'
                            }`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/50 text-sm">Your Status</p>
                                    <p className="text-xl font-bold text-white mt-1">
                                        {currentEnrollment?.statusLabel || 'Not Enrolled'}
                                    </p>
                                    {currentEnrollment && (
                                        <p className="text-white/40 text-sm">
                                            {currentEnrollment.course} {currentEnrollment.yearLevel}-{currentEnrollment.section}
                                        </p>
                                    )}
                                </div>
                                <div className="p-3 rounded-xl bg-gold-500/20 border border-gold-500/30">
                                    <UserGroupIcon className="h-6 w-6 text-gold-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enrollment Period Banner */}
                    {currentYear && currentYear.enrollmentStart && currentYear.enrollmentEnd && (
                        <div className={`rounded-xl p-4 mb-6 flex items-center justify-between ${currentYear.isEnrollmentOpen
                            ? 'bg-green-500/10 border border-green-500/20'
                            : 'bg-red-500/10 border border-red-500/20'
                            }`}>
                            <div className="flex items-center gap-3">
                                {currentYear.isEnrollmentOpen ? (
                                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                                ) : (
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                                )}
                                <div>
                                    <p className={`font-semibold ${currentYear.isEnrollmentOpen ? 'text-green-400' : 'text-red-400'}`}>
                                        {currentYear.isEnrollmentOpen ? 'Enrollment is OPEN' : 'Enrollment is CLOSED'}
                                    </p>
                                    <p className="text-sm text-white/50">
                                        {currentYear.enrollmentStart} — {currentYear.enrollmentEnd}
                                    </p>
                                </div>
                            </div>
                            {currentYear.isEnrollmentOpen && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                    <span className="animate-pulse mr-1">●</span> Active
                                </span>
                            )}
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Enrollment Form Card */}
                            {currentYear?.isEnrollmentOpen && (
                                <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
                                    <div className="p-6 border-b border-white/10">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <SparklesIcon className="h-5 w-5 text-gold-400" />
                                            {currentEnrollment ? 'Update Your Enrollment' : 'Enroll Now'}
                                        </h2>
                                        <p className="text-white/50 text-sm mt-1">
                                            {currentEnrollment
                                                ? 'Update your course, year level, or section'
                                                : 'Fill in your details to join this semester'}
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                        <div className="grid gap-6 sm:grid-cols-3">
                                            {/* Course */}
                                            <div>
                                                <label className="block text-sm font-medium text-white/90 mb-2">
                                                    Course Program
                                                </label>
                                                <select
                                                    value={data.course}
                                                    onChange={(e) => setData('course', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 appearance-none cursor-pointer"
                                                >
                                                    <option value="" className="bg-maroon-900">Select Course</option>
                                                    {Object.entries(courses).map(([key, label]) => (
                                                        <option key={key} value={key} className="bg-maroon-900">{key} - {label}</option>
                                                    ))}
                                                </select>
                                                {errors.course && (
                                                    <p className="mt-2 text-sm text-red-400">{errors.course}</p>
                                                )}
                                            </div>

                                            {/* Year Level */}
                                            <div>
                                                <label className="block text-sm font-medium text-white/90 mb-2">
                                                    Year Level
                                                </label>
                                                <select
                                                    value={data.year_level}
                                                    onChange={(e) => setData('year_level', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 appearance-none cursor-pointer"
                                                >
                                                    <option value="" className="bg-maroon-900">Select Year</option>
                                                    {Object.entries(yearLevels).map(([key, label]) => (
                                                        <option key={key} value={key} className="bg-maroon-900">{label}</option>
                                                    ))}
                                                </select>
                                                {errors.year_level && (
                                                    <p className="mt-2 text-sm text-red-400">{errors.year_level}</p>
                                                )}
                                            </div>

                                            {/* Section */}
                                            <div>
                                                <label className="block text-sm font-medium text-white/90 mb-2">
                                                    Section
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.section}
                                                    onChange={(e) => setData('section', e.target.value.toUpperCase())}
                                                    placeholder="e.g., A, B, C"
                                                    maxLength={10}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 uppercase"
                                                />
                                                {errors.section && (
                                                    <p className="mt-2 text-sm text-red-400">{errors.section}</p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 text-lg font-bold text-maroon-900 hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/25 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    {currentEnrollment ? 'Update Enrollment' : 'Submit Enrollment'}
                                                    <ArrowRightIcon className="h-5 w-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* No Active Year Message */}
                            {!currentYear && (
                                <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-8 text-center">
                                    <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-yellow-400">No Active Semester</h3>
                                    <p className="text-white/50 mt-2">
                                        There is no active academic year configured. Please wait for an administrator to set up the new semester.
                                    </p>
                                </div>
                            )}

                            {/* Enrollment Closed Message */}
                            {currentYear && !currentYear.isEnrollmentOpen && !currentEnrollment && (
                                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-8 text-center">
                                    <ClockIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-red-400">Enrollment Period Closed</h3>
                                    <p className="text-white/50 mt-2">
                                        The enrollment period for this semester has ended. Please check back when the next enrollment opens.
                                    </p>
                                </div>
                            )}

                            {/* Enrollment History */}
                            {enrollmentHistory.length > 0 && (
                                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
                                    <div className="p-6 border-b border-white/10">
                                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <ClockIcon className="h-5 w-5 text-gold-400" />
                                            Enrollment History
                                        </h2>
                                    </div>

                                    <div className="divide-y divide-white/5">
                                        {enrollmentHistory.map((enrollment, index) => (
                                            <div
                                                key={enrollment.id}
                                                className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
                                            >
                                                {/* Timeline indicator */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full ${enrollment.feePaid ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`} />
                                                    {index < enrollmentHistory.length - 1 && (
                                                        <div className="w-0.5 h-8 bg-white/10 -mb-4 mt-1" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-semibold text-white">{enrollment.fullSection}</p>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig[enrollment.status]?.bg} ${statusConfig[enrollment.status]?.text}`}>
                                                            {enrollment.statusLabel}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-white/50 mt-1">{enrollment.semester}</p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="font-medium text-white">{enrollment.feeAmount}</p>
                                                    <p className={`text-sm ${enrollment.feePaid ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {enrollment.feePaid ? '✓ Paid' : '⏳ Unpaid'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Payment Instructions */}
                            {currentEnrollment && !currentEnrollment.feePaid && (
                                <div className="rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/30 p-6">
                                    <h3 className="text-lg font-semibold text-gold-400 flex items-center gap-2 mb-4">
                                        <CurrencyDollarIcon className="h-5 w-5" />
                                        Payment Required
                                    </h3>
                                    <p className="text-white/70 text-sm mb-4">
                                        Complete your enrollment by paying the department fee:
                                    </p>
                                    <div className="space-y-3 text-sm mb-6">
                                        <div className="flex items-start gap-2">
                                            <span className="text-gold-400">1.</span>
                                            <span className="text-white/70">Visit the SC office during office hours</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-gold-400">2.</span>
                                            <span className="text-white/70">Pay via GCash to SC Treasurer</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-gold-400">3.</span>
                                            <span className="text-white/70">Keep your receipt for verification</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('student.payments.index')}
                                        className="block w-full text-center rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold text-maroon-900 hover:bg-gold-400 transition-colors"
                                    >
                                        Go to Payments
                                    </Link>
                                </div>
                            )}

                            {/* Benefits Card */}
                            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    🎁 Member Benefits
                                </h3>
                                <ul className="space-y-3 text-sm">
                                    {[
                                        'Access to exclusive SC events',
                                        'Priority registration for seminars',
                                        'SC-exclusive merchandise discounts',
                                        'Networking opportunities',
                                        'Leadership development programs',
                                        'Free refreshments at events',
                                    ].map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-2 text-white/70">
                                            <CheckCircleIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quick Links */}
                            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                                <div className="space-y-2">
                                    <Link
                                        href={route('student.payments.index')}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                                    >
                                        <CurrencyDollarIcon className="h-5 w-5 text-gold-400" />
                                        Payment History
                                    </Link>
                                    <Link
                                        href="/calendar"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                                    >
                                        <CalendarDaysIcon className="h-5 w-5 text-blue-400" />
                                        Event Calendar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
