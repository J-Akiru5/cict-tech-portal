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
        Schema::create('officer_duties', function (Blueprint $table) {
            $table->id();
            
            // Day of week (0 = Monday, 6 = Sunday)
            $table->tinyInteger('day_of_week'); // 0-6
            
            // Time slots
            $table->time('start_time');
            $table->time('end_time');
            
            // Assigned officer
            $table->foreignId('officer_id')->constrained('officers')->onDelete('cascade');
            
            // Academic year for filtering
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            
            // Location (optional)
            $table->string('location')->nullable()->default('SC Office');
            
            // Notes
            $table->text('notes')->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['academic_year_id', 'day_of_week']);
            $table->index('officer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('officer_duties');
    }
};
