# Repository Guidelines

## Project Structure & Module Organization

- **Framework**: Astro 7 + Tailwind CSS v4 — static site builder with content collections.
- **Entrypoint**: `src/pages/index.astro` composes all sections into a single-page scrolling portfolio.
- **Layouts**: `src/layouts/BaseLayout.astro` (main shell), `src/layouts/BlogPostLayout.astro` (article pages).
- **Components**: `src/components/` — organized into `layout/`, `ui/`, `sections/`.
- **Styles**: `src/styles/global.css` (Tailwind v4 @theme tokens + light/dark themes), `animations.css` (keyframes), `utilities.css` (scroll-reveal + scrollbar).
- **Content**: `src/content/` — Astro content collections for `projects/` (Markdown), `blog/` (MDX), plus `experience.json` and `skills.json`.
- **Scripts**: `src/scripts/` — TypeScript modules for the theme toggle (`theme.ts`), section navigation (`hud-nav.ts`), and scroll reveal (`scroll-reveal.ts`).
- **Static assets**: `public/` — images, CNAME, robots.txt, site.webmanifest. Deployed as-is to `dist/`.
- **CI/CD**: `.github/workflows/pages.yml` builds + deploys; `quality.yml` runs lint, spellcheck, typecheck.

## Build, Test, and Development Commands

- `npm run dev` — local Astro dev server with HMR.
- `npm run build` — production build to `dist/`.
- `npm run preview` — preview built site locally.
- `npm run check` — Astro type checking.
- `codespell --ignore-words-list adn,aman,thanvi,doj,ustp,cisa,nasa,umd,sdls,cfs,nos3,ccds,ngn,scan,ltsc,eoust,govt,config,astro,oklch --skip .git,node_modules,dist,.astro` — spellcheck.

## Coding Style & Naming Conventions

- Two-space indentation; Astro component naming in PascalCase.
- Tailwind utility classes preferred; custom CSS in `src/styles/` for keyframes and reveal effects.
- Single signal-accent color system via the `--color-accent` token (one committed brand color, no per-section rainbow).
- Semantic HTML (`section`, `main`, `nav`) with descriptive `aria-*` labels.
- File names lowercase with hyphens; components in PascalCase.

## Testing Guidelines

- Run `npm run build` + `npm run check` before committing.
- Manual checks: light and dark themes, responsive widths, `prefers-reduced-motion`.
- Performance budget: <500KB total, <3s LCP (no runtime JS framework; fonts from Google Fonts).
- Accessibility: skip links, focus outlines, keyboard nav, ARIA labels, ≥4.5:1 body contrast.

## Commit & Pull Request Guidelines

- Conventional Commits: `feat|fix|refactor|docs|chore|style|perf|test` with optional scope.
- PRs: describe user-facing impact, include before/after screenshots for visual changes.
- Wait for GitHub Actions green before merge.

## Key Architecture Decisions

- **Tailwind v4**: CSS-first config via `@theme` blocks in `global.css`. No `tailwind.config.js`.
- **Signal accent**: One committed accent color (`--color-accent`) carries the whole page; hierarchy otherwise comes from type, space, and rhythm.
- **Theme**: Binary `data-theme` on `<html>` (`dark` default, `light`). A pre-paint inline script in `<head>` resolves the theme (stored preference, else `prefers-color-scheme`), sets `color-scheme`, and adds a `js` class used to gate reveal animations so content stays visible without JS.
- **Typography**: Archivo (display + UI) paired with JetBrains Mono (labels, metadata, code).
- **Credits / third-party**: See [`CREDITS.md`](CREDITS.md) for fonts and libraries.

## Cursor Cloud specific instructions

- This is a fully static Astro site — there is no backend, database, or external service to start, and no environment variables/secrets are required to run or test it.
- Dependencies are refreshed automatically on startup (`npm ci`); no manual install step is needed.
- `npm run dev` serves on `http://localhost:4321/`. Routes to verify: `/`, `/blog/hello-world/`, `/404`.
- Sections use a scroll-reveal (IntersectionObserver) that fades content in as it enters the viewport; content is visible without JS. In headless captures that do not scroll, force-reveal with `document.querySelectorAll('.reveal').forEach(e => e.classList.add('revealed'))` before screenshotting below-the-fold sections.
- Quality checks are `npm run check` (Astro typecheck) and `npm run build`. There is no unit-test suite or ESLint config; verification is typecheck + build + manual browser checks.
