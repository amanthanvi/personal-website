---
name: Aman Thanvi Personal Website
description: A quiet single-column personal site — neutral, precise, typographic.
colors:
  bg: "oklch(0.988 0 0)"
  surface: "oklch(0.965 0.002 265)"
  text: "oklch(0.205 0.003 265)"
  muted: "oklch(0.44 0.007 265)"
  faint: "oklch(0.55 0.008 265)"
  border: "oklch(0.885 0.004 265)"
  accent: "oklch(0.55 0.19 258)"
  bg-dark: "oklch(0.145 0.004 265)"
  surface-dark: "oklch(0.195 0.004 265)"
  text-dark: "oklch(0.94 0.002 265)"
  muted-dark: "oklch(0.73 0.008 265)"
  faint-dark: "oklch(0.59 0.010 265)"
  border-dark: "oklch(0.295 0.006 265)"
  accent-dark: "oklch(0.72 0.15 255)"
typography:
  display:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.021em"
  lede:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  headline:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0"
  title:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0"
  label:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  prose-heading:
    fontFamily: "Source Sans 3 Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.012em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
rounded:
  sm: "2px"
  md: "5px"
  lg: "5px"
spacing:
  xs: "4px"
  sm: "6px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "56px"
components:
  link-inline:
    textColor: "{colors.muted}"
    rule: "1px currentColor, 2px on hover"
  row:
    borderTop: "1px {colors.border}"
    padding: "16px 0"
  theme-toggle:
    backgroundColor: "transparent"
    borderColor: "{colors.border}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    size: "32px"
---

# Design System: Aman Thanvi Personal Website

Recorded from the built site, not written ahead of it. Ground truth is `src/styles/global.css`.

## 1. Overview

**Creative north star: "the canon, played straight."**

This is the personal-site convention executed at full craft rather than a borrowed visual world.
There is no metaphor, no device, and nothing to decode. The entire expression is the type scale,
the vertical rhythm, and the interaction states. The craft register is the designer-engineer
lineage — tight scale, near-invisible but tuned motion, obsessive focus and hover detail.

This replaces the **cozy desk** identity (warm stone ground, Bricolage Grotesque display, clay
ochre accent, sharp zero-radius bordered cards, chips) which in turn replaced **Operations Room**.
Both are anti-references.

**Key characteristics:**
- One column, `--measure: 34rem`, shared by the homepage and blog prose.
- One typeface, self-hosted. One chromatic value, reserved for focus and selection.
- Hairline rules separate rows. Nothing fills, nothing floats, nothing has a shadow.
- Binary `light` / `dark` plus `auto` (system).

## 2. Colors

**Strategy: Restrained** — a true neutral ground carries the page; the single blue appears only
on focus rings and text selection.

The ground is deliberately **neutral, not warm**. Cream, parchment, and beige grounds are an
anti-reference here: paired with a display serif and a terracotta accent they form the single most
common generated-interface look, and the whole point of this palette is to not be that.

Dark mode is a near-neutral cool near-black (`#090a0c`), OLED-friendly, with lifted surfaces.
No mocha, no warm brown.

### Named rules

**The Ink-Link Rule.** Links are ink, not blue. Affordance comes from a 1px rule under the text
that thickens to 2px on hover. The accent is never used to colour a link.

**The Contrast-Floor Rule.** Every text tone clears 4.5:1 against its ground in both themes,
including metadata. Measured values: text 17.3 / 16.6, muted 7.5 / 8.3, faint 4.7 / 4.8,
accent 4.8 / 8.0. `faint` is the floor of the ramp — do not lighten it.

**The Non-Text-Border Rule.** `border` sits at ~1.36:1 and is for separation only. It must never
carry text or an icon that conveys meaning.

## 3. Typography

**One family: Source Sans 3 Variable**, self-hosted via `@fontsource-variable/source-sans-3`.
Only the `wght` (upright) axis ships; `<em>` renders as a synthesised oblique. Add
`wght-italic.css` if real italics ever matter. Monospace is the system stack, inside `code` /
`pre` only.

