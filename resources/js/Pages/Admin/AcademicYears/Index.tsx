import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon,
    CalendarIcon,
    CheckCircleIcon,
    StarIcon
} from '@heroicons/react/24/outline';

interface AcademicYear {
    id: number;
    year_start: string;
    year_end: string;
    label: string;
    theme: string | null;
    semester: string;
    is_current: boolean;
    start_date: string | null;
    end_date: string | null;
    officers_count: number;
}

interface Props {
    academicYears: AcademicYear[];
}

export default function AcademicYearsIndex({ academicYears }: Props) {
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        router.delete(route('admin.academic-years.destroy', id), {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const handleSetCurrent = (id: number) => {
        router.post(route('admin.academic-years.set-current', id));
    };

    return (
        <AdminLayout>
            <Head title="Academic Year Management" />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Academic Years</h1>
                            <p className="text-white/60">Manage academic years and terms</p>
                        </div>
                        <Link
                            href={route('admin.academic-years.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 font-semibold text-maroon-900 transition-all hover:bg-gold-400"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Add Year
                        </Link>
                    </div>

                    {/* Academic Years Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {academicYears.map((year) => (
                            <div
                                key={year.id}
                                className={`rounded-xl border p-6 backdrop-blur-sm transition-all ${
                                    year.is_current
                                        ? 'border-gold-500/50 bg-gold-500/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                            >
                                {/* Current Badge */}
                                {year.is_current && (
                                    <div className="mb-3 flex items-center gap-1 text-gold-400">
                                        <StarIcon className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Current Year</span>
                                    </div>
                                )}

                                {/* Year Label */}
                                <h3 className="text-xl font-bold text-white mb-1">
                                    {year.year_start}-{year.year_end}
                                </h3>
                                <p className="text-white/60 text-sm mb-2">{year.semester} Semester</p>

                                {/* Theme */}
                                {year.theme && (
                                    <p className="text-gold-400/80 text-sm italic mb-4">"{year.theme}"</p>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        {year.start_date ? new Date(year.start_date).toLocaleDateString() : 'No dates set'}
                                    </span>
                                    <span>{year.officers_count} officers</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                                    {!year.is_current && (
                                        <button
                                            onClick={() => handleSetCurrent(year.id)}
                                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-green-400 hover:bg-green-500/20 transition-colors"
                                        >
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Set Current
                                        </button>
                                    )}
                                    <Link
                                        href={route('admin.academic-years.edit', year.id)}
                                        className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </Link>
                                    {deleteConfirm === year.id ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(year.id)}
                                                className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/20"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(year.id)}
                                            className="rounded-lg p-2 text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                            disabled={year.is_current}
                                            title={year.is_current ? 'Cannot delete current year' : 'Delete'}
                                        >
                                            <TrashIcon className={`h-5 w-5 ${year.is_current ? 'opacity-30' : ''}`} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {academicYears.length === 0 && (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                            <CalendarIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">No Academic Years</h3>
                            <p className="text-white/60 mb-4">Get started by creating your first academic year.</p>
                            <Link
                                href={route('admin.academic-years.create')}
                                className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 font-semibold text-maroon-900"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Add Year
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
