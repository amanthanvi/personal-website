# Plan 004: Correct stale stack docs (remove Three.js / boot-animation / particle-network claims; fix Astro version)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 799d009..HEAD -- README.md AGENTS.md .claude/CLAUDE.md CREDITS.md package.json`
> If any of these changed since this plan was written, compare the "Current
> state" excerpts against the live files before proceeding; on a mismatch,
> treat it as a STOP condition. A parallel design overhaul (light/dark themes
> only) may be editing the **theme-related** lines in these same files — this
> plan deliberately does NOT touch theme wording (see Scope) to avoid a
> collision.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW (documentation only; no code or build output changes)
- **Depends on**: recommended after `plans/002-remove-unmounted-dead-components.md` (so docs describe the post-cleanup tree), but the corrections here are accurate regardless of whether 002 has landed
- **Category**: docs
- **Planned at**: commit `799d009`, 2026-07-16

## Why this matters

The repo's own documentation describes a stack and features that no longer exist. `README.md`, `AGENTS.md`, `.claude/CLAUDE.md`, and `CREDITS.md` all state the site uses **Three.js** for a background particle field; `AGENTS.md` additionally lists a `particle network` script, a `three/` component folder, and a boot animation that "plays once per session," and pins **Astro v5**. In reality: there is no `three` dependency (`package.json` has only `astro` and `@astrojs/mdx`), no Three.js/particle code anywhere in `src/`, no `three/` folder, the boot component was unmounted from `index.astro` in commit `479c15f`, and Astro is on major version 7. This is worse than missing docs — it is actively wrong, and this repo is explicitly agent-driven (the `AGENTS.md` "Cursor Cloud" section tells an AI agent to "wait for the boot animation and Three.js background to finish before inspecting the hero," sending every future agent to wait for something that never happens). Correcting it removes a standing source of wasted effort for both humans and agents.

## Current state

Verified facts (from the live tree at commit `799d009`):
- `package.json` `dependencies` = `@astrojs/mdx` + `astro` only; `astro` is `^7.0.6` (major **7**). No `three`.
- No file under `src/` references `three`, `Three`, `particle`, or `WebGL`.
- No `src/components/three/` directory exists.
- The boot component is not mounted anywhere (`git grep "<BootSequence"` finds only its own file); it was removed from `src/pages/index.astro` in commit `479c15f`.

The four docs to correct, with the exact stale strings:

**`README.md`**

```3:3:README.md
Static portfolio built with [Astro](https://astro.build/) (v5), [Tailwind CSS](https://tailwindcss.com/) v4, and [Three.js](https://threejs.org/) for an optional background. Single scrolling homepage plus MDX blog posts, multiple themes (including Arcade), deployed to GitHub Pages.
```

```19:19:README.md
| [`src/components/`](src/components/) | Layout, sections, UI, Three.js |
```

**`AGENTS.md`** (relevant stale lines):

- `- **Framework**: Astro v5 + Tailwind CSS v4 + Three.js — static site builder with content collections.`
- `- **Scripts**: `src/scripts/` — TypeScript modules for theme toggle, boot sequence, particle network, HUD nav, scroll reveal, `arcade-easter-eggs.ts` (keyboard Easter eggs when Arcade UI is present).`
- `- **Components**: `src/components/` — organized into `layout/`, `ui/`, `sections/`, `three/`, `boot/`.`
- `- **Three.js**: Dynamic-imported after DOMContentLoaded, gated on `!prefers-reduced-motion`. Particle colors interpolate based on scroll position.`
- `- **Boot sequence**: Plays once per session (sessionStorage gate), respects reduced-motion.`
- `- Performance budget: <500KB total, <3s LCP, Three.js gzipped ~117KB.`
- In "Cursor Cloud specific instructions": `The homepage plays a one-time boot animation (sessionStorage-gated) and a Three.js background; wait for it to finish before inspecting the hero. These are gated on `!prefers-reduced-motion`, so a spinning cube / boot screen is expected behavior, not a crash.`

**`.claude/CLAUDE.md`** (relevant stale lines):

- `Astro 5 static site with MDX content, Tailwind 4, and Three.js.`
- `- Framework: Astro 5 (static SSG + MDX)`
- `- 3D: Three.js`
- `- Three.js for interactive 3D elements`

