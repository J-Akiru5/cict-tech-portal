<?php

namespace App\Http\Controllers;

use App\Models\PaymentSetting;
use App\Models\PaymentRecord;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * PaymentController
 * 
 * Handles payment info display and student payment submissions.
 */
class PaymentController extends Controller
{
    /**
     * Display GCash payment info and student's payment history
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $academicYear = AcademicYear::getCurrentYear();
        
        // Get active payment settings
        $paymentSettings = PaymentSetting::active()
            ->where('academic_year_id', $academicYear?->id)
            ->get()
            ->map(fn($setting) => [
                'id' => $setting->id,
                'method' => $setting->payment_method,
                'methodLabel' => PaymentSetting::PAYMENT_METHODS[$setting->payment_method] ?? $setting->payment_method,
                'accountName' => $setting->account_name,
                'accountNumber' => $setting->account_number,
                'maskedNumber' => $setting->masked_account_number,
                'qrCodeUrl' => $setting->qr_code_url,
                'instructions' => $setting->instructions,
            ]);

        // Get user's payment records
        $paymentRecords = PaymentRecord::byUser($user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($record) => [
                'id' => $record->id,
                'type' => $record->payment_type,
                'typeLabel' => $record->payment_type_label,
                'description' => $record->description,
                'amount' => $record->formatted_amount,
                'rawAmount' => (float) $record->amount,
                'status' => $record->status,
                'statusLabel' => $record->status_label,
                'referenceNumber' => $record->reference_number,
                'paidAt' => $record->paid_at?->format('M d, Y g:i A'),
                'createdAt' => $record->created_at->format('M d, Y'),
                'rejectionReason' => $record->rejection_reason,
            ]);

        // Calculate totals
        $totalPaid = PaymentRecord::byUser($user->id)->paid()->sum('amount');
        $totalPending = PaymentRecord::byUser($user->id)->pending()->sum('amount');

        return Inertia::render('Student/Payments/Index', [
            'paymentSettings' => $paymentSettings,
            'paymentRecords' => $paymentRecords,
            'totals' => [
                'paid' => '₱' . number_format($totalPaid, 2),
                'pending' => '₱' . number_format($totalPending, 2),
            ],
            'paymentTypes' => PaymentRecord::PAYMENT_TYPES,
        ]);
    }

    /**
     * Submit a payment proof
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'payment_type' => ['required', 'in:membership_fee,event_fee,fine,other'],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1'],
            'reference_number' => ['required', 'string', 'max:50'],
            'proof' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        // Upload proof to R2 cloud storage
        $proofPath = $request->file('proof')->store('payment-proofs', 'r2');

        PaymentRecord::create([
            'user_id' => Auth::id(),
            'payment_type' => $validated['payment_type'],
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'reference_number' => $validated['reference_number'],
            'proof_path' => $proofPath,
            'paid_at' => now(),
            'status' => 'verifying',
            'academic_year_id' => AcademicYear::getCurrentYear()?->id,
        ]);

        return redirect()->route('student.payments.index')
            ->with('success', 'Payment submitted for verification!');
    }
}
