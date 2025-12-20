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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            
            // Event details
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            
            // Type
            $table->enum('type', [
                'seminar',
                'workshop',
                'meeting',
                'social',
                'competition',
                'other'
            ])->default('other');
            
            // Date/Time
            $table->date('event_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            
            // Location
            $table->string('location')->nullable();
            $table->boolean('is_online')->default(false);
            $table->string('meeting_link')->nullable();
            
            // Registration
            $table->boolean('requires_registration')->default(false);
            $table->integer('max_attendees')->nullable();
            $table->timestamp('registration_deadline')->nullable();
            
            // Academic year
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->onDelete('set null');
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('event_date');
            $table->index('type');
        });

        // Attendance pivot table
        Schema::create('event_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Status
            $table->enum('status', ['registered', 'attended', 'absent', 'excused'])->default('registered');
            
            // Check-in
            $table->timestamp('checked_in_at')->nullable();
            $table->string('check_in_method')->nullable(); // qr, manual, etc.
            
            // Notes
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Unique constraint
            $table->unique(['event_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_attendances');
        Schema::dropIfExists('events');
    }
};
