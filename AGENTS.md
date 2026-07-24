# Repository Guidelines

## Project Structure & Module Organization

- **Framework**: Astro + Tailwind CSS v4 — static site with content collections.
- **Entrypoint**: `src/pages/index.astro` composes all sections into a single-page scrolling portfolio.
- **Layouts**: `src/layouts/BaseLayout.astro` (main shell), `src/layouts/BlogPostLayout.astro` (article pages).
- **Components**: `src/components/` — organized into `layout/`, `ui/`, `sections/`.
- **Styles**: `src/styles/global.css` (Tailwind v4 `@theme` tokens), `animations.css`, `utilities.css` (scroll reveal).
- **Content**: `src/content/` — Astro content collections for `projects/` (Markdown), `blog/` (MDX), plus `publications.json`.
- **Scripts**: `src/scripts/` — TypeScript modules for theme (`theme.ts`), section nav (`section-nav.ts`), and scroll reveal (`scroll-reveal.ts`).
- **Static assets**: `public/` — images, CNAME, robots.txt, site.webmanifest. Deployed as-is to `dist/`.
- **CI/CD**: `.github/workflows/pages.yml` builds + deploys; `quality.yml` runs lint, spellcheck, typecheck (typecheck is blocking).

## Build, Test, and Development Commands

- `npm run dev` — local Astro dev server with HMR.
- `npm run build` — production build to `dist/`.
- `npm run preview` — preview built site locally.
- `npm run check` — Astro type checking.
- `codespell --ignore-words-list adn,aman,thanvi,doj,ustp,cisa,nasa,umd,sdls,cfs,nos3,ccds,ngn,scan,ltsc,eoust,govt,config,astro,oklch --skip .git,node_modules,dist,.astro` — spellcheck.

## Coding Style & Naming Conventions

- Two-space indentation; Astro component naming in PascalCase.
- Tailwind utility classes preferred; custom CSS in `src/styles/` for motion utilities.
- One brand accent via `--color-accent` (section wrappers still expose `--section-accent` as an alias).
- Semantic HTML (`section`, `main`, `nav`) with descriptive `aria-*` labels.
- File names lowercase with hyphens; components in PascalCase.

## Testing Guidelines

- Run `npm run build` + `npm run check` before committing.
- Manual checks: light/dark/auto themes, responsive widths, `prefers-reduced-motion`.
- Performance budget: keep the page lean — static HTML/CSS first; no WebGL.
- Accessibility: skip links, focus outlines, keyboard nav, ARIA labels.

## Commit & Pull Request Guidelines

- Conventional Commits: `feat|fix|refactor|docs|chore|style|perf|test` with optional scope.
- PRs: describe user-facing impact, include before/after screenshots for visual changes.
- Wait for GitHub Actions green before merge.

## Key Architecture Decisions

- **Tailwind v4**: CSS-first config via `@theme` blocks in `global.css`. No `tailwind.config.js`.
- **Theme**: Binary `data-theme` on `<html>` (`auto`, `light`, `dark`). FOUC prevention inline script in `<head>`.
- **Motion**: Gentle scroll-reveal; respects `prefers-reduced-motion`.
- **Credits / third-party**: See [`CREDITS.md`](CREDITS.md) for fonts and libraries.
- **Product / design**: [`PRODUCT.md`](PRODUCT.md) and [`DESIGN.md`](DESIGN.md) own product truth and the cozy-minimal visual system.

## Cursor Cloud specific instructions

- This is a fully static Astro site — there is no backend, database, or external service to start, and no environment variables/secrets are required to run or test it.
- Dependencies are refreshed automatically on startup (`npm ci`); no manual install step is needed.
- `npm run dev` serves on `http://localhost:4321/`. Routes to verify: `/`, `/blog/hello-world/`, `/404`, `/sitemap.xml`.
- The homepage is a static single-page scroll with soft CSS atmosphere only — no boot sequence and no WebGL background. Scroll-reveal is the main motion, gated on `!prefers-reduced-motion`.
- Quality checks are `npm run check` (Astro typecheck) and `npm run build`. There is no unit-test suite or ESLint config; verification is typecheck + build + manual browser checks.

## Learned User Preferences

- Cozy-minimal brand: clean, inviting, comfy; less is more (KISS/YAGNI). Reject federal-dossier / security-operator voice and info overload.
- Primary audience is collaborators, peers, and general visitors; tone should stay chill and approachable, not overbearing or overly serious.
- Themes stay binary light/dark only (drop arcade, dune, multi-theme HUD). Dark mode should be OLED-friendly soft black, not mocha or warm brown.
- Theme control should be a simple single light↔dark toggle with snappy animation — no dropdown.
- Prefer sharp corners and plain low-noise UI over rounded card-heavy layouts; motion should be subtle, quick, and snappy when used.
- Prefer compressed vertical spacing and less copy on the page; strip unnecessary hero subcaptions and résumé-dump verbosity.
- Homepage content: keep projects, publications/research, and blog/writing only — remove experience, education, honors/awards, skills, and certifications.
- Hero role line: “computer science and cybersecurity” (not “security engineer”); omit long “I build and assess…” style taglines.
- Bold redesigns are welcome when asked; leave work uncommitted unless commit/push/PR is explicitly requested.

## Learned Workspace Facts

- Product and design truth live in `PRODUCT.md` and `DESIGN.md` (cozy-minimal visual system).
- Static Astro + Tailwind v4 portfolio; theme via `data-theme` on `<html>` (`auto` | `light` | `dark`), with `auto` resolving to light or dark.
- Homepage sections after the field-brief overhaul: Hero, Projects, Publications, Blog — not a full résumé dump.
- Multi-theme arcade/dune HUD craft and security-operator positioning are retired product constraints.
- Site is amanthanvi.com; contact via email, LinkedIn, and GitHub only (no accounts or backend).
