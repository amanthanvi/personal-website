# Repository Guidelines

## Project Structure & Module Organization

- **Framework**: Astro + Tailwind CSS v4 — static site with content collections.
- **Entrypoint**: `src/pages/index.astro` composes all sections into a single-page scrolling portfolio.
- **Layouts**: `src/layouts/BaseLayout.astro` (main shell), `src/layouts/BlogPostLayout.astro` (article pages).
- **Components**: `src/components/` — organized into `layout/`, `ui/`, `sections/`.
- **Styles**: `src/styles/global.css` — Tailwind v4 `@theme` tokens (colours and the named type scale: `text-masthead`, `text-display`, `text-lede`, `text-title`, `text-row`, `text-label`), link and row styles, blog prose.
- **Content**: `src/content/` — Astro content collections for `projects/` (Markdown), `blog/` (MDX), plus `publications.json`.
- **Scripts**: `src/scripts/theme.ts` — the light/dark toggle. It is the only client script besides the inline FOUC guard in `BaseHead.astro`.
- **Shared data**: `src/lib/site.ts` (contact links), `src/lib/posts.ts` (post slugs and dates).
- **Worker**: `src/worker.ts` is a Cloudflare Worker on `amanthanvi.com/*` (config in `wrangler.jsonc`). It serves `dist/agent-markdown/*.md` when a request prefers `text/markdown`, and sets cache and security headers. `scripts/generate-markdown.mjs` builds those files and `dist/llms.txt` after `astro build`.
- **Static assets**: `public/` — images, CNAME, robots.txt, site.webmanifest, favicon.ico. Deployed as-is to `dist/`. Build-processed images (the hero portrait) live in `src/assets/`.
- **CI/CD**: `.github/workflows/pages.yml` runs worker tests, type check, and build before deploying to GitHub Pages. `quality.yml` runs markdownlint, yamllint, codespell, and test/check/build on PRs; all jobs are blocking. The Worker is deployed separately with `npm run worker:deploy`.

## Build, Test, and Development Commands

- `npm run dev` — local Astro dev server with HMR.
- `npm run build` — production build to `dist/`, then agent Markdown and `llms.txt`.
- `npm run preview` — preview built site locally.
- `npm run check` — Astro type checking.
- `npm run test:worker` — Worker unit tests (`node --test`).
- `npm run worker:dev` / `npm run worker:deploy` — Wrangler, pinned in devDependencies.
- `codespell --ignore-words-list adn,aman,thanvi,doj,ustp,cisa,nasa,umd,sdls,cfs,nos3,ccds,ngn,scan,ltsc,eoust,govt,config,astro,oklch --skip .git,node_modules,dist,.astro,package-lock.json` — spellcheck.

## Coding Style & Naming Conventions

- Two-space indentation; Astro component naming in PascalCase.
- Tailwind utility classes preferred; use the named type-scale utilities instead of raw `text-[…]` sizes. Shared CSS lives in `src/styles/global.css`.
- `--color-accent` is reserved for focus rings and text selection only; links are ink with a rule.
- Semantic HTML (`section`, `main`, `nav`) with descriptive `aria-*` labels.
- File names lowercase with hyphens; components in PascalCase.

## Testing Guidelines

- Run `npm run test:worker`, `npm run check`, and `npm run build` before committing.
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
- **Motion**: One authored moment (the light↔dark view transition) plus quick state transitions. Nothing animates on load or scroll (DESIGN.md §8); everything collapses under `prefers-reduced-motion`.
- **Links**: same-tab navigation everywhere; linked row titles carry a resting 1px rule and the whole row is the tap target (DESIGN.md §7).
- **Credits / third-party**: See [`CREDITS.md`](CREDITS.md) for fonts and libraries.
- **Product / design**: [`PRODUCT.md`](PRODUCT.md) and [`DESIGN.md`](DESIGN.md) own product truth and the cozy-minimal visual system.

## Cursor Cloud specific instructions

- The site is static Astro output. The only server-side code is the Cloudflare Worker (`src/worker.ts`), which is unit-tested with stubbed `fetch` and needs no secrets locally. Deploying it needs Cloudflare credentials.
- Dependencies are refreshed automatically on startup (`npm ci`); no manual install step is needed.
- `npm run dev` serves on `http://localhost:4321/`. Routes to verify: `/`, `/404`, `/sitemap-index.xml`, and `/blog` (redirects home: there is no blog index; draft post URLs redirect home too).
- The homepage is a static single-page scroll: no boot sequence, no WebGL, no scroll-reveal.
- Quality checks are `npm run test:worker`, `npm run check`, and `npm run build`, plus manual browser checks. There is no ESLint config.

## Learned User Preferences

- Cozy-minimal brand: clean, inviting, comfy; less is more (KISS/YAGNI). Reject federal-dossier / security-operator voice and info overload.
- Primary audience is collaborators, peers, and general visitors; tone should stay chill and approachable, not overbearing or overly serious.
- Themes stay binary light/dark only (drop arcade, dune, multi-theme HUD). Dark mode should be OLED-friendly soft black, not mocha or warm brown.
- Theme control should be a simple single light↔dark toggle with snappy animation — no dropdown.
- Prefer plain low-noise UI over card-heavy layouts; `--radius` is 5px. Motion is subtle and quick.
- Keep copy short, but not the spacing: sections sit 56px apart. (Compression is what made the
  previous design read as clunky; see DESIGN.md §4.)
- Homepage content: keep projects, publications/research, and blog/writing only — remove experience, education, honors/awards, skills, and certifications.
- Hero tagline is user-authored: “Computer science and cybersecurity. Building things.
  Overthinking. If not that, probably sleeping.” Do not rewrite it without being asked.
- Bold redesigns are welcome when asked; leave work uncommitted unless commit/push/PR is explicitly requested.

## Learned Workspace Facts

- Product and design truth live in `PRODUCT.md` and `DESIGN.md` (cozy-minimal visual system).
- Static Astro + Tailwind v4 portfolio; theme via `data-theme` on `<html>` (`auto` | `light` | `dark`), with `auto` resolving to light or dark.
- Homepage sections: Hero, Projects, Research, and Writing (Writing renders only when a post is published) — not a full résumé dump.
- Multi-theme arcade/dune HUD craft and security-operator positioning are retired product constraints.
- Site is amanthanvi.com; contact via email, LinkedIn, and GitHub only (no accounts or backend).
