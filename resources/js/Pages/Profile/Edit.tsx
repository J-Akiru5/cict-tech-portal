import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormEventHandler, useRef, useState } from 'react';

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
    user: {
        id: number;
        name: string;
        email: string;
        student_id: string | null;
        course: string | null;
        year_level: string | null;
        section: string | null;
        phone: string | null;
        emergency_contact: string | null;
        emergency_phone: string | null;
        bio: string | null;
        facebook_url: string | null;
        photo_url: string;
    };
    courses: Record<string, string>;
    yearLevels: Record<string, string>;
}

export default function Edit({ mustVerifyEmail, status, user, courses, yearLevels }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PATCH',
        name: user.name,
        email: user.email,
        student_id: user.student_id || '',
        course: user.course || '',
        year_level: user.year_level || '',
        section: user.section || '',
        phone: user.phone || '',
        emergency_contact: user.emergency_contact || '',
        emergency_phone: user.emergency_phone || '',
        bio: user.bio || '',
        facebook_url: user.facebook_url || '',
        photo: null as File | null,
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoInput = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Profile" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                        <p className="text-white/60">Update your personal information</p>
                    </div>

                    {/* Success Message */}
                    {status && (
                        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-8">
                        {/* Profile Photo Section */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">Profile Photo</h2>
                            <div className="flex items-center gap-6">
                                <img
                                    src={photoPreview || user.photo_url}
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full border-2 border-gold-500/50 object-cover"
                                />
                                <div>
                                    <input
                                        ref={photoInput}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => photoInput.current?.click()}
                                        className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                    >
                                        Change Photo
                                    </button>
                                    <p className="mt-2 text-xs text-white/40">JPG, PNG or WebP. Max 2MB.</p>
                                    {errors.photo && <p className="mt-1 text-sm text-red-400">{errors.photo}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Basic Info Section */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="auth-label">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="auth-input"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="auth-label">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="auth-input"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Student Info Section */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">Student Information</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="auth-label">Student ID</label>
                                    <input
                                        type="text"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        placeholder="e.g., 2024-00001"
                                        className="auth-input"
                                    />
                                    {errors.student_id && <p className="mt-1 text-sm text-red-400">{errors.student_id}</p>}
                                </div>
                                <div>
                                    <label className="auth-label">Course</label>
                                    <select
                                        value={data.course}
                                        onChange={(e) => setData('course', e.target.value)}
                                        className="auth-input"
                                    >
                                        <option value="">Select course</option>
                                        {Object.entries(courses).map(([key, label]) => (
                                            <option key={key} value={key}>{key} - {label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="auth-label">Year Level</label>
                                    <select
                                        value={data.year_level}
                                        onChange={(e) => setData('year_level', e.target.value)}
                                        className="auth-input"
                                    >
                                        <option value="">Select year</option>
                                        {Object.entries(yearLevels).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="auth-label">Section</label>
                                    <input
                                        type="text"
                                        value={data.section}
                                        onChange={(e) => setData('section', e.target.value)}
                                        placeholder="e.g., A"
                                        className="auth-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Section */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="auth-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="09XX XXX XXXX"
                                        className="auth-input"
                                    />
                                </div>
                                <div>
                                    <label className="auth-label">Facebook URL</label>
                                    <input
                                        type="url"
                                        value={data.facebook_url}
                                        onChange={(e) => setData('facebook_url', e.target.value)}
                                        placeholder="https://facebook.com/..."
                                        className="auth-input"
                                    />
                                </div>
                                <div>
                                    <label className="auth-label">Emergency Contact Name</label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact}
                                        onChange={(e) => setData('emergency_contact', e.target.value)}
                                        className="auth-input"
                                    />
                                </div>
                                <div>
                                    <label className="auth-label">Emergency Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={data.emergency_phone}
                                        onChange={(e) => setData('emergency_phone', e.target.value)}
                                        className="auth-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">About You</h2>
                            <div>
                                <label className="auth-label">Bio</label>
                                <textarea
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    rows={3}
                                    maxLength={500}
                                    placeholder="Tell us about yourself..."
                                    className="auth-input resize-none"
                                />
                                <p className="mt-1 text-xs text-white/40">{data.bio.length}/500 characters</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="auth-btn-primary w-auto px-8 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