**`CREDITS.md`** (relevant stale row in the "Open-source software" table):

```11:11:CREDITS.md
| [Three.js](https://threejs.org/) | Background particle field | MIT |
```

Repo conventions to honor:
- Keep Markdown table pipes aligned with neighboring rows.
- Match the existing terse, bulleted voice in `AGENTS.md`/`CLAUDE.md`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Confirm Astro major | `node -e "console.log(require('./package.json').dependencies.astro)"` | prints `^7.0.6` (major 7) |
| No Three.js refs remain | `git grep -in "three.js\|three/\|particle network\|particle field" -- README.md AGENTS.md .claude/CLAUDE.md CREDITS.md` | no output |
| Markdown lint (optional) | `npx markdownlint-cli2 README.md` (only if available) | exit 0 |

No build is required (docs only). `git grep` is read-only.

## Scope

**In scope** (edit only these):
- `README.md`
- `AGENTS.md`
- `.claude/CLAUDE.md`
- `CREDITS.md`

**Out of scope** (do NOT touch, even though they appear in the same files):
- **Any theme wording** — the lists `auto`, `dark`, `light`, `dune`, `arcade`, the phrase "multiple themes (including Arcade)", the Arcade/Dune homage sections and theme-font rows in `CREDITS.md`, and the `**Theme**:` bullet in `AGENTS.md`. A parallel design overhaul owns theme changes; leave every theme reference exactly as-is.
- Any code, config, or content file. This plan changes prose only.
- The `codespell` ignore list and CI in `AGENTS.md`/`quality.yml`.

## Git workflow

- Branch: `advisor/004-fix-stack-docs`
- One commit, Conventional Commits style (see `git log`): `docs: correct stale Three.js / boot / Astro-version references`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

> For each edit below, the "→" shows the exact replacement. Change only the
> quoted text; leave surrounding lines untouched. Do not alter theme wording.

### Step 1: `README.md`

- Line 3, replace only this fragment:
  - `Static portfolio built with [Astro](https://astro.build/) (v5), [Tailwind CSS](https://tailwindcss.com/) v4, and [Three.js](https://threejs.org/) for an optional background.`
  - → `Static portfolio built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/) v4.`
  - (Leave the rest of the sentence — "Single scrolling homepage plus MDX blog posts, multiple themes (including Arcade), deployed to GitHub Pages." — unchanged.)
- Line 19, replace the table cell:
  - `| Layout, sections, UI, Three.js |` → `| Layout, sections, UI |`

**Verify**: `git grep -in "three" -- README.md` returns no output.

### Step 2: `AGENTS.md`

Apply these replacements:

- `- **Framework**: Astro v5 + Tailwind CSS v4 + Three.js — static site builder with content collections.`
  → `- **Framework**: Astro 7 + Tailwind CSS v4 — static site builder with content collections.`
- `- **Scripts**: `src/scripts/` — TypeScript modules for theme toggle, boot sequence, particle network, HUD nav, scroll reveal, `arcade-easter-eggs.ts` (keyboard Easter eggs when Arcade UI is present).`
  → `- **Scripts**: `src/scripts/` — TypeScript modules for theme toggle (`theme.ts`), HUD nav (`hud-nav.ts`), and scroll reveal (`scroll-reveal.ts`).`
- `- **Components**: `src/components/` — organized into `layout/`, `ui/`, `sections/`, `three/`, `boot/`.`
  → `- **Components**: `src/components/` — organized into `layout/`, `ui/`, `sections/`.`
- Delete this bullet entirely:
  - `- **Three.js**: Dynamic-imported after DOMContentLoaded, gated on `!prefers-reduced-motion`. Particle colors interpolate based on scroll position.`
- Delete this bullet entirely:
  - `- **Boot sequence**: Plays once per session (sessionStorage gate), respects reduced-motion.`
- `- Performance budget: <500KB total, <3s LCP, Three.js gzipped ~117KB.`
  → `- Performance budget: <500KB total, <3s LCP.`
