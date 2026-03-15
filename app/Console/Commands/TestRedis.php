<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class TestRedis extends Command
{
    protected $signature = 'redis:test';
    protected $description = 'Test Redis/Upstash connection';

    public function handle(): int
    {
        $this->info('Testing Redis connection...');
        
        try {
            // Test write
            Cache::put('redis_test_key', 'Upstash Redis is working!', 60);
            $this->info('✓ Write successful');
            
            // Test read
            $value = Cache::get('redis_test_key');
            $this->info("✓ Read successful: {$value}");
            
            // Test delete
            Cache::forget('redis_test_key');
            $this->info('✓ Delete successful');
            
            $this->newLine();
            $this->info('🎉 Redis connection is working perfectly!');
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('✗ Redis connection failed!');
            $this->error('Error: ' . $e->getMessage());
            
            return Command::FAILURE;
        }
    }
}
