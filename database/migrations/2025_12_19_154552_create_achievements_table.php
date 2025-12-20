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
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            
            // Core content
            $table->string('title');
            $table->text('description');
            
            // Type/Category
            $table->enum('type', [
                'achievement',
                'program',
                'event',
                'recognition',
                'milestone'
            ])->default('achievement');
            
            // Visuals
            $table->string('image')->nullable();
            $table->string('icon')->nullable(); // Emoji or icon class
            
            // Date
            $table->date('achieved_date')->nullable();
            
            // Visibility
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            
            // Optional link
            $table->string('link_url')->nullable();
            $table->string('link_text')->nullable();
            
            // Academic year
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->onDelete('set null');
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['is_featured', 'is_active']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
