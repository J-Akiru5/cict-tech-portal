import { 
    CheckBadgeIcon, 
    ExclamationTriangleIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';

interface VitalMetricsGridProps {
    vitalMetrics: {
        enrollment_status: string;
        absences: number;
        total_required_events: number;
        outstanding_balance: number;
        fee_paid: boolean;
    };
}

/**
 * VitalMetricsGrid - Displays key student metrics in a horizontal card grid
 * 
 * Metrics:
 * - Enrollment Status
 * - Required Event Absences
 * - Outstanding Balance
 */
export default function VitalMetricsGrid({ vitalMetrics }: VitalMetricsGridProps) {
    const {
        enrollment_status,
        absences,
        total_required_events,
        outstanding_balance,
        fee_paid,
    } = vitalMetrics;

    // Enrollment status styling
    const getEnrollmentStyle = () => {
        switch (enrollment_status) {
            case 'enrolled':
                return {
                    bg: 'from-emerald-500/20 to-emerald-600/10',
                    border: 'border-emerald-500/30',
                    text: 'text-emerald-400',
                    label: 'Enrolled',
                    icon: '✅',
                };
            case 'pending':
                return {
                    bg: 'from-yellow-500/20 to-yellow-600/10',
                    border: 'border-yellow-500/30',
                    text: 'text-yellow-400',
                    label: 'Pending',
                    icon: '⏳',
                };
            default:
                return {
                    bg: 'from-red-500/20 to-red-600/10',
                    border: 'border-red-500/30',
                    text: 'text-red-400',
                    label: 'Not Enrolled',
                    icon: '❌',
                };
        }
    };

    const enrollmentStyle = getEnrollmentStyle();
    const hasAbsences = absences > 0;
    const hasBalance = outstanding_balance > 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Enrollment Status */}
            <div className={`
                relative overflow-hidden rounded-2xl border ${enrollmentStyle.border}
                bg-gradient-to-br ${enrollmentStyle.bg}
                p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5
            `}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{enrollmentStyle.icon}</span>
                    <CheckBadgeIcon className={`w-5 h-5 ${enrollmentStyle.text} opacity-50`} />
                </div>
                <p className={`text-2xl font-bold ${enrollmentStyle.text}`}>
                    {enrollmentStyle.label}
                </p>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                    Enrollment Status
                </p>
            </div>

            {/* Required Event Absences */}
            <div className={`
                relative overflow-hidden rounded-2xl border
                ${hasAbsences ? 'border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-orange-600/10' : 'border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]'}
                p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5
            `}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">📋</span>
                    {hasAbsences ? (
                        <ExclamationTriangleIcon className="w-5 h-5 text-orange-400 opacity-50" />
                    ) : (
                        <CalendarDaysIcon className="w-5 h-5 text-white/30" />
                    )}
                </div>
                <p className={`text-2xl font-bold ${hasAbsences ? 'text-orange-400' : 'text-white'}`}>
                    {absences}/{total_required_events}
                </p>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                    Event Absences
                </p>
                {hasAbsences && (
                    <p className="text-[10px] text-orange-400/70 mt-2">
                        ⚠️ You have missed required events
                    </p>
                )}
            </div>

            {/* Outstanding Balance */}
            <div className={`
                relative overflow-hidden rounded-2xl border
                ${hasBalance ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-600/10' : 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5'}
                p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5
            `}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{hasBalance ? '💰' : '✨'}</span>
                    <CurrencyDollarIcon className={`w-5 h-5 ${hasBalance ? 'text-amber-400' : 'text-emerald-400'} opacity-50`} />
                </div>
                <p className={`text-2xl font-bold ${hasBalance ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {hasBalance ? `₱${outstanding_balance.toFixed(2)}` : 'Paid'}
                </p>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                    Department Fee
                </p>
                {hasBalance && (
                    <p className="text-[10px] text-amber-400/70 mt-2">
                        💳 Please settle your balance
                    </p>
                )}
            </div>
        </div>
    );
}
