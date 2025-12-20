<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Provider Configuration
    |--------------------------------------------------------------------------
    |
    | Configure the AI provider and API settings for the CICT Tech Portal.
    | Currently supports Google Gemini API.
    |
    */

    'provider' => env('AI_PROVIDER', 'gemini'),

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-1.5-flash'),
        'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Control how many AI requests each user can make.
    |
    */

    'rate_limit' => [
        'per_user' => (int) env('AI_RATE_LIMIT_PER_USER', 20),
        'window_minutes' => (int) env('AI_RATE_LIMIT_WINDOW', 1),
        'global_per_hour' => (int) env('AI_GLOBAL_RATE_LIMIT', 1000),
    ],

    /*
    |--------------------------------------------------------------------------
    | Caching
    |--------------------------------------------------------------------------
    |
    | Cache identical AI queries to reduce API calls and costs.
    |
    */

    'cache' => [
        'enabled' => env('AI_CACHE_ENABLED', true),
        'ttl_minutes' => (int) env('AI_CACHE_TTL', 5),
    ],

    /*
    |--------------------------------------------------------------------------
    | CICT Context
    |--------------------------------------------------------------------------
    |
    | Information about CICT to provide context for AI responses.
    |
    */

    'context' => [
        'system_prompt' => <<<'PROMPT'
You are an AI assistant for the CICT (College of Information and Communications Technology) Student Council portal.

Key information about CICT:
- Programs offered: BSIT (Information Technology), BSCS (Computer Science), BSIS (Information Systems), ACT (Computer Technology)
- Student Council manages: events, announcements, enrollment, department fees, and student affairs
- Department fee: ₱50 per semester (mandatory for all students)
- Academic year structure: Two semesters per year
- The portal provides: announcements, event registration, fee payments, CBL documents, and more

Guidelines:
- Be helpful, professional, and concise
- For questions outside your knowledge, direct users to contact the SC office
- Use Filipino-English (Taglish) if the user does so
- Format responses with markdown when helpful
- Keep responses focused and relevant to student concerns
PROMPT,

        'max_context_length' => 4000,
    ],

    /*
    |--------------------------------------------------------------------------
    | Feature Toggles
    |--------------------------------------------------------------------------
    |
    | Enable or disable specific AI features.
    |
    */

    'features' => [
        'chatbot' => env('AI_CHATBOT_ENABLED', true),
        'content_generation' => env('AI_CONTENT_GEN_ENABLED', true),
        'smart_search' => env('AI_SMART_SEARCH_ENABLED', true),
        'summarization' => env('AI_SUMMARIZATION_ENABLED', true),
    ],
];
