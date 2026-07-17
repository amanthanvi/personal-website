# personal-website

Astro 7 static site with MDX content and Tailwind 4.

## Build & Test

```bash
npm run dev          # Astro dev server
npm run build        # Static build
npm run preview      # Local preview of build
npm run check        # Astro type check
```

## Stack

- Framework: Astro 7 (static SSG + MDX)
- Styling: Tailwind CSS 4
- Content: MDX pages/posts
- Package manager: npm

## Conventions

- Blog posts as MDX in content directory
- Astro components for layout, MDX for content
- Tailwind for all styling; use CSS variables for theming
- Static output; no server runtime
