# personal-website

Astro static site with MDX content and Tailwind 4. Cozy-minimal portfolio (binary light/dark).

## Build & Test

```bash
npm run dev          # Astro dev server
npm run build        # Static build
npm run preview      # Local preview of build
npm run check        # Astro type check
npm run test:worker  # Cloudflare Worker unit tests
```

## Stack

- Framework: Astro (static SSG + MDX)
- Styling: Tailwind CSS 4
- Content: MDX pages/posts
- Package manager: npm

## Conventions

- Blog posts as MDX in content directory
- Astro components for layout, MDX for content
- Tailwind for styling; CSS variables for theming (`auto` / `light` / `dark`)
- Static output; the only server code is the Cloudflare Worker in `src/worker.ts` (Markdown negotiation, headers), deployed separately with `npm run worker:deploy`
- See PRODUCT.md and DESIGN.md for product/visual truth
