# Aman Thanvi — Personal site

Static portfolio built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/) v4. Single scrolling homepage plus MDX blog posts, binary light/dark themes (plus system auto), deployed to GitHub Pages.

## Quick start

```bash
npm ci
npm run dev
```

Other scripts: `npm run build` (output in `dist/`), `npm run preview`, `npm run check`. See [`AGENTS.md`](AGENTS.md) for CI, spellcheck, and pre-commit expectations.

## Repository layout

| Path | Purpose |
|------|---------|
| [`src/pages/`](src/pages/) | Routes: [`index.astro`](src/pages/index.astro), [`blog/[...slug].astro`](src/pages/blog/[...slug].astro), [`404.astro`](src/pages/404.astro), [`sitemap.xml.ts`](src/pages/sitemap.xml.ts) |
| [`src/components/`](src/components/) | Layout, sections, UI |
| [`src/content/`](src/content/) | Collections (`projects/`, `blog/`), [`publications.json`](src/content/publications.json) |
| [`src/styles/`](src/styles/) | Global Tailwind theme tokens and utilities |
| [`public/`](public/) | Static assets copied to site root (`robots.txt`, `site.webmanifest`, `CNAME`, images under `public/images/`) |

## Editing content

- **Projects and blog**: Markdown/MDX under [`src/content/projects/`](src/content/projects/) and [`src/content/blog/`](src/content/blog/). Draft blog posts (`draft: true`) are omitted from routes and the sitemap.
- **Publications**: [`src/content/publications.json`](src/content/publications.json).
- **Hero and section copy**: Astro components under [`src/components/sections/`](src/components/sections/).
- **Profile photo**: place or replace [`public/images/profile.jpg`](public/images/profile.jpg) (referenced as `/images/profile.jpg` in the build).

## Deployment

Pushes to `main` (or manual [`workflow_dispatch`](https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow)) run [`.github/workflows/pages.yml`](.github/workflows/pages.yml): `npm ci`, `npm run build`, then deploy the **`dist`** artifact to GitHub Pages.

## Accessibility, performance, and privacy

Semantic HTML, keyboard navigation, theme and motion preferences are part of the design. Performance and manual test notes live in [`AGENTS.md`](AGENTS.md). There are no analytics trackers or cookies; the site loads webfonts from Google Fonts (Bricolage Grotesque, Figtree — see [`src/components/layout/BaseHead.astro`](src/components/layout/BaseHead.astro)).

## Credits and contributing

Third-party licenses and font attribution are in [`CREDITS.md`](CREDITS.md). Contributor workflow and tooling are in [`AGENTS.md`](AGENTS.md). Product and design truth: [`PRODUCT.md`](PRODUCT.md), [`DESIGN.md`](DESIGN.md).
