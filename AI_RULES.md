# AI Rules — VoltMaster Academy

## Tech Stack

- Single-file HTML application (`voltmaster_academy_curso_interativo_dji_agras.html`) — no build step, no package.json, no framework
- Vanilla JavaScript (ES modules not used; all logic in inline `<script>` blocks)
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) with a custom `tailwind.config` block in `<head>`
- Google Fonts: Inter (UI) and JetBrains Mono (monospace/technical labels)
- Custom `<style>` block for component-specific CSS (animations, scrollbars, print styles)
- Inline SVG icons (no icon library dependency)
- Multi-language UI: PT, ES, EN, FR, TR (translation object in JS)
- LocalStorage persistence for course progress and photo data
- Standalone HTML export feature (self-contained file with embedded photos)

## Library / Tool Rules

- **Styling:** Use Tailwind CSS utility classes exclusively. Do not write separate CSS files. Add component-specific overrides only in the page's `<style>` block when Tailwind cannot express the effect (e.g., `@keyframes` animations, custom scrollbars, print media).
- **Interactivity:** Use vanilla JavaScript only. Do not add React, Vue, Angular, or any UI framework. Do not add npm dependencies or a build tool.
- **Icons:** Use inline `<svg>` elements. Do not add lucide-react, Font Awesome, or any icon package.
- **Fonts:** Use Inter and JetBrains Mono via Google Fonts `<link>` tags. Do not add other font families.
- **State:** Keep app state in a plain JavaScript object and persist to `localStorage` when needed. Do not add a state management library.
- **Structure:** Keep everything in the single HTML file. If the file grows too large, split into separate HTML/CSS/JS files only with explicit user approval.
- **Responsiveness:** Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for all layout and typography. Mobile-first.
- **Dark mode:** The app is dark-only (`class="dark"` on `<html>`). Do not add light-mode toggles or light-mode color variants.
- **Accessibility:** Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<button>`, `<input>`), `aria-label`/`aria-labelledby` where needed, and ensure keyboard operability of all custom controls.

## Conventions

- All user-facing text must go through the translation object (`t('key')`) so the UI stays translatable across PT/ES/EN/FR/TR.
- Use the `volt` color theme (emerald/green accents) defined in the Tailwind config for primary actions and highlights.
- Buttons use `onclick` inline handlers for simple actions; complex logic lives in named functions in the `<script>` block.
- Modals/toasts are DOM-managed via `id` selectors (`#toast-container`, `#lightbox-modal`, `#confirm-modal`) — do not replace with portal-based components.