import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormEventHandler, useRef, useState } from 'react';

interface PaymentSetting {
    id: number;
    method: string;
    methodLabel: string;
    accountName: string;
    accountNumber: string;
    maskedNumber: string;
    qrCodeUrl: string | null;
    instructions: string | null;
}

interface PaymentRecord {
    id: number;
    type: string;
    typeLabel: string;
    description: string;
    amount: string;
    rawAmount: number;
    status: string;
    statusLabel: string;
    referenceNumber: string | null;
    paidAt: string | null;
    createdAt: string;
    rejectionReason: string | null;
}

interface Props {
    paymentSettings: PaymentSetting[];
    paymentRecords: PaymentRecord[];
    totals: {
        paid: string;
        pending: string;
    };
    paymentTypes: Record<string, string>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    verifying: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    paid: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function PaymentsIndex({ paymentSettings, paymentRecords, totals, paymentTypes }: Props) {
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const proofInput = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_type: 'membership_fee',
        description: '',
        amount: '',
        reference_number: '',
        proof: null as File | null,
    });

    const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('proof', file);
            setProofPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.payments.submit'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setShowSubmitForm(false);
                setProofPreview(null);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payments" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Payments</h1>
                            <p className="text-white/60">GCash payment info & your records</p>
                        </div>
                        <button
                            onClick={() => setShowSubmitForm(!showSubmitForm)}
                            className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 text-sm font-semibold text-maroon-900 shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all"
                        >
                            {showSubmitForm ? 'Cancel' : '+ Submit Payment'}
                        </button>
                    </div>

                    {/* Submit Form */}
                    {showSubmitForm && (
                        <form onSubmit={submit} className="mb-8 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-6 backdrop-blur-sm">
                            <h2 className="text-lg font-semibold text-white mb-4">Submit Payment Proof</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="auth-label">Payment Type</label>
                                    <select
                                        value={data.payment_type}
                                        onChange={(e) => setData('payment_type', e.target.value)}
                                        className="auth-input"
                                    >
                                        {Object.entries(paymentTypes).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="auth-label">Amount (₱)</label>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        min="1"
                                        step="0.01"
                                        className="auth-input"
                                    />
                                    {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="auth-label">Description</label>
                                    <input
                                        type="text"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="e.g., 1st Semester Membership Fee"
                                        className="auth-input"
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                                </div>
                                <div>
                                    <label className="auth-label">GCash Reference Number</label>
                                    <input
                                        type="text"
                                        value={data.reference_number}
                                        onChange={(e) => setData('reference_number', e.target.value)}
                                        placeholder="e.g., 1234567890123"
                                        className="auth-input"
                                    />
                                    {errors.reference_number && <p className="mt-1 text-sm text-red-400">{errors.reference_number}</p>}
                                </div>
                                <div>
                                    <label className="auth-label">Payment Proof (Screenshot)</label>
                                    <input
                                        ref={proofInput}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProofChange}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => proofInput.current?.click()}
                                            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                        >
                                            Choose File
                                        </button>
                                        {proofPreview && (
                                            <img src={proofPreview} alt="Proof" className="h-10 w-10 rounded object-cover" />
                                        )}
                                    </div>
                                    {errors.proof && <p className="mt-1 text-sm text-red-400">{errors.proof}</p>}
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-2.5 text-sm font-semibold text-maroon-900 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit for Verification'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* GCash Info */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4">💳 Payment Accounts</h2>
                        {paymentSettings.length === 0 ? (
                            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                                <p className="text-white/50">No payment accounts configured yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {paymentSettings.map((setting) => (
                                    <div 
                                        key={setting.id} 
                                        className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl">
                                                {setting.method === 'gcash' ? '📱' : setting.method === 'bank' ? '🏦' : '💵'}
                                            </span>
                                            <span className="font-semibold text-white">{setting.methodLabel}</span>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p className="text-white/70">
                                                <span className="text-white/40">Name:</span> {setting.accountName}
                                            </p>
                                            <p className="text-white/70">
                                                <span className="text-white/40">Number:</span> {setting.accountNumber}
                                            </p>
                                        </div>
                                        {setting.qrCodeUrl && (
                                            <img 
                                                src={setting.qrCodeUrl} 
                                                alt="QR Code" 
                                                className="mt-3 h-32 w-32 rounded-lg bg-white p-1"
                                            />
                                        )}
                                        {setting.instructions && (
                                            <p className="mt-3 text-xs text-white/40">{setting.instructions}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Totals */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
                            <p className="text-2xl font-bold text-green-400">{totals.paid}</p>
                            <p className="text-sm text-white/50">Total Paid</p>
                        </div>
                        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-center">
                            <p className="text-2xl font-bold text-yellow-400">{totals.pending}</p>
                            <p className="text-sm text-white/50">Pending</p>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-4">📜 Payment History</h2>
                        {paymentRecords.length === 0 ? (
                            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                                <p className="text-white/50">No payment records yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {paymentRecords.map((record) => (
                                    <div
                                        key={record.id}
                                        className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-white">{record.description}</p>
                                                <p className="text-sm text-white/50">
                                                    {record.typeLabel} • {record.createdAt}
                                                </p>
                                                {record.referenceNumber && (
                                                    <p className="text-xs text-white/40 mt-1">
                                                        Ref: {record.referenceNumber}
                                                    </p>
                                                )}
                                                {record.rejectionReason && (
                                                    <p className="text-sm text-red-400 mt-2">
                                                        Reason: {record.rejectionReason}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-white">{record.amount}</p>
                                                <span className={`inline-block mt-1 rounded-full border px-2 py-0.5 text-xs ${statusColors[record.status]}`}>
                                                    {record.statusLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
