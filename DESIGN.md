---
name: Aman Thanvi Personal Website
description: A precise, field-tested cybersecurity portfolio with restrained HUD atmosphere and strong evidence scanning.
colors:
  bg: "oklch(0.1 0.026 268)"
  surface: "oklch(0.138 0.03 268)"
  text: "oklch(0.93 0.011 265)"
  muted: "oklch(0.6 0.028 265)"
  border: "oklch(0.32 0.038 268)"
  accent-hero: "oklch(0.76 0.14 194)"
  accent-projects: "oklch(0.7 0.18 142)"
  accent-experience: "oklch(0.73 0.14 75)"
  accent-skills: "oklch(0.68 0.19 330)"
  accent-blog: "oklch(0.62 0.17 255)"
  glow-hero: "oklch(0.55 0.18 194 / 0.32)"
  glow-projects: "oklch(0.5 0.2 142 / 0.32)"
  glow-experience: "oklch(0.52 0.16 75 / 0.3)"
  glow-skills: "oklch(0.48 0.22 330 / 0.32)"
  glow-blog: "oklch(0.45 0.2 255 / 0.3)"
typography:
  display:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "0"
  headline:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "0"
  title:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0"
  body:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.65rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.15em"
rounded:
  sm: "4px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent-hero}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  surface-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "20px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: Aman Thanvi Personal Website

## 1. Overview

**Creative North Star: "The Operations Room"**

The system should feel like a calm security operations room after the incident has been contained: precise instruments, readable evidence, and quiet confidence. The visual language uses HUD frames, terminal rhythms, circuit traces, and section accents, but every effect must serve credibility and scanning speed.

This is a brand portfolio, not a dashboard. The design communicates expertise through sequencing, hierarchy, concise prose, and controlled atmosphere. It explicitly rejects generic SaaS landing-page tropes, oversized metric blocks, hero proof-card clusters, decorative glass panels, flat identical card grids, fake terminal noise that hides content, and hacker-cliche neon overload.

**Key Characteristics:**
- Dark default with light, dune, and arcade alternates preserved.
- Section-specific accents that behave like evidence labels, not decoration.
- Monospace body copy as an existing identity choice, balanced by Sora headings.
- Flat surfaces at rest, accent glow only for state and signal.
- Uncluttered hero prose, with compact evidence patterns reserved for lower sections when they improve scanning.

## 2. Colors

The palette is a full technical signal palette: deep violet-blue neutrals, one accent per section, and glow tokens reserved for state.

### Primary
- **Ops Cyan** (`accent-hero`): identity, hero emphasis, primary CTA, focus ring fallback.

### Secondary
- **Evidence Green** (`accent-projects`): project rows, source/live actions, and casework tags.
- **Clearance Amber** (`accent-experience`): work timeline, education, publications.

### Tertiary
- **Credential Magenta** (`accent-skills`): certifications, honors, skills, language tags.
- **Archive Blue** (`accent-blog`): writing cards and blog navigation.

### Neutral
- **Night Console** (`bg`): page background and darkest interactive fill.
- **Raised Console** (`surface`): HUD frames, cards, mobile nav, and occasional legacy terminal accents.
- **Instrument Text** (`text`): primary content and headings.
- **Muted Telemetry** (`muted`): metadata, secondary prose, labels.
- **Panel Edge** (`border`): frames, dividers, quiet controls.

### Named Rules

**The Accent-as-Evidence Rule.** Section accents mark content type and state. Never spread all five accents into one local component.

**The Glow Budget Rule.** Glow appears on hover, focus, current navigation, and select ambient hero details. Static content should stay mostly flat.

## 3. Typography

**Display Font:** Sora, with system sans fallbacks.
**Body Font:** JetBrains Mono Variable, with system monospace fallbacks.
**Label/Mono Font:** JetBrains Mono Variable.

