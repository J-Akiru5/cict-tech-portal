<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Performance Optimization: Add Missing Indexes
 * 
 * These indexes improve query performance for frequently accessed columns.
 * Compatible with PostgreSQL (Supabase).
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Users table - frequently filtered by course and creation date
        Schema::table('users', function (Blueprint $table) {
            $table->index('course', 'idx_users_course');
            $table->index('created_at', 'idx_users_created_at');
        });

        // Announcements - filtered by published status
        Schema::table('announcements', function (Blueprint $table) {
            $table->index(['is_published', 'published_at'], 'idx_announcements_published');
        });

        // Payment records - frequently filtered by status
        Schema::table('payment_records', function (Blueprint $table) {
            $table->index('status', 'idx_payment_records_status');
        });

        // Achievement posts - frequently sorted by creation
        Schema::table('achievement_posts', function (Blueprint $table) {
            $table->index('created_at', 'idx_achievement_posts_created');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_course');
            $table->dropIndex('idx_users_created_at');
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->dropIndex('idx_announcements_published');
        });

        Schema::table('payment_records', function (Blueprint $table) {
            $table->dropIndex('idx_payment_records_status');
        });

        Schema::table('achievement_posts', function (Blueprint $table) {
            $table->dropIndex('idx_achievement_posts_created');
        });
    }
};
