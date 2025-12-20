<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Council Highlights Migration
 * 
 * Stores accomplishments and highlights for each council term.
 * Used for the "IT Through the Years" timeline feature.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('council_highlights', function (Blueprint $table) {
            $table->id();
            
            // Link to academic year
            $table->foreignId('academic_year_id')
                ->constrained()
                ->cascadeOnDelete();
            
            // Term label (e.g., "2022-2023", "2023-2024")
            $table->string('term_label');
            
            // Theme/Motto for the term
            $table->string('theme')->nullable();
            
            // Type of highlight: accomplishment, event, initiative, milestone
            $table->enum('type', ['accomplishment', 'event', 'initiative', 'milestone'])
                ->default('accomplishment');
            
            // Title of the highlight
            $table->string('title');
            
            // Detailed description
            $table->text('description');
            
            // Optional image path
            $table->string('image_path')->nullable();
            
            // Optional icon name (heroicons)
            $table->string('icon')->nullable();
            
            // Display order within the term
            $table->integer('display_order')->default(0);
            
            // Featured highlight (shows prominently)
            $table->boolean('is_featured')->default(false);
            
            // Color accent for the card (hex or tailwind color)
            $table->string('accent_color')->nullable();
            
            $table->timestamps();
            
            // Index for efficient querying by term
            $table->index(['academic_year_id', 'display_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('council_highlights');
    }
};
