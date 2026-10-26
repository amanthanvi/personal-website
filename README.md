# Aman Thanvi — Personal site

Static portfolio built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/) v4. One homepage plus MDX blog posts, binary light/dark themes (plus system auto). Deployed to GitHub Pages, with a small Cloudflare Worker in front that serves a Markdown version of each page to clients that ask for it.

## Quick start

```bash
npm ci
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run build` | `astro build`, then [`scripts/generate-markdown.mjs`](scripts/generate-markdown.mjs) writes `dist/agent-markdown/` and `dist/llms.txt` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Astro type check |
| `npm run test:worker` | Unit tests for the Cloudflare Worker ([`src/worker.test.mjs`](src/worker.test.mjs)) |
| `npm run worker:dev` / `worker:deploy` | Run or deploy the Worker with the pinned `wrangler` (deploy needs Cloudflare credentials) |

See [`AGENTS.md`](AGENTS.md) for CI and contributor expectations.

## Repository layout

| Path | Purpose |
| --- | --- |
| [`src/pages/`](src/pages/) | Routes: [`index.astro`](src/pages/index.astro), [`blog/[...slug].astro`](src/pages/blog/[...slug].astro), [`404.astro`](src/pages/404.astro). The sitemap comes from `@astrojs/sitemap` (`/sitemap-index.xml`). |
| [`src/components/`](src/components/) | Layout, sections, UI |
| [`src/content/`](src/content/) | Collections (`projects/`, `blog/`), [`publications.json`](src/content/publications.json) |
| [`src/lib/site.ts`](src/lib/site.ts) | Contact links shared by the hero, footer, and JSON-LD |
| [`src/styles/global.css`](src/styles/global.css) | Theme tokens, type scale, link and row styles |
| [`src/assets/`](src/assets/) | Images processed at build time (the hero portrait) |
| [`src/worker.ts`](src/worker.ts) | Cloudflare Worker: `Accept: text/markdown` negotiation, cache and security headers |
| [`public/`](public/) | Static files copied to the site root (`robots.txt`, `site.webmanifest`, `CNAME`, `favicon.ico`, `images/`) |

## Editing content

- **Projects and blog**: Markdown/MDX under [`src/content/projects/`](src/content/projects/) and [`src/content/blog/`](src/content/blog/). Draft posts (`draft: true`) are left out of routes, the sitemap, and the homepage, and their URLs redirect home (see [`astro.config.mjs`](astro.config.mjs)); the Writing section only appears once at least one post is published.
- **Research**: [`src/content/publications.json`](src/content/publications.json). An optional `url` turns the title into a link; use only real, public destinations.
- **Hero and section copy**: Astro components under [`src/components/sections/`](src/components/sections/).
- **Photos**: the hero uses [`src/assets/portrait.jpg`](src/assets/portrait.jpg), resized to WebP at build time. [`public/images/profile.jpg`](public/images/profile.jpg) is the full photo referenced by JSON-LD. The share card is [`public/images/og-card.png`](public/images/og-card.png) (1200×630).

## Deployment

- **Site**: pushes to `main` (or a manual [`workflow_dispatch`](https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow)) run [`.github/workflows/pages.yml`](.github/workflows/pages.yml): `npm ci`, worker tests, type check, build, then deploy `dist/` to GitHub Pages.
- **Worker**: not deployed by CI. After changing [`src/worker.ts`](src/worker.ts), run `npm run worker:deploy` (configured in [`wrangler.jsonc`](wrangler.jsonc), route `amanthanvi.com/*`), then smoke-check: `curl -sI -H 'Accept: text/markdown' https://amanthanvi.com/` should return `text/markdown`.

## Accessibility, performance, and privacy

Semantic HTML, keyboard navigation, and theme and motion preferences are part of the design. The build ships no analytics, trackers, or cookies, and the only font is self-hosted Source Sans 3. Cloudflare can inject scripts at the edge (Web Analytics, Email Address Obfuscation); keep those zone features off so production matches the build.

## Credits and contributing

Third-party licenses and font attribution are in [`CREDITS.md`](CREDITS.md). Contributor workflow and tooling are in [`AGENTS.md`](AGENTS.md). Product and design truth: [`PRODUCT.md`](PRODUCT.md), [`DESIGN.md`](DESIGN.md).
