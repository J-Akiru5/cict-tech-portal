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
        Schema::create('officers', function (Blueprint $table) {
            $table->id();
            
            // Officer info
            $table->string('name');
            $table->string('position');
            $table->string('position_short')->nullable(); // e.g., "Pres", "VP"
            
            // Position hierarchy for org chart layout
            $table->integer('hierarchy_level')->default(0); // 0 = top (Dean/Adviser), 1 = President, etc.
            $table->integer('sort_order')->default(0); // Order within same level
            
            // Contact & Social
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('facebook_url')->nullable();
            
            // Profile
            $table->string('photo')->nullable();
            $table->string('course')->nullable(); // e.g., "BSIT", "BSCS"
            $table->string('year_level')->nullable(); // e.g., "3rd Year"
            $table->text('motto')->nullable(); // Personal motto/quote
            
            // Term
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            
            // Optional link to user account
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Status
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['academic_year_id', 'hierarchy_level']);
            $table->index('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('officers');
    }
};
