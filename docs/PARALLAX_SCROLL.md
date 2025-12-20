# Prompt for Gemini 3.0 Pro: Generate a technical guide for implementing high-performance parallax scrolling in a Laravel 11 application using Vite and Locomotive Scroll v5 (Beta), ensuring compatibility with native scrolling via Lenis.

This guide outlines the implementation of high-performance parallax scrolling in a modern Laravel application using **Locomotive Scroll v5**. This version uses native scrolling (via Lenis), removing the need for "scroll hijacking" and improving accessibility and performance.

## 1. Stack & Compatibility
*   **Framework:** Laravel 10/11+
*   **Bundler:** Vite (Standard in modern Laravel)
*   **Library:** Locomotive Scroll v5 (Beta)
    *   *Note:* v5 is a significant rewrite from v4. It is lighter, native-friendly, and removes the need for heavy CSS "scroll containers."

## 2. Installation & Setup

### Step 1: Install Dependency
Run the following command in the Laravel project root:
```bash
npm install locomotive-scroll
```

### Step 2: CSS Configuration
Unlike v4, **Locomotive Scroll v5 does NOT require a mandatory base CSS file** to function. However, standard "reset" styles are recommended to ensure smooth visual performance.

Add this to `resources/css/app.css` (or your main SCSS file):
```css
html.lenis {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
```

### Step 3: JavaScript Initialization (Vite)
In your main entry point (e.g., `resources/js/app.js`), initialize the library.

**Basic Implementation:**
```javascript
import LocomotiveScroll from 'locomotive-scroll';

const locomotiveScroll = new LocomotiveScroll();
```

**Advanced Implementation (Vue/React in Laravel):**
If you are using a frontend framework within Laravel, wrap the initialization in a `useEffect` (React) or `onMounted` (Vue) hook to ensure the DOM is ready.

## 3. Core Features & Attributes
Locomotive Scroll v5 operates using data attributes on HTML elements. You do *not* need a specific wrapper ID like `#js-scroll` anymore.

### 1. Basic Parallax
Add `data-scroll` and `data-scroll-speed` to any element.
*   **Speed:** A number between `-10` and `10`.
*   **Positive (1 to 10):** Moves *faster* than scroll (foreground effect).
*   **Negative (-1 to -10):** Moves *slower* than scroll (background depth effect).

```html
<!-- Background Image (Moves slowly for depth) -->
<div data-scroll data-scroll-speed="-0.5">
    <img src="/images/background.jpg" alt="Background">
</div>

<!-- Text (Moves normally) -->
<h1>Welcome to Laravel</h1>

<!-- Floating Element (Moves faster) -->
<div data-scroll data-scroll-speed="2">
    <img src="/images/floating-object.png" alt="Floating">
</div>
```

### 2. Scroll into View (Animations)
Trigger animations when an element enters the viewport.

```html
<div 
    data-scroll 
    data-scroll-class="appear"
    data-scroll-repeat="true"
>
    Fade me in!
</div>
```
*   **`data-scroll-class`**: The class added when the element enters the viewport (e.g., `.appear { opacity: 1; }`).
*   **`data-scroll-repeat`**: If `true`, the class is removed when the element leaves the viewport (allowing the animation to replay).

### 3. Sticky Elements
Pin an element while scrolling past it.

```html
<div data-scroll-container>
    <div 
        data-scroll 
        data-scroll-sticky 
        data-scroll-target="#target-section"
    >
        I am sticky until #target-section ends!
    </div>

    <section id="target-section" style="height: 200vh;">
        <!-- Content -->
    </section>
</div>
```

## 4. Common Pitfalls & Solutions

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Error resolving module specifier"** | Vite cannot find the package. | Ensure you ran `npm install` and your `vite.config.js` is correctly processing JS files. Restart the dev server (`npm run dev`). |
| **Jittery/Laggy Scroll** | Conflict with native scroll behavior. | Ensure you added the recommended CSS from Step 2. Verify you aren't using `overflow: hidden` on the `body` unless intended. |
| **Z-Index Issues** | Parallax elements overlapping incorrectly. | Elements with `data-scroll-speed` use CSS transforms (`translate3d`). This creates a new stacking context. You must manage `z-index` explicitly on siblings. |
| **Dynamic Content (AJAX/Livewire)** | Content loads after init. | Locomotive Scroll v5 detects DOM changes automatically via `ResizeObserver`, so manual `update()` calls are rarely needed, unlike v4. |

## 5. Development Workflow for AI Agent
1.  **Scaffold:** Generate the Blade layout structure first.
2.  **Assets:** Ensure images are placed in `public/images` or handled via `resources/images` with Vite aliases.
3.  **Componentize:** Create reusable Blade components (e.g., `<x-parallax-image speed="2" />`) to abstract the `data-scroll` attributes and keep templates clean.
4.  **Style:** Use Tailwind CSS (standard in Laravel) for positioning `absolute` or `relative` containers to hold the parallax layers effectively.