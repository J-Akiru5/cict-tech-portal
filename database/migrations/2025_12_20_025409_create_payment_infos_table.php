<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Payment settings (GCash account info)
        Schema::create('payment_settings', function (Blueprint $table) {
            $table->id();
            $table->string('payment_method')->default('gcash'); // gcash, bank, cash
            $table->string('account_name');
            $table->string('account_number');
            $table->string('qr_code_path')->nullable();
            $table->text('instructions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->onDelete('set null');
            $table->timestamps();
        });

        // Student payment records
        Schema::create('payment_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Payment type
            $table->string('payment_type'); // membership_fee, event_fee, fine, other
            $table->string('description');
            
            // Amount
            $table->decimal('amount', 10, 2);
            
            // Status
            $table->enum('status', ['pending', 'verifying', 'paid', 'rejected'])->default('pending');
            
            // Payment details
            $table->string('reference_number')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('proof_path')->nullable(); // Screenshot of payment
            
            // Verification
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // Academic year
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->onDelete('set null');
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('payment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_records');
        Schema::dropIfExists('payment_settings');
    }
};
