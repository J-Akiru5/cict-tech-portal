<?php

namespace Database\Seeders;

use App\Models\PaymentSetting;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;

/**
 * PaymentSettingSeeder
 * 
 * Seeds GCash payment info for testing.
 */
class PaymentSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $academicYear = AcademicYear::getCurrentYear();

        PaymentSetting::create([
            'payment_method' => 'gcash',
            'account_name' => 'CICT Student Council',
            'account_number' => '09171234567',
            'instructions' => 'Please include your Student ID in the message when sending payment. Screenshot the payment confirmation and submit it through the portal.',
            'is_active' => true,
            'academic_year_id' => $academicYear?->id,
        ]);

        $this->command->info("✅ Created GCash payment setting!");
    }
}
