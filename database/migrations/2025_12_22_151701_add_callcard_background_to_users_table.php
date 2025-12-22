<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Adds callcard_background field for student ID card customization
     * and custom_callcard_image for uploaded backgrounds.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('callcard_background')->default('default')->after('bio');
            $table->string('custom_callcard_image')->nullable()->after('callcard_background');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['callcard_background', 'custom_callcard_image']);
        });
    }
};
