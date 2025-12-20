<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Client\RequestException;

/**
 * GeminiService - Google Gemini AI API wrapper for CICT Tech Portal.
 *
 * Provides methods for chat, content generation, summarization, and smart search.
 * Includes rate limiting, caching, and CICT-specific context management.
 *
 * @package App\Services
 */
class GeminiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;
    private string $systemPrompt;
    private bool $cacheEnabled;
    private int $cacheTtl;

    public function __construct()
    {
        $this->apiKey = config('ai.gemini.api_key', '');
        $this->model = config('ai.gemini.model', 'gemini-1.5-flash');
        $this->baseUrl = config('ai.gemini.base_url');
        $this->systemPrompt = config('ai.context.system_prompt', '');
        $this->cacheEnabled = config('ai.cache.enabled', true);
        $this->cacheTtl = config('ai.cache.ttl_minutes', 5);
    }

    /**
     * Check if the service is properly configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Check rate limit for a user.
     *
     * @param int|string $userId
     * @return bool True if rate limit exceeded
     */
    public function isRateLimited(int|string $userId): bool
    {
        $key = "ai-rate-limit:{$userId}";
        $maxAttempts = config('ai.rate_limit.per_user', 20);
        $decayMinutes = config('ai.rate_limit.window_minutes', 1);

        return RateLimiter::tooManyAttempts($key, $maxAttempts);
    }

    /**
     * Increment rate limit counter.
     *
     * @param int|string $userId
     */
    public function hitRateLimit(int|string $userId): void
    {
        $key = "ai-rate-limit:{$userId}";
        $decayMinutes = config('ai.rate_limit.window_minutes', 1);

        RateLimiter::hit($key, $decayMinutes * 60);
    }

    /**
     * Get remaining rate limit attempts.
     *
     * @param int|string $userId
     * @return int
     */
    public function remainingAttempts(int|string $userId): int
    {
        $key = "ai-rate-limit:{$userId}";
        $maxAttempts = config('ai.rate_limit.per_user', 20);

        return RateLimiter::remaining($key, $maxAttempts);
    }

    /**
     * Send a chat message and get AI response.
     *
     * @param string $message User's message
     * @param array $conversationHistory Previous messages for context
     * @param string|null $additionalContext Extra context to prepend
     * @return array{success: bool, response?: string, error?: string}
     */
    public function chat(
        string $message,
        array $conversationHistory = [],
        ?string $additionalContext = null
    ): array {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'AI service not configured'];
        }

        // Build the full context
        $systemContent = $this->systemPrompt;
        if ($additionalContext) {
            $systemContent .= "\n\nAdditional Context:\n{$additionalContext}";
        }

        // Build contents array for Gemini API
        $contents = [];

        // Add conversation history
        foreach ($conversationHistory as $msg) {
            $contents[] = [
                'role' => $msg['role'] === 'user' ? 'user' : 'model',
                'parts' => [['text' => $msg['content']]],
            ];
        }

        // Add current message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $message]],
        ];

        return $this->callGemini($contents, $systemContent);
    }

    /**
     * Generate content (announcements, event descriptions, etc.).
     *
     * @param string $type Type of content (announcement, event, social)
     * @param string $prompt User's prompt/description
     * @param array $context Additional context data
     * @return array{success: bool, response?: string, error?: string}
     */
    public function generate(string $type, string $prompt, array $context = []): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'AI service not configured'];
        }

        $typePrompts = [
            'announcement' => "Generate a professional announcement for the CICT Student Council. Make it engaging, clear, and well-formatted with markdown. User request: {$prompt}",
            'event' => "Generate an engaging event description for a CICT Student Council event. Include key details, make it exciting for students. User request: {$prompt}",
            'social' => "Generate a social media post (for Facebook) about this CICT SC update. Keep it casual, engaging, and include relevant emojis. User request: {$prompt}",
        ];

        $fullPrompt = $typePrompts[$type] ?? "Generate content based on this request: {$prompt}";

        if (!empty($context)) {
            $contextStr = json_encode($context, JSON_PRETTY_PRINT);
            $fullPrompt .= "\n\nContext data:\n{$contextStr}";
        }

        $contents = [
            ['role' => 'user', 'parts' => [['text' => $fullPrompt]]],
        ];

        // Check cache
        if ($this->cacheEnabled) {
            $cacheKey = 'ai-generate:' . md5($fullPrompt);
            $cached = Cache::get($cacheKey);
            if ($cached) {
                return ['success' => true, 'response' => $cached, 'cached' => true];
            }
        }

        $result = $this->callGemini($contents, $this->systemPrompt);

        // Cache successful responses
        if ($result['success'] && $this->cacheEnabled) {
            Cache::put($cacheKey, $result['response'], now()->addMinutes($this->cacheTtl));
        }

        return $result;
    }

    /**
     * Summarize text content.
     *
     * @param string $text Text to summarize
     * @param string $style Summary style (brief, detailed, bullet)
     * @return array{success: bool, response?: string, error?: string}
     */
    public function summarize(string $text, string $style = 'brief'): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'AI service not configured'];
        }

        $stylePrompts = [
            'brief' => 'Provide a brief TL;DR summary (2-3 sentences max)',
            'detailed' => 'Provide a detailed summary covering all main points',
            'bullet' => 'Summarize as bullet points (5-7 key points max)',
        ];

        $styleInstruction = $stylePrompts[$style] ?? $stylePrompts['brief'];

        $prompt = "{$styleInstruction}:\n\n{$text}";

        // Check cache
        if ($this->cacheEnabled) {
            $cacheKey = 'ai-summary:' . md5($prompt);
            $cached = Cache::get($cacheKey);
            if ($cached) {
                return ['success' => true, 'response' => $cached, 'cached' => true];
            }
        }

        $contents = [
            ['role' => 'user', 'parts' => [['text' => $prompt]]],
        ];

        $result = $this->callGemini($contents);

        // Cache successful responses
        if ($result['success'] && $this->cacheEnabled) {
            Cache::put($cacheKey, $result['response'], now()->addMinutes($this->cacheTtl));
        }

        return $result;
    }

    /**
     * Perform semantic search / answer questions about content.
     *
     * @param string $query User's search query
     * @param array $documents Array of documents to search through
     * @return array{success: bool, response?: string, error?: string}
     */
    public function search(string $query, array $documents): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'AI service not configured'];
        }

        // Format documents for context
        $docContext = "";
        foreach ($documents as $index => $doc) {
            $docContext .= "Document " . ($index + 1) . ":\n";
            $docContext .= "Title: " . ($doc['title'] ?? 'Untitled') . "\n";
            $docContext .= "Content: " . ($doc['content'] ?? '') . "\n\n";
        }

        $prompt = <<<PROMPT
