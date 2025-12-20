import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface Payment {
    id: number;
    userName: string;
    userStudentId: string | null;
    userPhotoUrl: string;
    type: string;
    typeLabel: string;
    description: string;
    amount: string;
    rawAmount: number;
    referenceNumber: string | null;
    proofUrl: string | null;
    status: string;
    statusLabel: string;
    paidAt: string | null;
    createdAt: string;
}

interface Props {
    payments: Payment[];
    stats: {
        pendingCount: number;
        pendingAmount: string;
        paidToday: string;
        totalPaid: string;
    };
    statuses: Record<string, string>;
    selectedStatus: string;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    verifying: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    paid: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function TreasurerIndex({ payments, stats, statuses, selectedStatus }: Props) {
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    
    const verifyForm = useForm({});
    const rejectForm = useForm({ reason: '' });

    const handleVerify = (paymentId: number) => {
        verifyForm.post(route('officer.treasurer.verify', paymentId));
    };

    const handleReject = (paymentId: number) => {
        rejectForm.transform(() => ({ reason: rejectReason }));
        rejectForm.post(route('officer.treasurer.reject', paymentId), {
            onSuccess: () => {
                setSelectedPayment(null);
                setRejectReason('');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Treasurer Dashboard" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Treasurer Dashboard</h1>
                            <p className="text-white/60">Verify payments and track finances</p>
                        </div>
                        <Link
                            href={route('officer.treasurer.officer-fees')}
                            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        >
                            Officer Fees
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-center">
                            <p className="text-2xl font-bold text-blue-400">{stats.pendingCount}</p>
                            <p className="text-sm text-white/50">Pending Verification</p>
                        </div>
                        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
                            <p className="text-2xl font-bold text-yellow-400">{stats.pendingAmount}</p>
                            <p className="text-sm text-white/50">Pending Amount</p>
                        </div>
                        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
                            <p className="text-2xl font-bold text-green-400">{stats.paidToday}</p>
                            <p className="text-sm text-white/50">Verified Today</p>
                        </div>
                        <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-4 text-center">
                            <p className="text-2xl font-bold text-gold-400">{stats.totalPaid}</p>
                            <p className="text-sm text-white/50">Total Collected</p>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        <Link
                            href={route('officer.treasurer.index', { status: 'all' })}
                            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                selectedStatus === 'all' 
                                    ? 'bg-gold-500 text-maroon-900 font-medium' 
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                        >
                            All
                        </Link>
                        {Object.entries(statuses).map(([key, label]) => (
                            <Link
                                key={key}
                                href={route('officer.treasurer.index', { status: key })}
                                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                                    selectedStatus === key 
                                        ? 'bg-gold-500 text-maroon-900 font-medium' 
                                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Payments List */}
                    {payments.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                            <div className="text-5xl mb-4">💰</div>
                            <h3 className="text-lg font-medium text-white">No payments found</h3>
                            <p className="text-white/50 mt-2">Payments will appear here when students submit.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={payment.userPhotoUrl}
                                            alt={payment.userName}
                                            className="h-12 w-12 rounded-full border border-white/20"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-white">{payment.userName}</p>
                                                    <p className="text-sm text-white/50">
                                                        {payment.userStudentId || 'No ID'} • {payment.typeLabel}
                                                    </p>
                                                    <p className="text-sm text-white/70 mt-1">{payment.description}</p>
                                                    {payment.referenceNumber && (
                                                        <p className="text-xs text-white/40 mt-1">
                                                            Ref: {payment.referenceNumber}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-white">{payment.amount}</p>
                                                    <span className={`inline-block mt-1 rounded-full border px-2 py-0.5 text-xs ${statusColors[payment.status]}`}>
                                                        {payment.statusLabel}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Actions for verifying status */}
                                            {payment.status === 'verifying' && (
                                                <div className="mt-4 flex items-center gap-3">
                                                    {payment.proofUrl && (
                                                        <a
                                                            href={payment.proofUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-gold-400 hover:underline"
                                                        >
                                                            View Proof →
                                                        </a>
                                                    )}
                                                    <div className="flex-1" />
                                                    <button
                                                        onClick={() => setSelectedPayment(payment)}
                                                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerify(payment.id)}
                                                        disabled={verifyForm.processing}
                                                        className="rounded-lg bg-green-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-600 transition-colors"
                                                    >
                                                        Verify
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reject Modal */}
                    {selectedPayment && (
                        <>
                            <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setSelectedPayment(null)} />
                            <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border border-white/10 bg-maroon-900 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Reject Payment</h3>
                                <p className="text-sm text-white/60 mb-4">
                                    Payment of {selectedPayment.amount} from {selectedPayment.userName}
                                </p>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Reason for rejection..."
                                    rows={3}
                                    className="auth-input resize-none mb-4"
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setSelectedPayment(null)}
                                        className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedPayment.id)}
                                        disabled={!rejectReason || rejectForm.processing}
                                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                                    >
                                        Reject Payment
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
