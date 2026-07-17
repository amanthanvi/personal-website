# Plan 003: Generate `/sitemap.xml` so `robots.txt` stops advertising a 404

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 799d009..HEAD -- public/robots.txt astro.config.mjs src/pages src/content.config.ts`
> If any of these changed since this plan was written, compare the "Current
> state" excerpts against the live files before proceeding; on a mismatch,
> treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (adds one new build-time route; touches no existing page)
- **Depends on**: none
- **Category**: bug (SEO correctness)
- **Planned at**: commit `799d009`, 2026-07-16

## Why this matters

`public/robots.txt` tells every crawler `Sitemap: https://amanthanvi.com/sitemap.xml`, but no sitemap is generated — there is no `sitemap.xml` in `public/`, and `astro.config.mjs` has no sitemap integration. So the advertised URL 404s, and search engines get no sitemap for a portfolio whose entire purpose (see `PRODUCT.md`) is to be found and scanned quickly by recruiters and hiring teams. This plan adds a tiny Astro endpoint that emits a valid `/sitemap.xml` at build time from the real routes (home + published blog posts), matching the URL `robots.txt` already points at — **no new dependency, no change to `robots.txt`**.

## Current state

- `public/robots.txt` — advertises a sitemap that does not exist:

```1:4:public/robots.txt
User-agent: *
Allow: /

Sitemap: https://amanthanvi.com/sitemap.xml
```

- `astro.config.mjs` — static output, only the MDX integration; site URL is `https://amanthanvi.com`:

```1:12:astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://amanthanvi.com',
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- Blog collection + slug logic the sitemap must match. The blog collection is defined in `src/content.config.ts` with a `draft` boolean (default `false`). The route `src/pages/blog/[...slug].astro` builds each post at `/blog/<slug>/` where `<slug>` strips the file extension:

```5:11:src/pages/blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(mdx?|md)$/, '') },
    props: post,
  }));
}
```

  And `BlogSection.astro` builds the same public URL and filters out drafts — the sitemap should do the same (advertise only non-draft posts):

```5:8:src/components/sections/BlogSection.astro
const posts = (await getCollection('blog'))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 4);
```

- There is exactly one blog post today, `src/content/blog/hello-world.mdx` (`draft: false`, `pubDate: 2025-01-01`), so the expected sitemap contains the home URL and `https://amanthanvi.com/blog/hello-world/`.

Repo conventions to honor:
- Absolute site URLs are written as the literal `https://amanthanvi.com` elsewhere (e.g. `src/components/layout/BaseHead.astro` line 18: `const siteURL = 'https://amanthanvi.com';`). Match that convention rather than importing config.
- TypeScript is strict (`tsconfig.json` extends `astro/tsconfigs/strict`). Type the endpoint with `APIRoute`.
- Two-space indentation.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install deps | `npm ci` | exit 0 |
| Type-check | `npm run check` | exit 0, 0 errors |
| Build | `npm run build` | exit 0, writes `dist/sitemap.xml` |
| Inspect output | `node -e "console.log(require('fs').readFileSync('dist/sitemap.xml','utf8'))"` | prints the XML |

`npm ci` / `npm run build` write to git-ignored `node_modules/` and `dist/` — safe.

## Suggested executor toolkit

- No external skills needed. Astro documents "static file endpoints" (a `src/pages/*.ts` file exporting `GET` returning a `Response`); this plan gives the exact code, so consulting docs is optional.

## Scope

**In scope** (create only this file):
- `src/pages/sitemap.xml.ts` (create)

**Out of scope** (do NOT touch):
- `public/robots.txt` — it already points at `/sitemap.xml`; the endpoint is designed to match it exactly, so no edit is needed or wanted.
- `astro.config.mjs` — do not add the `@astrojs/sitemap` integration (that emits `sitemap-index.xml`, which would NOT match `robots.txt`, and pulls in a new dependency). See Maintenance notes for that alternative.
- Any existing page/route or content file.

## Git workflow

- Branch: `advisor/003-sitemap`
- One commit, Conventional Commits style (see `git log`): `feat: generate sitemap.xml from routes`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the sitemap endpoint

