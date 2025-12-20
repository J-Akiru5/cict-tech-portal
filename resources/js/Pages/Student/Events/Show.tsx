import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Props {
    event: {
        id: number;
        title: string;
        description: string | null;
        type: string;
        typeLabel: string;
        eventDate: string;
        formattedTime: string;
        location: string | null;
        isOnline: boolean;
        meetingLink: string | null;
        requiresRegistration: boolean;
        isRegistrationOpen: boolean;
        registrationDeadline: string | null;
        maxAttendees: number | null;
        availableSlots: number | null;
        attendeeCount: number;
    };
    isRegistered: boolean;
    attendance: {
        status: string;
        checkedInAt: string | null;
    } | null;
}

export default function ShowEvent({ event, isRegistered, attendance }: Props) {
    const registerForm = useForm({});
    const unregisterForm = useForm({});

    const handleRegister = () => {
        registerForm.post(route('student.events.register', event.id));
    };

    const handleUnregister = () => {
        if (confirm('Are you sure you want to cancel your registration?')) {
            unregisterForm.delete(route('student.events.unregister', event.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={event.title} />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-3xl">
                    {/* Back Link */}
                    <Link
                        href={route('student.events.index')}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                        ← Back to Events
                    </Link>

                    {/* Header */}
                    <div className="mt-6 mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{event.typeLabel.split(' ')[0]}</span>
                            <span className="text-sm text-white/50 uppercase tracking-wider">
                                {event.type}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">{event.title}</h1>
                    </div>

                    {/* Main Content */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Event Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Date & Time */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                                    Date & Time
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-lg text-white">📅 {event.eventDate}</p>
                                    <p className="text-white/70">⏰ {event.formattedTime}</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                                    Location
                                </h3>
                                <p className="text-white">
                                    📍 {event.isOnline ? 'Online Event' : event.location || 'To be announced'}
                                </p>
                                {event.isOnline && event.meetingLink && isRegistered && (
                                    <a 
                                        href={event.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer" 
                                        className="mt-2 inline-block text-gold-400 hover:underline"
                                    >
                                        Join Meeting →
                                    </a>
                                )}
                            </div>

                            {/* Description */}
                            {event.description && (
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                    <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                                        About this Event
                                    </h3>
                                    <p className="text-white/80 whitespace-pre-wrap">{event.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Registration Sidebar */}
                        <div className="space-y-6">
                            {/* Registration Card */}
                            <div className={`rounded-2xl border p-6 ${
                                isRegistered 
                                    ? 'border-green-500/30 bg-green-500/10' 
                                    : 'border-white/10 bg-white/5'
                            }`}>
                                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
                                    Registration
                                </h3>

                                {isRegistered ? (
                                    <div>
                                        <div className="flex items-center gap-2 text-green-400 mb-4">
                                            <span className="text-xl">✓</span>
                                            <span className="font-medium">You're registered!</span>
                                        </div>
                                        {attendance?.checkedInAt && (
                                            <p className="text-sm text-white/50 mb-4">
                                                Checked in: {attendance.checkedInAt}
                                            </p>
                                        )}
                                        <button
                                            onClick={handleUnregister}
                                            disabled={unregisterForm.processing}
                                            className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                                        >
                                            Cancel Registration
                                        </button>
                                    </div>
                                ) : event.requiresRegistration ? (
                                    event.isRegistrationOpen ? (
                                        <div>
                                            <p className="text-sm text-white/60 mb-4">
                                                {event.attendeeCount} registered
                                                {event.maxAttendees && ` / ${event.maxAttendees} max`}
                                            </p>
                                            {event.registrationDeadline && (
                                                <p className="text-xs text-white/40 mb-4">
                                                    Deadline: {event.registrationDeadline}
                                                </p>
                                            )}
                                            <button
                                                onClick={handleRegister}
                                                disabled={registerForm.processing}
                                                className="w-full rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 py-3 text-sm font-semibold text-maroon-900 shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                            >
                                                {registerForm.processing ? 'Registering...' : 'Register Now'}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-white/50">Registration is closed</p>
                                    )
                                ) : (
                                    <p className="text-sm text-white/50">No registration required</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
