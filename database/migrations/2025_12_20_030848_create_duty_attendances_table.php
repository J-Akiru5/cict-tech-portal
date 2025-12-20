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
        Schema::create('duty_attendances', function (Blueprint $table) {
            $table->id();
            
            // Link to scheduled duty
            $table->foreignId('officer_duty_id')->constrained('officer_duties')->onDelete('cascade');
            $table->foreignId('officer_id')->constrained('officers')->onDelete('cascade');
            
            // Date of duty
            $table->date('duty_date');
            
            // Check-in/out times
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('checked_out_at')->nullable();
            
            // Status
            $table->enum('status', ['present', 'late', 'absent', 'excused'])->default('absent');
            
            // Late/Absent handling
            $table->integer('late_minutes')->default(0);
            $table->boolean('has_fine')->default(false);
            $table->decimal('fine_amount', 8, 2)->nullable();
            $table->boolean('fine_paid')->default(false);
            
            // Excuse
            $table->text('excuse_reason')->nullable();
            $table->boolean('excuse_approved')->default(false);
            $table->foreignId('excuse_approved_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Notes
            $table->text('notes')->nullable();
            
            // Academic year
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->unique(['officer_duty_id', 'officer_id', 'duty_date']);
            $table->index('duty_date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('duty_attendances');
    }
};
