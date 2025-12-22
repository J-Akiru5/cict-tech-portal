# CICT Tech Portal Design System

## Core Aesthetics
- **Theme**: Dark Mode only. Glassmorphism + Maroon/Gold accents.
- **Background**:
  - Use the global utility class `.bg-page-core` for ALL page backgrounds.
  - Definition: Dark black base with subtle maroon radial gradient orbs for ambient glow.
  - Do NOT use custom backgrounds for content pages - inherit from `PublicLayout` or `AuthenticatedLayout`.
  - The HoneycombBackground is reserved for the Landing Page Hero section only.

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

## Admin Pages
- Admin pages use their own maroon gradient styling (`bg-gradient-to-b from-maroon-950 via-maroon-900 to-black`).
- These are internal-facing and do NOT require GlassPageHeader or bg-page-core.
- Examples: Admin/Users, Admin/Announcements, Admin/AcademicYears, Admin/Settings.

## Specialized Full-Screen Pages
- Timeline experiences (Calendar/Timeline.tsx, Calendar/Parallax.tsx) use their own immersive styling.
- These pages are intentionally different for their 3D/parallax effects.
- Do NOT wrap these in PublicLayout.