Create `src/pages/sitemap.xml.ts` with this content (a static endpoint; because `output: 'static'`, Astro renders it to `dist/sitemap.xml` at build):

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://amanthanvi.com';

function toSlug(id: string): string {
  return id.replace(/\.(mdx?|md)$/, '');
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);

  const entries: { loc: string; lastmod?: string }[] = [
    { loc: `${SITE}/` },
    ...posts.map((post) => ({
      loc: `${SITE}/blog/${toSlug(post.id)}/`,
      lastmod: (post.data.updatedDate ?? post.data.pubDate)
        .toISOString()
        .slice(0, 10),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ loc, lastmod }) =>
      `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
```

Notes for correctness:
- The slug regex and `/blog/<slug>/` shape must match `src/pages/blog/[...slug].astro` exactly (they do, above) — otherwise the sitemap would advertise URLs that 404.
- The 404 page and draft posts are intentionally excluded.

**Verify**: `npm run check` → exit 0, 0 errors.

### Step 2: Build and confirm the sitemap is emitted and correct

```
npm run build
node -e "const s=require('fs').readFileSync('dist/sitemap.xml','utf8'); const ok = s.includes('<loc>https://amanthanvi.com/</loc>') && s.includes('<loc>https://amanthanvi.com/blog/hello-world/</loc>') && !s.includes('404'); if(!ok){console.error('SITEMAP CONTENT WRONG:\n'+s); process.exit(1);} console.log('sitemap ok');"
```

**Verify**: prints `sitemap ok` (exit 0). This confirms `dist/sitemap.xml` exists, includes the home URL and the published blog post, and does not list the 404 route.

### Step 3: Confirm the URL matches what `robots.txt` advertises

```
node -e "const r=require('fs').readFileSync('public/robots.txt','utf8'); if(!r.includes('https://amanthanvi.com/sitemap.xml')){process.exit(1);} console.log('robots points at /sitemap.xml');"
```

**Verify**: prints `robots points at /sitemap.xml`. Since the endpoint builds to `dist/sitemap.xml` (served at `/sitemap.xml`), the advertised URL now resolves.

## Test plan

No unit-test framework exists; verification is build + output assertions:
- `npm run check` → 0 errors (endpoint type-checks).
- `npm run build` → `dist/sitemap.xml` exists.
- Step 2's node assertion is the regression check: home + published post present, drafts and 404 absent. When a second post is added later, re-running the build should include it automatically (the endpoint is data-driven).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `src/pages/sitemap.xml.ts` exists.
- [ ] `npm run check` exits 0 with 0 errors.
- [ ] `npm run build` exits 0 and produces `dist/sitemap.xml`.
- [ ] Step 2's assertion prints `sitemap ok` (home + `hello-world` present; no `404`).
- [ ] `public/robots.txt` is unchanged and still references `https://amanthanvi.com/sitemap.xml`.
- [ ] Only `src/pages/sitemap.xml.ts` was created; no other file changed (`git status`).
- [ ] `plans/README.md` status row for 003 updated.

## STOP conditions

Stop and report back (do not improvise) if:

- `src/pages/blog/[...slug].astro`'s slug logic differs from the excerpt (the sitemap URLs would no longer match the real post URLs).
- `npm run build` does not emit `dist/sitemap.xml` (e.g. a different Astro version handles static endpoints differently) — report the build output; do not fall back to hand-writing a static file without confirming the route shape.
- The blog collection name is no longer `'blog'` or `content.config.ts`'s schema no longer has `draft`/`pubDate`/`updatedDate` (drift) — re-derive the fields before proceeding.

## Maintenance notes

- When you add or unpublish blog posts, the sitemap updates automatically at build — no manual edit needed. Drafts stay out until `draft: false`.
- If the site later grows many pages or wants richer metadata (changefreq/priority, image sitemaps, automatic `lastmod` from git), consider replacing this endpoint with the first-party `@astrojs/sitemap` integration. Trade-off: it emits `sitemap-index.xml` (+ `sitemap-0.xml`), so you would then also update `public/robots.txt` to point at `/sitemap-index.xml`. For the current handful of routes, the endpoint here is smaller and needs no dependency.
- A reviewer should confirm the generated URLs exactly match the live blog route (trailing slash included) and that the 404 route is excluded.
