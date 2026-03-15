<?php

namespace App\Cache;

use App\Services\UpstashRedis;
use Illuminate\Contracts\Cache\Store;

/**
 * Upstash Cache Store for Laravel
 * 
 * Custom cache store using Upstash REST API.
 */
class UpstashStore implements Store
{
    protected UpstashRedis $redis;
    protected string $prefix;

    public function __construct(UpstashRedis $redis, string $prefix = '')
    {
        $this->redis = $redis;
        $this->prefix = $prefix;
    }

    protected function prefixKey(string $key): string
    {
        return $this->prefix . $key;
    }

    public function get($key): mixed
    {
        $value = $this->redis->get($this->prefixKey($key));
        return $value ? unserialize($value) : null;
    }

    public function many(array $keys): array
    {
        $results = [];
        foreach ($keys as $key) {
            $results[$key] = $this->get($key);
        }
        return $results;
    }

    public function put($key, $value, $seconds): bool
    {
        return $this->redis->setex(
            $this->prefixKey($key),
            max(1, (int) $seconds),
            serialize($value)
        );
    }

    public function putMany(array $values, $seconds): bool
    {
        foreach ($values as $key => $value) {
            $this->put($key, $value, $seconds);
        }
        return true;
    }

    public function increment($key, $value = 1): int|bool
    {
        // Simple implementation - get, increment, put
        $current = $this->get($key) ?? 0;
        $new = $current + $value;
        $ttl = $this->redis->ttl($this->prefixKey($key));
        $this->put($key, $new, $ttl > 0 ? $ttl : 3600);
        return $new;
    }

    public function decrement($key, $value = 1): int|bool
    {
        return $this->increment($key, -$value);
    }

    public function forever($key, $value): bool
    {
        return $this->redis->set($this->prefixKey($key), serialize($value));
    }

    public function forget($key): bool
    {
        return $this->redis->del($this->prefixKey($key)) > 0;
    }

    public function flush(): bool
    {
        return $this->redis->flushdb();
    }

    public function getPrefix(): string
    {
        return $this->prefix;
    }
}