Based on the following documents, answer this query: "{$query}"

If the query matches specific documents, cite them. If no relevant information is found, say so politely.

Documents:
{$docContext}
PROMPT;

        $contents = [
            ['role' => 'user', 'parts' => [['text' => $prompt]]],
        ];

        return $this->callGemini($contents, $this->systemPrompt);
    }

    /**
     * Call the Gemini API.
     *
     * @param array $contents Message contents
     * @param string|null $systemInstruction System prompt
     * @return array{success: bool, response?: string, error?: string}
     */
    private function callGemini(array $contents, ?string $systemInstruction = null): array
    {
        try {
            $endpoint = "{$this->baseUrl}/models/{$this->model}:generateContent";

            $payload = [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topP' => 0.95,
                    'topK' => 40,
                    'maxOutputTokens' => 2048,
                ],
            ];

            // Add system instruction if provided
            if ($systemInstruction) {
                $payload['systemInstruction'] = [
                    'parts' => [['text' => $systemInstruction]],
                ];
            }

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
                ->timeout(30)
                ->post("{$endpoint}?key={$this->apiKey}", $payload);

            if ($response->failed()) {
                Log::error('Gemini API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'error' => 'AI service temporarily unavailable. Please try again.',
                ];
            }

            $data = $response->json();

            // Extract text from response
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$text) {
                return [
                    'success' => false,
                    'error' => 'No response generated. Please try rephrasing your request.',
                ];
            }

            return [
                'success' => true,
                'response' => $text,
            ];

        } catch (RequestException $e) {
            Log::error('Gemini API request exception', ['exception' => $e->getMessage()]);

            return [
                'success' => false,
                'error' => 'Failed to connect to AI service. Please try again later.',
            ];
        } catch (\Exception $e) {
            Log::error('Gemini service error', ['exception' => $e->getMessage()]);

            return [
                'success' => false,
                'error' => 'An unexpected error occurred. Please try again.',
            ];
        }
    }
}
