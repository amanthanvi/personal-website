---
name: Aman Thanvi Personal Website
description: A cozy-minimal personal portfolio — calm, readable, and lightly warm.
colors:
  bg: "oklch(0.97 0.006 80)"
  surface: "oklch(0.99 0.003 80)"
  text: "oklch(0.28 0.015 55)"
  muted: "oklch(0.48 0.014 55)"
  border: "oklch(0.88 0.01 80)"
  accent: "oklch(0.45 0.1 45)"
  glow: "oklch(0.45 0.1 45 / 0.18)"
  bg-dark: "oklch(0.14 0.005 260)"
  surface-dark: "oklch(0.18 0.006 260)"
  text-dark: "oklch(0.93 0.004 260)"
  muted-dark: "oklch(0.68 0.01 260)"
  border-dark: "oklch(0.28 0.008 260)"
  accent-dark: "oklch(0.8 0.07 55)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0"
  body:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  label:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0"
rounded:
  sm: "0"
  md: "0"
  lg: "0"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "12px 22px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "12px 22px"
  surface-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "20px"
  chip:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
---

# Design System: Aman Thanvi Personal Website

## 1. Overview

**Creative North Star: "Cozy desk"**

The site should feel like sitting down at a quiet desk with good light: soft surfaces, warm readable type, and room to breathe. It is a personal introduction first—projects, research, and writing sit below without competing for attention.

This replaces the former **Operations Room** identity (HUD frames, scanlines, multi-theme dune/arcade atmosphere, mono-as-costume, section-rainbow accents). Those are anti-references.

**Key Characteristics:**
- Binary themes only: `light`, `dark`, and `auto` (system).
- Soft warm-stone neutrals; one quiet clay accent used sparingly (≤10% of the surface).
- Warm display face + friendly sans body; monospace only for real code.
- Simple top navigation; no HUD dots, SEC labels, glitch, or fake terminals.
- Compact vertical rhythm; short copy; quick opacity/translate motion only (~150–280ms).

## 2. Colors

**Strategy: Restrained** — neutrals carry the page; one accent marks primary actions and focus.

### Neutrals (light default)
- **Desk Paper** (`bg`): soft warm stone page ground — not cream brochure paper.
- **Raised Sheet** (`surface`): slightly brighter panels and cards.
- **Ink** (`text`): readable warm charcoal.
- **Pencil** (`muted`): secondary prose and metadata.
- **Hairline** (`border`): quiet edges.

### Accent
- **Clay** (`accent`): warm muted ochre-clay for CTAs, focus rings, and light emphasis. Do not invent a second brand accent per section.

### Dark
OLED-friendly soft black (editor-style, near-neutral cool) with slightly lifted surfaces. No warm mocha washes. Same roles as light; clay accent brightens a touch for contrast.

### Named Rules

**The One-Accent Rule.** Section wrappers may keep semantic class names for structure, but visual accent tokens all resolve to Clay.

**The No-Glow-Costume Rule.** Soft shadow with offset and blur is fine for hover depth. Zero-offset colored halos and scanline overlays are not.

## 3. Typography

**Display / Headings:** Bricolage Grotesque.
**Body / UI:** Figtree.
**Mono:** system monospace stack, only inside `code` / `pre`.

### Hierarchy
- **Display**: hero name only.
- **Headline**: section titles.
- **Title**: project, role, and card titles.
- **Body**: prose under ~65ch.
- **Label**: metadata without forced uppercase tracking costumes.

### Named Rules

**The Readable-Body Rule.** Body copy is a proportional sans, never monospace dressed as “technical.”

**The Quiet-Label Rule.** Avoid uppercase + wide tracking as default section chrome.

## 4. Layout

- Max content width ~64–72rem for the homepage; blog prose ~48rem.
- Section padding ~3–3.5rem vertical; tighter groups, less empty scroll.
- Hero: one composition — photo, name, short role line, one CTA group.
- Desktop: sticky top bar with links + theme control. Mobile: compact top bar with the same links (or a short row) plus theme control.

## 5. Elevation & Depth

Tonal layering first. Surfaces stay flat. Hover may strengthen the border only — no lift, glow, or drop shadow.

## 6. Shapes

- Sharp corners throughout (`border-radius: 0`). Hairline borders, flat surfaces, no soft card shadows.
- Prefer plain rectangles; no pill chrome.

## 7. Components

### Buttons
- Primary: solid Clay fill, light text on dark fill (or dark text on light fill when needed for contrast).
- Secondary: transparent with hairline border; muted text.

### Cards
- Light surface on bg, 1px border, padding 16–24px.
- Used when grouping interactive or list content — not as decorative shells in the hero.

### Navigation
- Horizontal top nav; current section can use weight or underline, not glowing dots.

### Theme toggle
- Cycles or selects among Auto / Light / Dark only. Mounted on homepage (desktop + mobile) and blog layout.

## 8. Do's and Don'ts

### Do
- Lead with a friendly introduction and real contact paths.
- Keep light, dark, and reduced-motion working.
- Prefer deletion of chrome over adding atmosphere.

### Don't
- Don't revive Operations Room / HUD / scanlines / glitch / fake terminal chrome.
- Don't add dune, arcade, or other theme identities.
- Don't use five section-rainbow accents.
- Don't use monospace as a personality costume.
- Don't ship generic SaaS metric strips, proof-card clusters, or neon hacker cliché.
