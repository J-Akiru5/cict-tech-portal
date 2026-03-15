import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { FormEventHandler, useState } from 'react';
import {
    EyeIcon,
    EyeSlashIcon,
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Password validation indicators
    const passwordHas8Chars = data.password.length >= 8;
    const passwordsMatch = data.password && data.password === data.password_confirmation;

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
                <p className="mt-3 text-sm text-white/50">
                    Join the CICT Student Community
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <UserIcon className="w-5 h-5 text-white/40" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={data.name}
                            className="w-full rounded-xl border border-white/20 bg-white/5 pl-12 pr-4 py-3.5 text-white placeholder-white/40 transition-all duration-300 focus:border-gold-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-500/20 hover:border-white/30"
                            placeholder="Juan Dela Cruz"
                            autoComplete="name"
                            autoFocus
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <EnvelopeIcon className="w-5 h-5 text-white/40" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full rounded-xl border border-white/20 bg-white/5 pl-12 pr-4 py-3.5 text-white placeholder-white/40 transition-all duration-300 focus:border-gold-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-500/20 hover:border-white/30"
                            placeholder="you@example.com"
                            autoComplete="username"
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password with Show/Hide Toggle */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon className="w-5 h-5 text-white/40" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="w-full rounded-xl border border-white/20 bg-white/5 pl-12 pr-12 py-3.5 text-white placeholder-white/40 transition-all duration-300 focus:border-gold-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-500/20 hover:border-white/30"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-gold-400 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {/* Password strength indicator */}
                    {data.password && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                            <CheckCircleIcon className={`w-4 h-4 ${passwordHas8Chars ? 'text-emerald-400' : 'text-white/30'}`} />
                            <span className={passwordHas8Chars ? 'text-emerald-400' : 'text-white/40'}>
                                At least 8 characters
                            </span>
                        </div>
                    )}
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password with Show/Hide Toggle */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-white/80 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon className="w-5 h-5 text-white/40" />
                        </div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full rounded-xl border border-white/20 bg-white/5 pl-12 pr-12 py-3.5 text-white placeholder-white/40 transition-all duration-300 focus:border-gold-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-500/20 hover:border-white/30"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-gold-400 transition-colors"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {/* Password match indicator */}
                    {data.password_confirmation && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                            <CheckCircleIcon className={`w-4 h-4 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`} />
                            <span className={passwordsMatch ? 'text-emerald-400' : 'text-red-400'}>
                                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                            </span>
                        </div>
                    )}
                    {errors.password_confirmation && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 text-base font-bold text-maroon-900 shadow-lg shadow-gold-500/30 transition-all duration-300 hover:shadow-gold-500/50 hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 group mt-6"
                >
                    {/* Shine effect */}
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                    {processing ? (
                        <span className="relative flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating account...
                        </span>
                    ) : (
                            <span className="relative">Create Account</span>
                    )}
                </button>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-transparent px-4 text-sm text-white/40">
                            Already have an account?
                        </span>
                    </div>
                </div>

                {/* Login Link */}
                <Link
                    href={route('login')}
                    className="block w-full text-center rounded-xl border-2 border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-gold-500/50 hover:text-gold-400"
                >
                    Sign In Instead
                </Link>
            </form>
        </GuestLayout>
    );
}
