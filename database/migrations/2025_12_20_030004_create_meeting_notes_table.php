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
        Schema::create('meeting_notes', function (Blueprint $table) {
            $table->id();
            
            // Meeting details
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('type', ['regular', 'emergency', 'special', 'committee'])->default('regular');
            
            // Date and venue
            $table->date('meeting_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('venue')->nullable();
            
            // Content
            $table->text('agenda')->nullable();
            $table->longText('minutes')->nullable();
            $table->text('resolutions')->nullable();
            $table->text('action_items')->nullable();
            
            // Attachments
            $table->json('attachments')->nullable();
            
            // Author
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            
            // Status
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'archived'])->default('draft');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            
            // Academic year
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->onDelete('set null');
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('meeting_date');
            $table->index('status');
        });

        // Meeting attendees
        Schema::create('meeting_attendees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_note_id')->constrained('meeting_notes')->onDelete('cascade');
            $table->foreignId('officer_id')->constrained('officers')->onDelete('cascade');
            $table->enum('status', ['present', 'absent', 'late', 'excused'])->default('present');
            $table->text('remarks')->nullable();
            $table->timestamps();
            
            $table->unique(['meeting_note_id', 'officer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_attendees');
        Schema::dropIfExists('meeting_notes');
    }
};
