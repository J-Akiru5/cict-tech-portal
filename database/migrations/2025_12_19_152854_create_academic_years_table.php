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
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            
            // Year info
            $table->string('year_start', 4); // e.g., "2024"
            $table->string('year_end', 4);   // e.g., "2025"
            $table->string('label')->unique(); // e.g., "A.Y. 2024-2025"
            
            // Semester (optional, for semester-based terms)
            $table->enum('semester', ['1st', '2nd', 'full'])->default('full');
            
            // Status
            $table->boolean('is_current')->default(false);
            
            // Date range
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('is_current');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
