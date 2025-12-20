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
        // Add enrollment period fields to academic_years
        Schema::table('academic_years', function (Blueprint $table) {
            $table->date('enrollment_start')->nullable()->after('end_date');
            $table->date('enrollment_end')->nullable()->after('enrollment_start');
            $table->decimal('department_fee', 8, 2)->default(50.00)->after('enrollment_end');
        });

        // Create enrollments table - tracks student enrollment per semester
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            
            // Student
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Academic term
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            
            // Student info for this semester
            $table->string('course'); // BSIT, BSCS, etc.
            $table->string('year_level'); // 1st Year, 2nd Year, etc.
            $table->string('section'); // A, B, C, etc.
            
            // Enrollment status
            $table->enum('status', ['pending', 'enrolled', 'dropped'])->default('pending');
            $table->timestamp('enrolled_at')->nullable();
            
            // Department fee payment
            $table->boolean('fee_paid')->default(false);
            $table->decimal('fee_amount', 8, 2)->default(50.00);
            $table->foreignId('payment_record_id')->nullable()->constrained('payment_records')->onDelete('set null');
            $table->timestamp('fee_paid_at')->nullable();
            
            $table->timestamps();
            
            // Each student can only enroll once per academic term
            $table->unique(['user_id', 'academic_year_id']);
            
            // Indexes
            $table->index('status');
            $table->index('fee_paid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
        
        Schema::table('academic_years', function (Blueprint $table) {
            $table->dropColumn(['enrollment_start', 'enrollment_end', 'department_fee']);
        });
    }
};