Base is **15.5px / 1.62**. Prose runs one step larger at **1.0625rem / 1.72** on the same measure.

### Hierarchy
- **Display** `1.75rem` — the name, and post titles.
- **Lede** `1.0625rem` — the tagline and blog prose.
- **Headline** `0.8125rem` semibold muted — section labels (Projects, Research, Writing).
- **Title** `0.9375rem` semibold — project, publication, and post row titles.
- **Body** `15.5px` muted — row descriptions.
- **Label** `0.8125rem` faint — tech stacks, venues, periods, dates, the external-link glyph.
- **Prose heading** `1.1875rem` — `h2` inside blog prose (`h3` drops to `1rem`).
- **Code** `0.875rem` mono — inline `code` and `pre`.

### Named rules

**The Quiet-Label Rule.** Section labels are plain sentence case at small size in `muted`.
No uppercase, no letter-spacing, no eyebrow over every section.

**The Tabular-Meta Rule.** Dates and periods carry `font-variant-numeric: tabular-nums` so
right-aligned metadata does not shimmy between rows.

## 4. Layout

- One column at `--measure: 34rem` (~66ch at the lede size), plus `1.5rem` gutters.
- Sections are `56px` apart. Headings take `6px` below them — **always more space above a
  heading than below it.**
- Rows are separated by a `1px` top border; the last row in a section closes with a bottom border.
- No sticky header, no in-page nav, no scroll-spy, no progress bar. The page is short; scrolling
  is the navigation.
- Header is the theme control alone on the homepage, and a back-link plus the control on posts.

## 5. Elevation & depth

None. There are no shadows, no glass, no blur, and no elevation layers anywhere on the site.
`surface` exists only as the fill behind `code` and `pre`.

## 6. Shapes

`--radius: 5px`, applied to the portrait, the theme toggle, code blocks, and images. Focus rings
use `2px`. This is a deliberate reversal of the previous system's `border-radius: 0` — with the
cards and chips gone there are almost no boxes left, and the few that remain read better softened.

## 7. Components

### Inline link (`.link`)
`muted` text with a 1px `currentColor` rule; on hover the rule goes to 2px and the text to `text`.
Transitions `background-size`, so it never touches layout.

### Row link (`.row-link` / `.row-title`)
For rows where the title is the link. The rule wipes in from zero width under the title only —
the whole row does not underline.

### Row
`border-top: 1px`, `16px` vertical padding, `last:border-b`. Title, then description, then a meta
line. No container, no fill, no hover background.

### Theme toggle
32px, transparent, hairline border, crossfading moon/sun on `[data-resolved]`. Binary light↔dark;
`auto` is the initial state and the system-preference listener keeps it live until the first click.

## 8. Motion

**One authored moment:** the light↔dark switch cross-fades the whole page through
`document.startViewTransition` at `0.2s`. That is the only orchestrated motion on the site.

Everything else is a state transition at `0.16–0.18s` on `--ease-out`
(`cubic-bezier(0.22, 1, 0.36, 1)`): link rule thickness, link colour, toggle icon, border colour.
Nothing animates on scroll and nothing animates on load — content is present at first paint.

All of it collapses under `prefers-reduced-motion: reduce`, including the view transition.

## 9. Do's and Don'ts

### Do
- Delete chrome before adding any.
- Keep every text tone above 4.5:1 in both themes.
- Let type size, weight, and tone carry all hierarchy.
- Keep content visible at first paint.

### Don't
- Don't reintroduce cards, chips, status pills, or tag boxes.
- Don't use a warm/cream ground, a display serif, or a terracotta accent.
- Don't colour links with the accent.
- Don't add a sticky nav, scroll-spy, scroll-progress bar, or reveal-on-scroll.
- Don't add theme identities beyond light/dark/auto.
- Don't revive Operations Room / HUD / scanlines / fake terminal chrome.
- Don't use monospace as a personality costume — it is for code only.
- Don't ship SaaS metric strips, proof-card clusters, or neon hacker cliché.
