<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * AIController - Handles all AI-related API endpoints.
 *
 * Provides endpoints for chatbot, content generation, summarization, and search.
 * Includes rate limiting and request validation.
 *
 * @package App\Http\Controllers
 */
class AIController extends Controller
{
    public function __construct(
        private readonly GeminiService $gemini
    ) {}

    /**
     * Check if AI service is available.
     */
    public function status(): JsonResponse
    {
        return response()->json([
            'configured' => $this->gemini->isConfigured(),
            'features' => [
                'chatbot' => config('ai.features.chatbot', false),
                'content_generation' => config('ai.features.content_generation', false),
                'smart_search' => config('ai.features.smart_search', false),
                'summarization' => config('ai.features.summarization', false),
            ],
        ]);
    }

    /**
     * Chat endpoint for the AI assistant.
     */
    public function chat(Request $request): JsonResponse
    {
        if (!config('ai.features.chatbot')) {
            return response()->json(['error' => 'Chatbot feature is disabled'], 403);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'history' => ['nullable', 'array', 'max:20'],
            'history.*.role' => ['required', 'string', 'in:user,assistant'],
            'history.*.content' => ['required', 'string'],
            'context' => ['nullable', 'string', 'max:4000'],
        ]);

        $userId = Auth::id() ?? $request->ip();

        // Check rate limit
        if ($this->gemini->isRateLimited($userId)) {
            return response()->json([
                'error' => 'Rate limit exceeded. Please wait a moment before trying again.',
                'retry_after' => 60,
            ], 429);
        }

        // Hit rate limit
        $this->gemini->hitRateLimit($userId);

        $result = $this->gemini->chat(
            $validated['message'],
            $validated['history'] ?? [],
            $validated['context'] ?? null
        );

        if (!$result['success']) {
            return response()->json(['error' => $result['error']], 500);
        }

        return response()->json([
            'response' => $result['response'],
            'remaining_requests' => $this->gemini->remainingAttempts($userId),
        ]);
    }

    /**
     * Generate content (announcements, events, social posts).
     */
    public function generate(Request $request): JsonResponse
    {
        if (!config('ai.features.content_generation')) {
            return response()->json(['error' => 'Content generation feature is disabled'], 403);
        }

        $validated = $request->validate([
            'type' => ['required', 'string', 'in:announcement,event,social'],
            'prompt' => ['required', 'string', 'max:2000'],
            'context' => ['nullable', 'array'],
        ]);

        $userId = Auth::id() ?? $request->ip();

        // Check rate limit
        if ($this->gemini->isRateLimited($userId)) {
            return response()->json([
                'error' => 'Rate limit exceeded. Please wait a moment before trying again.',
                'retry_after' => 60,
            ], 429);
        }

        $this->gemini->hitRateLimit($userId);

        $result = $this->gemini->generate(
            $validated['type'],
            $validated['prompt'],
            $validated['context'] ?? []
        );

        if (!$result['success']) {
            return response()->json(['error' => $result['error']], 500);
        }

        return response()->json([
            'content' => $result['response'],
            'cached' => $result['cached'] ?? false,
            'remaining_requests' => $this->gemini->remainingAttempts($userId),
        ]);
    }

    /**
     * Summarize text content.
     */
    public function summarize(Request $request): JsonResponse
    {
        if (!config('ai.features.summarization')) {
            return response()->json(['error' => 'Summarization feature is disabled'], 403);
        }

        $validated = $request->validate([
            'text' => ['required', 'string', 'max:10000'],
            'style' => ['nullable', 'string', 'in:brief,detailed,bullet'],
        ]);

        $userId = Auth::id() ?? $request->ip();

        if ($this->gemini->isRateLimited($userId)) {
            return response()->json([
                'error' => 'Rate limit exceeded. Please wait a moment before trying again.',
                'retry_after' => 60,
            ], 429);
        }

        $this->gemini->hitRateLimit($userId);

        $result = $this->gemini->summarize(
            $validated['text'],
            $validated['style'] ?? 'brief'
        );

        if (!$result['success']) {
            return response()->json(['error' => $result['error']], 500);
        }

        return response()->json([
            'summary' => $result['response'],
            'cached' => $result['cached'] ?? false,
            'remaining_requests' => $this->gemini->remainingAttempts($userId),
        ]);
    }

    /**
     * Smart search across content.
     */
    public function search(Request $request): JsonResponse
    {
        if (!config('ai.features.smart_search')) {
            return response()->json(['error' => 'Smart search feature is disabled'], 403);
        }

        $validated = $request->validate([
            'query' => ['required', 'string', 'max:500'],
        ]);

        $userId = Auth::id() ?? $request->ip();

        if ($this->gemini->isRateLimited($userId)) {
            return response()->json([
                'error' => 'Rate limit exceeded. Please wait a moment before trying again.',
                'retry_after' => 60,
            ], 429);
        }

        $this->gemini->hitRateLimit($userId);

        // Fetch recent announcements as search context
        $announcements = \App\Models\Announcement::query()
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->limit(10)
            ->get(['title', 'content', 'slug'])
            ->map(fn($a) => [
                'title' => $a->title,
                'content' => strip_tags($a->content),
            ])
            ->toArray();

        $result = $this->gemini->search($validated['query'], $announcements);

        if (!$result['success']) {
            return response()->json(['error' => $result['error']], 500);
        }

        return response()->json([
            'answer' => $result['response'],
            'remaining_requests' => $this->gemini->remainingAttempts($userId),
        ]);
    }
}
