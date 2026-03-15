---
trigger: always_on
---

# CICT Tech Portal Design System

## Core Aesthetics
- **Theme**: Dark Mode only. Glassmorphism + Maroon/Gold accents.
- **Background**:
  - Use the global utility class `.bg-page-core` for ALL page backgrounds.
  - Definition: `bg-gradient-to-b from-black via-maroon-950/40 to-black` (min-h-screen).
  - Hexagonal patterns are reserved for the Landing Page Hero section only.

## Layouts
- **Navigation**:
  - Both Public and Authenticated layouts use a **Floating Glass Navbar**.
  - Style: `rounded-full border border-white/10 bg-black/60 px-6 py-3 backdrop-blur-xl shadow-glass`.
  - Position: `fixed top-0 left-0 right-0 z-50`.
- **Page Wrapper**:
  - Wrap content in `PublicLayout` or `AuthenticatedLayout`.
  - Content usually starts with `pt-24` to clear the fixed navbar.

## Components
- **Page Headers**:
  - ALWAYS use the `GlassPageHeader` component for page titles (except Landing Page).
  - Path: `resources/js/Components/GlassPageHeader.tsx`.
  - Usage: `<GlassPageHeader title="Page Title"> ...actions... </GlassPageHeader>`.
  - Style: Full-width glass strip with border-bottom.
- **Glass Cards**:
  - Use `glass-card` utility or manual: `bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl`.
  - Hover effects: `hover:bg-white/10 transition-colors`.

## Colors (Tailwind)
- **Primary**: `maroon-900`, `maroon-950` (Backgrounds/Accents).
- **Secondary**: `gold-400`, `gold-500` (Text, Icons, Buttons, Highlights).
- **Text**: `text-white` (Headings), `text-white/70` (Body), `text-white/50` (Muted).

## Typography
- Fonts: Sans-serif (Inter/Default).
- Headings: Bold/Extrabold, often tracking-tight.

## Icons
- Use `@heroicons/react/24/outline`.
- Color: `text-gold-400` for primary icons.

## Student Portal Specifics
- Routes: `student.*` prefix (e.g., `student.events.my`).
- Layout: `AuthenticatedLayout` (includes "Public Site" button).