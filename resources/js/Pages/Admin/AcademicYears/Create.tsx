import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateAcademicYear() {
    const currentYear = new Date().getFullYear();
    
    const { data, setData, post, processing, errors } = useForm({
        year_start: currentYear.toString(),
        year_end: (currentYear + 1).toString(),
        label: '',
        theme: '',
        semester: 'full',
        start_date: '',
        end_date: '',
        enrollment_start: '',
        enrollment_end: '',
        department_fee: '0',
        is_current: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.academic-years.store'));
    };

    // Auto-generate label when years change
    const handleYearChange = (field: 'year_start' | 'year_end', value: string) => {
        setData(field, value);
        if (field === 'year_start') {
            setData('label', `A.Y. ${value}-${data.year_end}`);
        } else {
            setData('label', `A.Y. ${data.year_start}-${value}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Create Academic Year" />
            
            <div className="min-h-screen bg-gradient-to-b from-maroon-950 via-maroon-900 to-black py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('admin.academic-years.index')}
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Academic Years
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Create Academic Year</h1>
                        <p className="text-white/60">Add a new academic year to the system</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <div className="space-y-6">
                            {/* Year Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Year Start
                                    </label>
                                    <input
                                        type="text"
                                        value={data.year_start}
                                        onChange={(e) => handleYearChange('year_start', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                        placeholder="2024"
                                        maxLength={4}
                                    />
                                    {errors.year_start && <p className="mt-1 text-sm text-red-400">{errors.year_start}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Year End
                                    </label>
                                    <input
                                        type="text"
                                        value={data.year_end}
                                        onChange={(e) => handleYearChange('year_end', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                        placeholder="2025"
                                        maxLength={4}
                                    />
                                    {errors.year_end && <p className="mt-1 text-sm text-red-400">{errors.year_end}</p>}
                                </div>
                            </div>

                            {/* Label */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    placeholder="A.Y. 2024-2025"
                                />
                            </div>

                            {/* Theme */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Theme (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.theme}
                                    onChange={(e) => setData('theme', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    placeholder="e.g., Digital Transformation Era"
                                />
                            </div>

                            {/* Semester */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Semester
                                </label>
                                <select
                                    value={data.semester}
                                    onChange={(e) => setData('semester', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                >
                                    <option value="1st">1st Semester</option>
                                    <option value="2nd">2nd Semester</option>
                                    <option value="full">Full Year</option>
                                </select>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    />
                                </div>
                            </div>

                            {/* Enrollment Period */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Enrollment Start
                                    </label>
                                    <input
                                        type="date"
                                        value={data.enrollment_start}
                                        onChange={(e) => setData('enrollment_start', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">
                                        Enrollment End
                                    </label>
                                    <input
                                        type="date"
                                        value={data.enrollment_end}
                                        onChange={(e) => setData('enrollment_end', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    />
                                </div>
                            </div>

                            {/* Department Fee */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Department Fee (₱)
                                </label>
                                <input
                                    type="number"
                                    value={data.department_fee}
                                    onChange={(e) => setData('department_fee', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {/* Is Current */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_current"
                                    checked={data.is_current}
                                    onChange={(e) => setData('is_current', e.target.checked)}
                                    className="rounded border-white/30 bg-white/10 text-gold-500 focus:ring-gold-500/50"
                                />
                                <label htmlFor="is_current" className="text-sm text-white/80">
                                    Set as current academic year
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex items-center justify-end gap-4">
                            <Link
                                href={route('admin.academic-years.index')}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-gold-500 px-6 py-2 font-semibold text-maroon-900 transition-all hover:bg-gold-400 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Academic Year'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
