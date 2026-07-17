---
name: Aman Thanvi Personal Website
description: A precise, field-tested cybersecurity portfolio — cool near-neutral ink/paper with one committed signal accent, in light and dark.
themes: [dark, light]
colors:
  bg-dark: "oklch(0.17 0.012 258)"
  surface-dark: "oklch(0.215 0.014 258)"
  text-dark: "oklch(0.96 0.004 258)"
  muted-dark: "oklch(0.73 0.012 258)"
  border-dark: "oklch(0.32 0.014 258)"
  accent-dark: "oklch(0.78 0.16 55)"
  bg-light: "oklch(0.965 0.003 258)"
  surface-light: "oklch(0.99 0.0015 258)"
  text-light: "oklch(0.22 0.014 258)"
  muted-light: "oklch(0.44 0.014 258)"
  border-light: "oklch(0.86 0.006 258)"
  accent-light: "oklch(0.55 0.17 45)"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  heading:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.7rem"
    fontWeight: 500
    letterSpacing: "0.2em"
rounded:
  card: "0.75rem"
  pill: "999px"
---

# Design System: Aman Thanvi Personal Website

## 1. Overview

**Creative North Star: "Signal"**

A calm, precise instrument panel: cool near-neutral ink (dark) or paper (light) carrying one committed signal accent — a warm amber that reads as a beacon, a field marker, a status light. The identity is field-tested and quietly distinctive, deliberately avoiding the hacker-HUD cliché (scanlines, neon rainbow, terminal noise, glitch) that the category defaults to.

The design communicates expertise through sequencing, hierarchy, concise prose, and restraint. Color is used sparingly and decisively; typography and rhythm do the rest.

**Key Characteristics:**

- Two themes only: dark (default) and light. Both resolve accessibly (body contrast ≥ 4.5:1).
- One signal accent (`--color-accent`) across the whole page. No per-section color coding.
- Archivo (display + UI) paired with JetBrains Mono for labels, metadata, and code.
- Flat surfaces with 1px borders. Elevation and accent appear on hover/focus, not at rest.
- Varied section compositions (numbered list, timeline, tag clusters) instead of one repeated card grid.

## 2. Color

Cool near-neutral ramp (hue ~258) for background, surface, text, muted, and border, plus a single warm signal accent (hue ~45–55).

### Named Rules

**The Single-Signal Rule.** One accent carries the brand. Don't reintroduce a second hue for "variety"; differentiate with type, weight, space, and rhythm.

**The Accent-Budget Rule.** Accent is reserved for the name signature, primary CTA, links, active navigation, list indices, and hover/focus. Tags and chips stay neutral (border + muted text).

## 3. Typography

**Display / UI:** Archivo. **Labels / metadata / code:** JetBrains Mono.

Display tracking floor is `-0.03em` (never tighter than `-0.04em`); headings use `text-wrap: balance`, prose uses `text-wrap: pretty`. Body measure stays under ~68ch.

## 4. Elevation

Tonal layering first (bg → surface), then a 1px border. On hover/focus a surface lifts slightly and its border shifts to the accent. Avoid pairing a 1px border with a wide decorative glow.

## 5. Components

- **Buttons:** pill-shaped. Primary is an accent fill with `--color-accent-contrast` text; secondary is a bordered ghost with muted text that turns toward accent on hover.
- **Tags / metadata:** monospace, muted, unfilled. Not buttons.
- **Cards / panels:** `0.75rem` radius, 1px border, translucent surface; flat at rest.
- **Navigation:** fixed right-edge dot rail on desktop, compact top bar on mobile; active state uses the accent.

## 6. Do's and Don'ts

### Do
- Lead with verified signal: role, credentials, and contact before decoration.
- Keep the accent scarce and deliberate.
- Vary section layout for rhythm; keep one composition per idea.
- Preserve light, dark, and reduced-motion behavior when changing components.

### Don't
- Don't reintroduce multiple accent hues or per-section color coding.
- Don't use gradient text, glassmorphism, scanlines, or fake terminal chrome.
- Don't gate content visibility on scroll-reveal (content must render without JS).
- Don't fill tags/chips with accent color.
