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
        Schema::table('users', function (Blueprint $table) {
            // Student info
            $table->string('student_id')->nullable()->unique()->after('email');
            $table->string('course')->nullable()->after('student_id'); // BSIT, BSCS, etc.
            $table->string('year_level')->nullable()->after('course'); // 1st, 2nd, 3rd, 4th
            $table->string('section')->nullable()->after('year_level');
            
            // Contact info
            $table->string('phone')->nullable()->after('section');
            $table->string('emergency_contact')->nullable()->after('phone');
            $table->string('emergency_phone')->nullable()->after('emergency_contact');
            
            // Profile
            $table->string('photo')->nullable()->after('emergency_phone');
            $table->text('bio')->nullable()->after('photo');
            
            // Social
            $table->string('facebook_url')->nullable()->after('bio');
            
            // Status
            $table->boolean('is_active')->default(true)->after('facebook_url');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'student_id',
                'course',
                'year_level',
                'section',
                'phone',
                'emergency_contact',
                'emergency_phone',
                'photo',
                'bio',
                'facebook_url',
                'is_active',
                'last_login_at',
            ]);
        });
    }
};
