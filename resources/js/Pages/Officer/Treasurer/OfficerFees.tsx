import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Officer {
    id: number;
    name: string;
    position: string;
    photoUrl: string;
    paidAmount: string;
    rawPaidAmount: number;
    isPaid: boolean;
}

interface Props {
    officers: Officer[];
    academicYear: string;
}

export default function OfficerFees({ officers, academicYear }: Props) {
    const paidCount = officers.filter(o => o.isPaid).length;
    const totalCollected = officers.reduce((sum, o) => sum + o.rawPaidAmount, 0);

    return (
        <AuthenticatedLayout>
            <Head title="Officer Fees" />

            <div className="py-8 px-4 sm:px-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('officer.treasurer.index')}
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            ← Back to Treasurer Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-white mt-4">Officer Fees</h1>
                        <p className="text-white/60">{academicYear} Membership Fee Status</p>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
                            <p className="text-3xl font-bold text-green-400">{paidCount}/{officers.length}</p>
                            <p className="text-sm text-white/50">Officers Paid</p>
                        </div>
                        <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-5 text-center">
                            <p className="text-3xl font-bold text-gold-400">₱{totalCollected.toLocaleString()}</p>
                            <p className="text-sm text-white/50">Total Collected</p>
                        </div>
                    </div>

                    {/* Officer List */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10">
                        {officers.map((officer) => (
                            <div key={officer.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={officer.photoUrl}
                                        alt={officer.name}
                                        className="h-12 w-12 rounded-full border border-white/20"
                                    />
                                    <div>
                                        <p className="font-medium text-white">{officer.name}</p>
                                        <p className="text-sm text-white/50">{officer.position}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${officer.isPaid ? 'text-green-400' : 'text-white/50'}`}>
                                        {officer.paidAmount}
                                    </p>
                                    <span className={`text-xs font-medium ${
                                        officer.isPaid 
                                            ? 'text-green-400' 
                                            : 'text-yellow-400'
                                    }`}>
                                        {officer.isPaid ? '✓ Paid' : '⏳ Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
