<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds position classification columns to support the SC Constitution structure.
     */
    public function up(): void
    {
        Schema::table('officers', function (Blueprint $table) {
            // Position classification per SC Constitution
            $table->enum('position_type', ['elected', 'appointed'])->default('elected')->after('position_short');
            $table->string('position_category')->nullable()->after('position_type'); // executive, director, class_rep, special, appointed
            
            // For Class Representatives
            $table->string('section')->nullable()->after('position_category'); // A, B, C, D, E
            $table->tinyInteger('class_year')->nullable()->after('section'); // 1, 2, 3, 4
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('officers', function (Blueprint $table) {
            $table->dropColumn(['position_type', 'position_category', 'section', 'class_year']);
        });
    }
};
