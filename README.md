# Aman Thanvi — Static Site

A minimalist, single-file static website with inline critical CSS and tiny JS. No frameworks, no bundlers, no analytics. Deployed via GitHub Pages.

## Structure

- [index.html](index.html) — production page with semantic landmarks, Space Mono via Google Fonts, accessible theme toggle, SEO/OG/JSON-LD.
- [404.html](404.html) — minimal not-found page sharing base styles and theme toggle.
- [robots.txt](robots.txt), [sitemap.xml](sitemap.xml) — search engine hints.
- [site.webmanifest](site.webmanifest) — PWA metadata with existing icons.
- static/images/ — assets; canonical headshot at [static/images/profile.jpg](static/images/profile.jpg).

## Local preview

Option A: open [index.html](index.html) directly in a browser.
Option B: simple server for correct MIME types:
- Python: `python3 -m http.server 8080`
- Node (optional): `npx serve .` (no dependency required for deployment)

## Accessibility and performance

- WCAG 2.2 AA: skip link, focus-visible outlines, logical headings, ARIA button for theme toggle, prefers-reduced-motion.
- Budgets: total page < 200 KB, CSS < 10 KB, JS < 2 KB. Fonts load with `display=swap`.
- LCP target < 1.8 s (slow 4G). Headshot sized with width/height to avoid CLS.

## Deployment (GitHub Pages via Actions)

- Workflow: [.github/workflows/pages.yml](.github/workflows/pages.yml) uploads the repo root as the Pages artifact and deploys.
- Trigger: pushes to `main` or manual `workflow_dispatch`.
- No build step required.

## Updating content

- Edit [index.html](index.html) text in the hero/about.
- Replace the headshot at [static/images/profile.jpg](static/images/profile.jpg) (keep similar dimensions). For lossless optimization:
  - macOS: `sips -s format jpeg -s formatOptions best static/images/profile.jpg --out static/images/profile.jpg`
  - Or use ImageOptim/oxipng/mozjpeg.

## Privacy

No trackers or cookies. External requests are limited to Google Fonts (Space Mono) with system-mono fallback.

