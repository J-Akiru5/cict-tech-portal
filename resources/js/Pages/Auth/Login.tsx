import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { FormEventHandler, useState } from 'react';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(true);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowErrorAlert(true);

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Check if there's an authentication error
    const hasAuthError = errors.email && (
        errors.email.includes('credentials') ||
        errors.email.includes('match') ||
        errors.email.includes('failed')
    );

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Authentication Error Alert Banner */}
            {hasAuthError && showErrorAlert && (
                <div className="mb-6 rounded-xl bg-red-500/20 border border-red-500/40 overflow-hidden animate-shake">
                    <div className="flex items-start gap-3 px-4 py-4">
                        <div className="flex-shrink-0 p-1 rounded-lg bg-red-500/30">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-red-400">
                                Authentication Failed
                            </h4>
                            <p className="mt-1 text-xs text-red-300/80">
                                The email address or password you entered is incorrect. Please check your credentials and try again.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setShowErrorAlert(false); clearErrors('email'); }}
                            className="flex-shrink-0 p-1 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4 text-red-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
                <p className="mt-3 text-sm text-white/50">
                    Sign in to access your CICT account
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl bg-emerald-500/20 px-4 py-3 text-sm font-medium text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
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
                            autoFocus
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
                            autoComplete="current-password"
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
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-5 w-5 rounded-md border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500/50 focus:ring-offset-0 transition-all cursor-pointer"
                            />
                        </div>
                        <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-gold-400/80 hover:text-gold-400 transition-colors font-medium"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 text-base font-bold text-maroon-900 shadow-lg shadow-gold-500/30 transition-all duration-300 hover:shadow-gold-500/50 hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 group"
                >
                    {/* Shine effect */}
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                    {processing ? (
                        <span className="relative flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Signing in...
                        </span>
                    ) : (
                            <span className="relative">Sign In</span>
                    )}
                </button>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-transparent px-4 text-sm text-white/40">
                            New to CICT Portal?
                        </span>
                    </div>
                </div>

                {/* Register Link */}
                <Link
                    href={route('register')}
                    className="block w-full text-center rounded-xl border-2 border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-gold-500/50 hover:text-gold-400"
                >
                    Create an Account
                </Link>
            </form>
        </GuestLayout>
    );
}
