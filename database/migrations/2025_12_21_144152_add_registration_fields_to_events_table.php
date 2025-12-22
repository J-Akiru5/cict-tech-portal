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
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'requires_registration')) {
                $table->boolean('requires_registration')->default(false);
            }
            if (!Schema::hasColumn('events', 'max_attendees')) {
                $table->integer('max_attendees')->nullable();
            }
            if (!Schema::hasColumn('events', 'registration_deadline')) {
                $table->dateTime('registration_deadline')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'requires_registration')) {
                $table->dropColumn('requires_registration');
            }
            if (Schema::hasColumn('events', 'max_attendees')) {
                $table->dropColumn('max_attendees');
            }
            if (Schema::hasColumn('events', 'registration_deadline')) {
                $table->dropColumn('registration_deadline');
            }
        });
    }
};
