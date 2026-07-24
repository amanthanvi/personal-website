# personal-website

Astro static site with MDX content and Tailwind 4. Cozy-minimal portfolio (binary light/dark).

## Build & Test

```bash
npm run dev          # Astro dev server
npm run build        # Static build
npm run preview      # Local preview of build
npm run check        # Astro type check
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
- Static output; no server runtime
- See PRODUCT.md and DESIGN.md for product/visual truth
