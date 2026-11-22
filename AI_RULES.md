# AI Rules — VoltMaster Academy

## Tech Stack

- React 18 + Vite 5 (SPA, no SSR)
- Tailwind CSS 3 via PostCSS (dark-only, `class="dark"` on `<html>`)
- Supabase (PostgreSQL + Auth + Storage) for persistence, auth, and photo storage
- Google Fonts: Inter (UI) + JetBrains Mono (technical labels)
- Vanilla JavaScript (no TypeScript, no state library)
- Inline SVG icons (no icon library)
- Multi-language UI: PT, ES, EN, FR, TR (translation object in `src/data/languages.js`)
- Single-page app with 4 views: Course, Photos, Workshop, Certificate

## Library / Tool Rules

- **Styling:** Use Tailwind CSS utility classes exclusively. Do not write separate CSS files. Add component-specific overrides only in `src/index.css` when Tailwind cannot express the effect (e.g., `@keyframes` animations, custom scrollbars, print media).
- **Interactivity:** Use React hooks (`useState`, `useEffect`, `useCallback`, `useRef`) only. Do not add Redux, Zustand, or any state management library.
- **Icons:** Use inline `<svg>` elements. Do not add lucide-react, Font Awesome, or any icon package.
- **Fonts:** Use Inter and JetBrains Mono via Google Fonts `<link>` tags in `index.html`. Do not add other font families.
- **State:** Keep app state in React component state. Persist to Supabase when user is authenticated. Do not add a state management library.
- **Structure:** Keep components in `src/components/`. Data files in `src/data/`. Supabase client in `src/integrations/supabase/client.ts`.
- **Responsiveness:** Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for all layout and typography. Mobile-first.
- **Dark mode:** The app is dark-only (`class="dark"` on `<html>`). Do not add light-mode toggles or light-mode color variants.
- **Accessibility:** Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<button>`, `<input>`), `aria-label`/`aria-labelledby` where needed, and ensure keyboard operability of all custom controls.

## Conventions

- All user-facing text must go through the translation object (`t('key')`) so the UI stays translatable across PT/ES/EN/FR/TR.
- Use the `volt` color theme (emerald/green accents) defined in `tailwind.config.js` for primary actions and highlights.
- Buttons use `onClick` handlers for simple actions; complex logic lives in named functions in the component.
- Modals/toasts are React components (`ToastContainer`, `LightboxModal`, `ConfirmModal`) — do not replace with portal-based components.
- Supabase auth state is managed in `App.jsx` via `onAuthStateChange`. All user data is loaded from / saved to Supabase when authenticated: `profiles` (full name), `course_progress`, `user_photos`, `workshop_checklist`, `service_quotes`, `certificates`.
- Storage buckets: `user-photos` (public, per-user RLS, `getPublicUrl` for lesson/photo display) and `user-files` (private, per-user RLS, JSON backups). Files are always stored under a `<user_id>/` prefix so RLS scopes access per user.