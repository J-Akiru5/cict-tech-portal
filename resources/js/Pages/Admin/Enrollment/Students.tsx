import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import {
    UserGroupIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ArrowDownTrayIcon,
    FunnelIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

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

const statusConfig: Record<string, { bg: string; icon: typeof CheckCircleIcon }> = {
    pending: { bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: ClockIcon },
    enrolled: { bg: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircleIcon },
    dropped: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircleIcon },
};

export default function EnrollmentStudents({ enrollments = [], academicYears = [], selectedYearId, selectedStatus, selectedPaid, statuses }: Props) {
    const markPaidForm = useForm({});
    const [searchQuery, setSearchQuery] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleMarkPaid = (enrollmentId: number) => {
        setProcessingId(enrollmentId);
        markPaidForm.post(route('manage.enrollment.mark-paid', enrollmentId), {
            onFinish: () => setProcessingId(null),
        });
    };

    const filteredEnrollments = enrollments.filter(enrollment => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            enrollment.userName.toLowerCase().includes(query) ||
            enrollment.userEmail.toLowerCase().includes(query) ||
            (enrollment.userStudentId?.toLowerCase().includes(query)) ||
            enrollment.fullSection.toLowerCase().includes(query)
        );
    });

    // Stats from filtered enrollments
    const stats = {
        total: filteredEnrollments.length,
        paid: filteredEnrollments.filter(e => e.feePaid).length,
        unpaid: filteredEnrollments.filter(e => !e.feePaid).length,
    };

    return (
        <AdminLayout>
            <Head title="Enrolled Students" />

            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link
                            href={route('manage.enrollment.index')}
                            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-2"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Enrollment Management
                        </Link>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <UserGroupIcon className="h-7 w-7 text-gold-400" />
                            Enrolled Students
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats Mini Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                        <p className="text-xs text-white/50">Total Shown</p>
                    </div>
                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.paid}</p>
                        <p className="text-xs text-white/50">Paid</p>
                    </div>
                    <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-400">{stats.unpaid}</p>
                        <p className="text-xs text-white/50">Unpaid</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email, student ID, or section..."
                                className="w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 py-3 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                            />
                        </div>

                        {/* Year Filter */}
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="h-5 w-5 text-white/40" />
                            <select
                                value={selectedYearId}
                                onChange={(e) => router.get(route('manage.enrollment.students', { year_id: e.target.value }))}
                                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 appearance-none cursor-pointer min-w-[200px]"
                            >
                                {academicYears.map((year) => (
                                    <option key={year.id} value={year.id} className="bg-maroon-900">
                                        {year.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Link
                            href={route('manage.enrollment.students', { year_id: selectedYearId })}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${!selectedStatus && !selectedPaid
                                ? 'bg-gold-500 text-maroon-900 shadow-lg shadow-gold-500/25'
                                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                                }`}
                        >
                            All
                        </Link>
                        <Link
                            href={route('manage.enrollment.students', { year_id: selectedYearId, paid: 'false' })}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${selectedPaid === 'false'
                                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25'
                                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                                }`}
                        >
                            <ClockIcon className="h-4 w-4" />
                            Unpaid Only
                        </Link>
                        <Link
                            href={route('manage.enrollment.students', { year_id: selectedYearId, paid: 'true' })}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${selectedPaid === 'true'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                                }`}
                        >
                            <CheckCircleIcon className="h-4 w-4" />
                            Paid Only
                        </Link>
                    </div>
                </div>

                {/* Students List */}
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
                    {filteredEnrollments.length === 0 ? (
                        <div className="p-12 text-center">
                            <UserGroupIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white">No students found</h3>
                            <p className="text-white/50 mt-2">
                                {searchQuery
                                    ? 'Try adjusting your search query.'
                                    : 'No enrollments match your filter criteria.'}
                            </p>
                        </div>
                    ) : (
                            <div className="divide-y divide-white/5">
                                {/* Table Header */}
                                <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-white/5 text-sm text-white/50 font-medium">
                                    <div className="col-span-4">Student</div>
                                    <div className="col-span-2">Section</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-2">Fee</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                {filteredEnrollments.map((enrollment) => (
                                    <div
                                        key={enrollment.id}
                                        className="p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="md:grid md:grid-cols-12 gap-4 items-center">
                                            {/* Student Info */}
                                            <div className="col-span-4 flex items-center gap-3">
                                                <img
                                                    src={enrollment.userPhotoUrl}
                                                    alt={enrollment.userName}
                                                    className="h-10 w-10 rounded-full border-2 border-white/20 object-cover"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white truncate">{enrollment.userName}</p>
                                                    <p className="text-sm text-white/50 truncate">
                                                        {enrollment.userStudentId || enrollment.userEmail}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Section */}
                                            <div className="col-span-2 mt-3 md:mt-0">
                                                <p className="font-medium text-white">{enrollment.fullSection}</p>
                                                <p className="text-xs text-white/40 md:hidden">Section</p>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-2 mt-3 md:mt-0">
                                                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig[enrollment.status]?.bg || 'bg-white/10'}`}>
                                                    <span className="h-3 w-3 flex items-center justify-center">
                                                        {enrollment.status === 'enrolled' ? '✓' : enrollment.status === 'pending' ? '⏳' : '✗'}
                                                    </span>
                                                    {enrollment.statusLabel}
                                                </span>
                                            </div>

                                            {/* Fee */}
                                            <div className="col-span-2 mt-3 md:mt-0">
                                                <p className="font-medium text-white">{enrollment.feeAmount}</p>
                                                {enrollment.feePaid ? (
                                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                                        <CheckCircleIcon className="h-3 w-3" />
                                                        Paid
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-yellow-400 flex items-center gap-1">
                                                        <ClockIcon className="h-3 w-3" />
                                                        Unpaid
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-2 mt-4 md:mt-0 md:text-right">
                                                {enrollment.feePaid ? (
                                                    <span className="inline-flex items-center gap-1 text-sm text-green-400">
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleMarkPaid(enrollment.id)}
                                                            disabled={processingId === enrollment.id}
                                                            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {processingId === enrollment.id ? (
                                                                <>
                                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                    </svg>
                                                                    Processing
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CurrencyDollarIcon className="h-4 w-4" />
                                                                        Mark Paid
                                                                </>
                                                            )}
                                                    </button>
                                                )}
                                            </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary Footer */}
                <div className="mt-6 text-center text-sm text-white/50">
                    Showing {filteredEnrollments.length} of {enrollments.length} student{enrollments.length !== 1 ? 's' : ''}
                    {searchQuery && ` matching "${searchQuery}"`}
                </div>
            </div>
        </AdminLayout>
    );
}
