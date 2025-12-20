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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            
            // Core content
            $table->string('title');
            $table->text('content');
            $table->text('excerpt')->nullable(); // Short preview
            
            // Categorization
            $table->enum('category', [
                'general',
                'event',
                'meeting',
                'academic',
                'achievement',
                'urgent'
            ])->default('general');
            
            // Priority and visibility
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_published')->default(false);
            
            // Scheduling
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            
            // Media
            $table->string('featured_image')->nullable();
            
            // Relations
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            
            // SEO/Slugs
            $table->string('slug')->unique();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['is_published', 'published_at']);
            $table->index('category');
            $table->index('is_pinned');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
