<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Achievement posts - Twitter-like feed for SC accomplishments.
     */
    public function up(): void
    {
        Schema::create('achievement_posts', function (Blueprint $table) {
            $table->id();
            
            // Author (must be an authorized officer)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Term context
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            
            // Content
            $table->string('title');
            $table->text('content');
            $table->enum('category', ['event', 'award', 'project'])->default('event');
            
            // Media
            $table->string('image_path')->nullable();
            
            // Display
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_featured')->default(false);
            
            // Cached counts for performance
            $table->unsignedInteger('reactions_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['academic_year_id', 'created_at']);
            $table->index('category');
            $table->index('is_pinned');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievement_posts');
    }
};