- In the "Cursor Cloud specific instructions" section, replace:
  - `The homepage plays a one-time boot animation (sessionStorage-gated) and a Three.js background; wait for it to finish before inspecting the hero. These are gated on `!prefers-reduced-motion`, so a spinning cube / boot screen is expected behavior, not a crash.`
  - → `The homepage is a static single-page scroll with CSS/SVG atmosphere only — there is no boot animation and no Three.js/WebGL background. Scroll-reveal transitions and section-accent HUD styling are the only motion, gated on `!prefers-reduced-motion`.`

**Verify**: `git grep -in "three.js\|particle network\|boot animation\|boot sequence\|three/" -- AGENTS.md` returns no output. (The `**Theme**:` bullet and its `auto/dark/light/dune/arcade` list must still be present and unchanged.)

### Step 3: `.claude/CLAUDE.md`

- `Astro 5 static site with MDX content, Tailwind 4, and Three.js.`
  → `Astro 7 static site with MDX content and Tailwind 4.`
- `- Framework: Astro 5 (static SSG + MDX)` → `- Framework: Astro 7 (static SSG + MDX)`
- Delete the line `- 3D: Three.js`
- Delete the line `- Three.js for interactive 3D elements`

**Verify**: `git grep -in "three" -- .claude/CLAUDE.md` returns no output.

### Step 4: `CREDITS.md`

- Delete the entire table row:
  - `| [Three.js](https://threejs.org/) | Background particle field | MIT |`
- Leave the surrounding table header, the Astro/Tailwind/TypeScript rows, and every Arcade/Dune homage section untouched.

**Verify**: `git grep -in "three" -- CREDITS.md` returns no output.

### Step 5: Whole-repo confirmation of the doc corrections

```
git grep -in "three.js\|particle network\|particle field" -- README.md AGENTS.md .claude/CLAUDE.md CREDITS.md
node -e "const v=require('./package.json').dependencies.astro; if(!/^[\^~]?7\./.test(v)){console.error('astro major changed: '+v+' — update docs to match'); process.exit(1);} console.log('astro major 7 confirmed');"
```

**Verify**: the first command returns no output; the second prints `astro major 7 confirmed`. If `package.json`'s `astro` major is no longer 7, use that major in Steps 2–3 instead of `7` and re-run.

## Test plan

Docs-only; no automated tests. Verification is the grep assertions per step (no surviving Three.js/particle/boot claims) plus the Astro-major check in Step 5. Optionally run `npx markdownlint-cli2 README.md` if available (the CI markdown-lint job only lints `README.md` and is non-blocking).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `git grep -in "three.js\|three/\|particle network\|particle field" -- README.md AGENTS.md .claude/CLAUDE.md CREDITS.md` returns nothing.
- [ ] `git grep -in "boot animation\|boot sequence" -- AGENTS.md` returns nothing.
- [ ] `AGENTS.md` and `README.md` no longer say "Astro v5"/"(v5)"; `.claude/CLAUDE.md` no longer says "Astro 5".
- [ ] The `auto/dark/light/dune/arcade` theme list in `AGENTS.md` and the "multiple themes (including Arcade)" phrase in `README.md` are unchanged (theme wording untouched).
- [ ] Only the four doc files changed (`git status`).
- [ ] `plans/README.md` status row for 004 updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any target string in "Current state" no longer matches the live file (drift since `799d009` — possibly the design overhaul edited it first).
- `package.json`'s `astro` dependency is missing or its major is not 7 and not clearly determinable.
- You are tempted to "also fix" a theme reference — don't; report it as belonging to the design overhaul instead.
- A Three.js reference exists in a file **not** listed in Scope — report it; do not expand scope silently.

## Maintenance notes

- Prose docs that hardcode a framework major version (`Astro 7`) will drift again on the next major bump. Consider, as a follow-up, phrasing these as "Astro (see `package.json`)" so there is a single source of truth. Left as a judgment call for the owner.
- If `plans/002` has NOT been executed when this lands, the orphaned `src/components/boot/` folder and `src/scripts/{boot-sequence,sandworm-cursor,arcade-easter-eggs}.ts` files still physically exist (unmounted). The doc corrections here are still accurate (those features do not run), but the repo will have dead files until 002 removes them — flag that in the PR description.
- The Arcade/Dune homage sections and theme-font rows in `CREDITS.md` will likely need updating when the design overhaul collapses themes to light/dark. That is intentionally left to that effort; note it as a known follow-up so it isn't forgotten.
