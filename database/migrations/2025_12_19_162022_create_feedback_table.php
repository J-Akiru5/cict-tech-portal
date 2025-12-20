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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            
            // Submitter
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Category
            $table->enum('category', [
                'suggestion',
                'complaint',
                'inquiry',
                'appreciation',
                'other'
            ])->default('suggestion');
            
            // Content
            $table->string('subject');
            $table->text('message');
            
            // Priority
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            
            // Status
            $table->enum('status', [
                'pending',
                'in_review',
                'resolved',
                'closed'
            ])->default('pending');
            
            // Response
            $table->text('response')->nullable();
            $table->foreignId('responded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('responded_at')->nullable();
            
            // Anonymous option
            $table->boolean('is_anonymous')->default(false);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
