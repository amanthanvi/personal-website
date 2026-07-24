# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Collaborators, peers, and general visitors who want a friendly, low-pressure sense of who Aman Thanvi is and what he works on. Hiring teams and security leaders may still visit, but they are not the primary audience this product optimizes for.

## Product Purpose

A single-page personal site for Aman Thanvi (computer science and cybersecurity). Success means a visitor can quickly understand the person and the work, then optionally go deeper into projects, research, and writing—without feeling overloaded or sold to.

## Positioning

Undecided as a sharp category claim. Confirmed stance: the site should feel chill and approachable, not overbearing or overly serious. Do not invent a forced differentiator beyond what the real résumé and projects already show.

## Operating Context

Visited on phone or laptop in ordinary browsing moments. Static Astro site at https://amanthanvi.com; contact via email, LinkedIn, and GitHub. No account, app workflow, or authenticated product surface.

## Capabilities and Constraints

- Static marketing/portfolio site (Astro + Tailwind); no backend or database.
- Themes: binary light and dark (plus system `auto` resolving to one of those). Dune/arcade and multi-theme HUD craft are retired.
- Content collections for projects and blog; structured JSON for publications/research.
- Open: how much writing will exist beyond the current hello-world post; do not fabricate posts or testimonials.

## Brand Commitments

- Name: Aman Thanvi; site: amanthanvi.com.
- Voice: chill, inviting, and easygoing—not a stern “security operator” persona.
- Binding redesign commitment: cozy-minimal—clean, inviting, comfortable; less is more; binary light/dark only.
- Keep anti-patterns as product constraints (not a visual recipe): no generic SaaS landing tropes, neon hacker cliché, fake terminal noise that hides content, or gamified-resume theater.

## Evidence on Hand

- Profile photo: `public/images/profile.jpg`
- Projects: `src/content/projects/` (e.g. synac, inplain-ai, betterman, malicious-url-detector, personal-website)
- Publications: `src/content/publications.json`
- Blog: `src/content/blog/hello-world.mdx` only so far—do not invent additional posts or quotes
- Contact paths: `contact@amanthanvi.com`, LinkedIn `/in/amanthanvi`, GitHub `amanthanvi`

## Product Principles

- Lead with a clear, friendly introduction; decoration never outranks readability.
- Prefer less density: short prose, scannable sections, no info overload.
- Keep technical depth available below the fold without turning the page into a dashboard.
- Preserve only real evidence already in the repo; never fabricate credentials, quotes, or case studies.
- Every refinement must work in light, dark, and reduced-motion—no theme-count creep.

## Accessibility & Inclusion

Semantic HTML, keyboard navigation, visible focus, readable contrast, responsive layouts. Motion stays optional or subdued when `prefers-reduced-motion` is set.
