import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';
import {
    AcademicCapIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
    PencilSquareIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface AcademicYear {
    id: number;
    label: string;
    semester: string;
    isCurrent: boolean;
    enrollmentStart: string | null;
    enrollmentEnd: string | null;
    enrollmentStartFormatted: string | null;
    enrollmentEndFormatted: string | null;
    departmentFee: number | string;
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

export default function EnrollmentAdminIndex({ academicYears = [], currentYearId, stats }: Props) {
    const { flash } = usePage().props as any;
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
    
    const { data, setData, put, processing, reset } = useForm({
        enrollment_start: '',
        enrollment_end: '',
        department_fee: 50,
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleEdit = (year: AcademicYear) => {
        setEditingYear(year);
        setData({
            enrollment_start: year.enrollmentStart || '',
            enrollment_end: year.enrollmentEnd || '',
            department_fee: Number(year.departmentFee) || 50,
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

    const currentYear = academicYears.find(y => y.isCurrent);

    return (
        <AdminLayout>
            <Head title="Enrollment Management" />

            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <AcademicCapIcon className="h-7 w-7 text-gold-400" />
                            Enrollment Management
                        </h1>
                        <p className="text-white/60 text-sm mt-1">Configure enrollment periods and manage student enrollments</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('manage.enrollment.students')}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 text-sm font-bold text-maroon-900 hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/25"
                        >
                            <UserGroupIcon className="h-4 w-4" />
                            View All Students
                        </Link>
                        <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Export Data
                        </button>
                    </div>
                </div>

                {/* Stats Dashboard */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Total Enrolled */}
                        <div className="rounded-2xl bg-gradient-to-br from-green-900/30 to-green-950/30 border border-green-500/20 backdrop-blur-xl p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/50 text-sm">Total Enrolled</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.totalEnrolled}</p>
                                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                                        <CheckCircleIcon className="h-3 w-3" />
                                        This semester
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                                    <UserGroupIcon className="h-6 w-6 text-green-400" />
                                </div>
                            </div>
                        </div>

                        {/* Pending Payment */}
                        <div className="rounded-2xl bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 border border-yellow-500/20 backdrop-blur-xl p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/50 text-sm">Pending Payment</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.pendingPayment}</p>
                                    <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                                        <ClockIcon className="h-3 w-3" />
                                        Awaiting fee
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
                                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        {/* Fully Paid */}
                        <div className="rounded-2xl bg-gradient-to-br from-blue-900/30 to-blue-950/30 border border-blue-500/20 backdrop-blur-xl p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/50 text-sm">Fully Paid</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.totalPaid}</p>
                                    <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                                        <CheckCircleIcon className="h-3 w-3" />
                                        Completed
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                                    <CheckCircleIcon className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Total Collected */}
                        <div className="rounded-2xl bg-gradient-to-br from-gold-900/30 to-gold-950/30 border border-gold-500/20 backdrop-blur-xl p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/50 text-sm">Total Collected</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.totalCollected}</p>
                                    <p className="text-xs text-gold-400 mt-2 flex items-center gap-1">
                                        <CurrencyDollarIcon className="h-3 w-3" />
                                        Revenue
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-gold-500/20 border border-gold-500/30">
                                    <CurrencyDollarIcon className="h-6 w-6 text-gold-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Current Period Banner */}
                {currentYear && (
                    <div className={`rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${currentYear.isEnrollmentOpen
                        ? 'bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20'
                        : 'bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20'
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${currentYear.isEnrollmentOpen ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}>
                                <CalendarDaysIcon className={`h-8 w-8 ${currentYear.isEnrollmentOpen ? 'text-green-400' : 'text-red-400'
                                    }`} />
                            </div>
                            <div>
                                <p className="text-sm text-white/50">Current Enrollment Period</p>
                                <p className="text-xl font-bold text-white">{currentYear.label} - {currentYear.semester}</p>
                                {currentYear.enrollmentStartFormatted && currentYear.enrollmentEndFormatted ? (
                                    <p className={`text-sm ${currentYear.isEnrollmentOpen ? 'text-green-400' : 'text-red-400'}`}>
                                        {currentYear.isEnrollmentOpen ? '● Enrollment Open' : '● Enrollment Closed'}
                                        {' '}({currentYear.enrollmentStartFormatted} — {currentYear.enrollmentEndFormatted})
                                    </p>
                                ) : (
                                    <p className="text-sm text-yellow-400">⚠ Enrollment period not configured</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm text-white/50">Department Fee</p>
                                <p className="text-2xl font-bold text-gold-400">₱{Number(currentYear.departmentFee ?? 50).toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => handleEdit(currentYear)}
                                className="p-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <PencilSquareIcon className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Academic Years List */}
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <ChartBarIcon className="h-5 w-5 text-gold-400" />
                            All Academic Years
                        </h2>
                    </div>

                    <div className="divide-y divide-white/5">
                        {academicYears.map((year) => (
                            <div
                                key={year.id}
                                className={`p-5 ${year.isCurrent ? 'bg-gold-500/5' : 'hover:bg-white/5'} transition-colors`}
                            >
                                {editingYear?.id === year.id ? (
                                    /* Edit Mode */
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-white">{year.label}</h3>
                                                <span className="text-white/50">- {year.semester} Semester</span>
                                                {year.isCurrent && (
                                                    <span className="px-2 py-0.5 rounded-full bg-gold-500 text-xs font-bold text-maroon-900">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-white/90 mb-2">
                                                    Enrollment Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.enrollment_start}
                                                    onChange={(e) => setData('enrollment_start', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-white/90 mb-2">
                                                    Enrollment End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.enrollment_end}
                                                    onChange={(e) => setData('enrollment_end', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-white/90 mb-2">
                                                    Department Fee (₱)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.department_fee}
                                                    onChange={(e) => setData('department_fee', parseFloat(e.target.value))}
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSave}
                                                disabled={processing}
                                                className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircleIcon className="h-4 w-4" />
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                        /* View Mode */
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl ${year.isCurrent ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-white/10 border border-white/10'
                                                    }`}>
                                                    <CalendarDaysIcon className={`h-5 w-5 ${year.isCurrent ? 'text-gold-400' : 'text-white/50'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-semibold text-white">{year.label}</h3>
                                                        <span className="text-sm text-white/50">- {year.semester} Semester</span>
                                                        {year.isCurrent && (
                                                            <span className="px-2 py-0.5 rounded-full bg-gold-500 text-xs font-bold text-maroon-900">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>
                                                    {year.enrollmentStartFormatted && year.enrollmentEndFormatted ? (
                                                        <p className={`text-sm mt-1 ${year.isEnrollmentOpen ? 'text-green-400' : 'text-white/40'}`}>
                                                            {year.isEnrollmentOpen ? '● Open' : '○ Closed'}
                                                            {' '}• {year.enrollmentStartFormatted} — {year.enrollmentEndFormatted}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-white/30 mt-1">No enrollment period configured</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-white/50">Fee</p>
                                                    <p className="font-semibold text-white">₱{Number(year.departmentFee ?? 50).toFixed(2)}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleEdit(year)}
                                                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                    Edit
                                                </button>
                                            </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {academicYears.length === 0 && (
                            <div className="p-12 text-center">
                                <CalendarDaysIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
                                <p className="text-white/50">No academic years configured</p>
                                <p className="text-sm text-white/30 mt-1">Create one in the Academic Years section first</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
