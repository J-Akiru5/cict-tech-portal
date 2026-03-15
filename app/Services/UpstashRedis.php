<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Upstash Redis REST Client
 * 
 * Uses Upstash's HTTP REST API instead of TCP connection.
 * This bypasses TLS socket issues on Windows.
 */
class UpstashRedis
{
    private string $url;
    private string $token;

    public function __construct()
    {
        $this->url = config('services.upstash.url');
        $this->token = config('services.upstash.token');
    }

    /**
     * Execute a Redis command via REST API
     * Upstash REST API format: POST /COMMAND/arg1/arg2/arg3
     */
    public function command(string $command, array $args = []): mixed
    {
        // Build URL path: /COMMAND/arg1/arg2/...
        $path = '/' . strtoupper($command);
        foreach ($args as $arg) {
            $path .= '/' . urlencode((string) $arg);
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->get($this->url . $path);

        if (!$response->successful()) {
            throw new \Exception('Upstash request failed: ' . $response->body());
        }

        $data = $response->json();
        return $data['result'] ?? null;
    }

    /**
     * GET key
     */
    public function get(string $key): ?string
    {
        return $this->command('GET', [$key]);
    }

    /**
     * SET key value [EX seconds]
     */
    public function set(string $key, string $value, ?int $ttl = null): bool
    {
        $args = [$key, $value];
        if ($ttl) {
            $args[] = 'EX';
            $args[] = $ttl;
        }
        return $this->command('SET', $args) === 'OK';
    }

    /**
     * SETEX key seconds value
     */
    public function setex(string $key, int $seconds, string $value): bool
    {
        return $this->command('SETEX', [$key, $seconds, $value]) === 'OK';
    }

    /**
     * DEL key
     */
    public function del(string $key): int
    {
        return (int) $this->command('DEL', [$key]);
    }

    /**
     * EXISTS key
     */
    public function exists(string $key): bool
    {
        return (bool) $this->command('EXISTS', [$key]);
    }

    /**
     * TTL key
     */
    public function ttl(string $key): int
    {
        return (int) $this->command('TTL', [$key]);
    }

    /**
     * EXPIRE key seconds
     */
    public function expire(string $key, int $seconds): bool
    {
        return (bool) $this->command('EXPIRE', [$key, $seconds]);
    }

    /**
     * PING
     */
    public function ping(): bool
    {
        return $this->command('PING') === 'PONG';
    }

    /**
     * FLUSHDB
     */
    public function flushdb(): bool
    {
        return $this->command('FLUSHDB') === 'OK';
    }
}
