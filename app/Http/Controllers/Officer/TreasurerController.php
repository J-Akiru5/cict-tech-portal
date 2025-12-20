<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\PaymentRecord;
use App\Models\Officer;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * TreasurerController
 * 
 * Handles payment verification and financial tracking for the Treasurer role.
 */
class TreasurerController extends Controller
{
    /**
     * Dashboard with pending payments
     */
    public function index(Request $request): Response
    {
        $status = $request->get('status', 'verifying');
        
        $query = PaymentRecord::with(['user', 'academicYear'])
            ->orderByDesc('created_at');
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        $payments = $query->get()->map(fn($payment) => [
            'id' => $payment->id,
            'userName' => $payment->user?->name,
            'userStudentId' => $payment->user?->student_id,
            'userPhotoUrl' => $payment->user?->photo_url,
            'type' => $payment->payment_type,
            'typeLabel' => $payment->payment_type_label,
            'description' => $payment->description,
            'amount' => $payment->formatted_amount,
            'rawAmount' => (float) $payment->amount,
            'referenceNumber' => $payment->reference_number,
            'proofUrl' => $payment->proof_url,
            'status' => $payment->status,
            'statusLabel' => $payment->status_label,
            'paidAt' => $payment->paid_at?->format('M d, Y g:i A'),
            'createdAt' => $payment->created_at->format('M d, Y'),
        ]);

        // Stats
        $stats = [
            'pendingCount' => PaymentRecord::where('status', 'verifying')->count(),
            'pendingAmount' => '₱' . number_format(PaymentRecord::where('status', 'verifying')->sum('amount'), 2),
            'paidToday' => '₱' . number_format(PaymentRecord::where('status', 'paid')->whereDate('verified_at', today())->sum('amount'), 2),
            'totalPaid' => '₱' . number_format(PaymentRecord::where('status', 'paid')->sum('amount'), 2),
        ];

        return Inertia::render('Officer/Treasurer/Index', [
            'payments' => $payments,
            'stats' => $stats,
            'statuses' => PaymentRecord::STATUSES,
            'selectedStatus' => $status,
        ]);
    }

    /**
     * Verify a payment
     */
    public function verify(PaymentRecord $payment)
    {
        $payment->update([
            'status' => 'paid',
            'verified_by' => Auth::id(),
            'verified_at' => now(),
        ]);

        return back()->with('success', 'Payment verified successfully!');
    }

    /**
     * Reject a payment
     */
    public function reject(Request $request, PaymentRecord $payment)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $payment->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
            'verified_by' => Auth::id(),
            'verified_at' => now(),
        ]);

        return back()->with('success', 'Payment rejected.');
    }

    /**
     * Officer fee tracking
     */
    public function officerFees(Request $request): Response
    {
        $academicYear = AcademicYear::getCurrentYear();
        
        $officers = Officer::currentYear()
            ->with(['user'])
            ->get()
            ->map(function ($officer) {
                $paidAmount = PaymentRecord::where('user_id', $officer->user_id)
                    ->where('payment_type', 'membership_fee')
                    ->where('status', 'paid')
                    ->sum('amount');

                return [
                    'id' => $officer->id,
                    'name' => $officer->name,
                    'position' => $officer->position,
                    'photoUrl' => $officer->photo_url,
                    'paidAmount' => '₱' . number_format($paidAmount, 2),
                    'rawPaidAmount' => (float) $paidAmount,
                    'isPaid' => $paidAmount >= 100, // Assume 100 is membership fee
                ];
            });

        return Inertia::render('Officer/Treasurer/OfficerFees', [
            'officers' => $officers,
            'academicYear' => $academicYear?->label ?? 'Current Year',
        ]);
    }
}
