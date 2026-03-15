<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TestR2 extends Command
{
    protected $signature = 'r2:test';
    protected $description = 'Test Cloudflare R2 connection';

    public function handle(): int
    {
        $this->info('Testing Cloudflare R2 connection...');
        
        try {
            $disk = Storage::disk('r2');
            
            // Test write
            $testFile = 'test-' . time() . '.txt';
            $disk->put($testFile, 'R2 Storage is working!');
            $this->info('✓ Write successful');
            
            // Test read
            $content = $disk->get($testFile);
            $this->info("✓ Read successful: {$content}");
            
            // Test exists
            if ($disk->exists($testFile)) {
                $this->info('✓ File exists check passed');
            }
            
            // Test delete
            $disk->delete($testFile);
            $this->info('✓ Delete successful');
            
            $this->newLine();
            $this->info('🎉 Cloudflare R2 connection is working perfectly!');
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('✗ R2 connection failed!');
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();
            $this->warn('Make sure you have set these in .env:');
            $this->line('  CLOUDFLARE_R2_ACCESS_KEY_ID=...');
            $this->line('  CLOUDFLARE_R2_SECRET_ACCESS_KEY=...');
            $this->line('  CLOUDFLARE_R2_BUCKET=...');
            $this->line('  CLOUDFLARE_R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com');
            
            return Command::FAILURE;
        }
    }
}
