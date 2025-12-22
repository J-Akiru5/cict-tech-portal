<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Reactions for achievement posts - multi-emoji support.
     */
    public function up(): void
    {
        Schema::create('post_reactions', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('post_id')->constrained('achievement_posts')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Reaction types: like, love, celebrate, applaud
            $table->enum('reaction_type', ['like', 'love', 'celebrate', 'applaud'])->default('like');
            
            $table->timestamp('created_at')->useCurrent();
            
            // One reaction per user per post
            $table->unique(['post_id', 'user_id']);
            
            // Index for counting
            $table->index(['post_id', 'reaction_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_reactions');
    }
};
