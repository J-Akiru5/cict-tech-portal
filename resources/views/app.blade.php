<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" type="image/png" href="/assets/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/assets/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/assets/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/assets/favicon/site.webmanifest" />

        {{-- SEO Meta Tags --}}
        <meta name="description" content="CICT Tech Portal - The official portal of the CICT Student Council at ISUFST Dingle Campus. Access announcements, events, enrollment, and campus resources.">
        <meta name="keywords" content="CICT, Student Council, ISUFST, Dingle Campus, IT, Computer Science, Information Technology, Student Portal">
        <meta name="author" content="CICT Student Council">
        <meta name="robots" content="index, follow">
        
        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="CICT Tech Portal">
        <meta property="og:title" content="{{ config('app.name', 'CICT Tech Portal') }}">
        <meta property="og:description" content="The official portal of the CICT Student Council at ISUFST Dingle Campus.">
        <meta property="og:image" content="{{ asset('assets/logo/CICT_Logo.svg') }}">
        <meta property="og:url" content="{{ url()->current() }}">
        
        {{-- Twitter Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name', 'CICT Tech Portal') }}">
        <meta name="twitter:description" content="The official portal of the CICT Student Council at ISUFST Dingle Campus.">
        <meta name="twitter:image" content="{{ asset('assets/logo/CICT_Logo.svg') }}">
        
        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ url()->current() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