**Character:** Sora supplies clean professional authority for headings. JetBrains Mono carries the existing technical voice, but it must be spaced generously and kept out of long, dense walls when scanning matters.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, 1.08): hero name only.
- **Headline** (700, `clamp(1.5rem, 3vw, 1.875rem)`, 1.18): section headings.
- **Title** (600, `1rem`, 1.35): project, role, publication, and card titles.
- **Body** (400, `1rem`, 1.6): prose with a preferred line length under 65ch.
- **Label** (500, `0.65rem`, 0.15em tracking, uppercase): status tags, section IDs, navigation hints.

### Named Rules

**The No-Negative-Tracking Rule.** Letter spacing is never negative. Hierarchy comes from size, weight, color, and rhythm.

**The Prose-Wall Test.** Any paragraph over three factual clauses should become a list, proof grid, or tighter two-paragraph block.

## 4. Elevation

The system uses tonal layering first, then border and glow as state. Shadows are ambient and interactive, never heavy drop shadows. A resting card should feel embedded in the interface; a hovered card should feel inspected.

### Shadow Vocabulary
- **Accent Hover Glow** (`0 0 16px var(--section-glow)` to `0 0 28px var(--section-glow)`): use only for hover/focus on important interactive surfaces.
- **Avatar Ambient Glow** (`blur(48px)` with low alpha accent): identity emphasis behind the profile image.
- **Navigation Dot Glow** (`0 0 8px var(--dot-color)`): current-section indicator.

### Named Rules

**The Flat-Until-Inspected Rule.** Surfaces are flat at rest. Elevation appears when a visitor hovers, focuses, or navigates.

## 5. Components

### Buttons
- **Shape:** gently curved rectangular controls (8px radius).
- **Primary:** accent-tinted fill at rest, solid section accent on hover, compact padding (`10px 20px`).
- **Hover / Focus:** border shift, accent fill, visible 2px focus outline, optional accent glow.
- **Secondary / Ghost:** transparent surface with border and muted text, turning toward the active section accent on hover.

### Chips
- **Style:** low-alpha accent background, tiny label type, small radius (4px to 8px).
- **State:** chips are evidence labels, not buttons, unless explicitly wired as filters.

### Cards / Containers
- **Corner Style:** 8px radius maximum.
- **Background:** translucent surface over the theme background.
- **Shadow Strategy:** flat at rest, glow only on hover or focus.
- **Border:** one-pixel panel edge; no colored side-stripe borders.
- **Internal Padding:** 16px to 24px for cards, tighter for chips and timeline labels.

### Inputs / Fields
- **Style:** not specified. This site has no canonical form inputs beyond links and buttons.
- **Focus:** if inputs are added, use the active section accent as a 2px outline.
- **Error / Disabled:** not specified.

### Navigation
- **Style:** fixed right-edge section dots on desktop, compact top navigation on mobile.
- **Active State:** dot fill and glow use the destination section accent.
- **Mobile Treatment:** compact labels and safe-area padding. Keep the mobile bar focused on section movement.

### Terminal Window

Terminal styling is a legacy brand accent, not the default container. Use it only when command context is real or when it improves comprehension. Avoid fake prompts, fake cursors, and shell chrome around normal portfolio content.

### HUD Frame

HUD frames are evidence containers. Corner brackets are subtle, borders are one pixel, and hover state can brighten corners or add glow. Never nest HUD frames inside other HUD frames.

## 6. Do's and Don'ts

### Do:
- **Do** lead with verified signal: role, domains, credentials, and contact paths.
- **Do** keep accent colors tied to sections and content types.
- **Do** keep the hero uncluttered: image, role, concise prose, and contact links.
- **Do** preserve light, dark, dune, arcade, and reduced-motion behavior when changing components.
- **Do** use one-pixel borders, 8px maximum radius, and glow only as state.

### Don't:
- **Don't** use generic SaaS landing-page tropes.
- **Don't** use oversized metric blocks.
- **Don't** add hero proof-card clusters.
- **Don't** use decorative glass panels.
- **Don't** use flat identical card grids as the default layout.
- **Don't** use fake terminal noise that hides content.
- **Don't** use hacker-cliche neon overload.
- **Don't** use gradient text.
- **Don't** use border-left or border-right greater than 1px as a colored accent.
- **Don't** make the profile, projects, experience, and skills all compete with the same visual intensity.
