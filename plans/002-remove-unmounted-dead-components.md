# Plan 002: Delete never-mounted components, orphaned scripts, their dead CSS, and the unused `react-doctor` dependency

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 799d009..HEAD -- src package.json`
> If any listed in-scope file changed since this plan was written, compare the
> "Current state" facts against the live code before proceeding. Note: a
> parallel design overhaul (light/dark themes only) may have already deleted
> some of these files. If a file this plan says to delete is **already gone**,
> that is fine — verify it is absent and continue. If any of these components
> has been newly **mounted** (imported/rendered) somewhere since `799d009`,
> treat it as a STOP condition (it is no longer dead).

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW (every file removed is verified to have zero render sites; the risk is missing a reference, which the grep gates catch)
- **Depends on**: none (recommended after 001 so the type-check/build gate is blocking)
- **Category**: tech-debt
- **Planned at**: commit `799d009`, 2026-07-16

## Why this matters

Five components and three behavior scripts — roughly 1,000+ lines, dominated by the 607-line `src/scripts/sandworm-cursor.ts` — are defined in the repo but **never imported or rendered anywhere** in the page tree. `BootSequence` was removed from `src/pages/index.astro` in commit `479c15f` but its files were left behind; `SandwormCursor`, `ArcadeEasterEggs`, `CircuitTrace`, and `TerminalWindow` are likewise orphaned. This dead code inflates the repo, misleads both humans and AI agents (the boot animation, the sandworm cursor, and the Konami/phrase Easter eggs documented elsewhere in the repo don't actually run), and makes the codebase harder to reason about. Deleting it — plus the CSS that only those components used, plus the `react-doctor` devDependency that nothing imports — is a pure reduction with no behavior change: the built site is byte-for-byte equivalent in what it renders, because none of this was rendering.

## Current state

### The five never-mounted components (confirmed: zero render sites)

A repo-wide search for each component's JSX usage (`<BootSequence`, `<SandwormCursor`, `<ArcadeEasterEggs`, `<CircuitTrace`, `<TerminalWindow`) returns **only their own definition files** — no layout, page, or other component imports or renders them. The layouts that *do* exist mount only a fixed set:

```1:9:src/layouts/BaseLayout.astro
import BaseHead from '../components/layout/BaseHead.astro';
import SkipLink from '../components/layout/SkipLink.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import DuneDunes from '../components/ui/DuneDunes.astro';
import ScrollProgress from '../components/ui/ScrollProgress.astro';
import '../styles/global.css';
```

`src/pages/index.astro`, `src/pages/404.astro`, and `src/layouts/BlogPostLayout.astro` import none of the five. (History confirms the boot component was deliberately unmounted: `git log -S "BootSequence" -- src/pages` shows it was added in `27fba1a` and removed in `479c15f`.)

Files to delete (component + its script, where one exists):

| Component file | Its script (also delete) | Lines (approx) |
|---|---|---|
| `src/components/boot/BootSequence.astro` | `src/scripts/boot-sequence.ts` | 47 + 109 |
| `src/components/ui/SandwormCursor.astro` | `src/scripts/sandworm-cursor.ts` | 21 + 607 |
| `src/components/ui/ArcadeEasterEggs.astro` | `src/scripts/arcade-easter-eggs.ts` | 20 + 147 |
| `src/components/ui/CircuitTrace.astro` | (no script) | 63 |
| `src/components/ui/TerminalWindow.astro` | (no script) | 22 |

After deleting `BootSequence.astro`, the `src/components/boot/` directory will be empty — remove the directory too.

Each script is imported **only** by its own component (which is itself being deleted), e.g.:

```5:13:src/components/ui/SandwormCursor.astro
<script>
  import { mountSandwormCursorController } from "../../scripts/sandworm-cursor";

  let release: (() => void) | null = null;

  function boot(): void {
    release?.();
    release = mountSandwormCursorController();
  }
```

### Dead CSS that only these components used

These selectors are referenced **only** by the components being deleted (verified by grep — each appears in a `.css` file plus the dead component, and nowhere in a live component):

1. `.sandworm-cursor-root` and the `.sandworm-cursor-active` cursor-hiding block — `src/styles/global.css`:

```232:240:src/styles/global.css
/* Fixed mount for sandworm canvas — above HUD layers, below skip-link focus ring */
.sandworm-cursor-root {
  position: fixed;
  inset: 0;
  width: 100%;
  min-height: 100%;
  pointer-events: none;
  z-index: 960;
}
```

```277:286:src/styles/global.css
/*
 * Sandworm cursor: hide system cursor everywhere (nested utilities often set
 * cursor:pointer on icons/spans and were winning over html/body cursor:none).
 */
html[data-theme="dune"].sandworm-cursor-active,
html[data-theme="dune"].sandworm-cursor-active *,
html[data-theme="dune"].sandworm-cursor-active *::before,
html[data-theme="dune"].sandworm-cursor-active *::after {
  cursor: none !important;
}
```

2. The circuit-trace draw rules — `src/styles/hud.css`:

```156:168:src/styles/hud.css
/* Circuit path draw on scroll reveal */
.circuit-trace.revealed .circuit-path {
  animation: circuit-draw 1.2s var(--ease-reveal) both;
}

.circuit-trace.revealed .circuit-branch {
  animation: circuit-draw 0.4s var(--ease-reveal) 0.8s both;
}

.circuit-trace.revealed .circuit-dot {
  transition: opacity 0.3s var(--ease-reveal) 1.2s;
  opacity: 0.6;
}
```

3. The `.terminal-type` typing effect — `src/styles/hud.css` (not used by `TerminalWindow.astro`, which styles itself with inline Tailwind classes `terminal-window`/`terminal-dots`; `.terminal-type` has no user in live code):

```181:191:src/styles/hud.css
/* Terminal command typing effect */
.terminal-type {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
}

.reveal.revealed .terminal-type {
  animation: typing 0.8s steps(20) both 0.3s;
}
```

4. The `blink-cursor` keyframe — `src/styles/animations.css` (used only by `.boot-cursor`, which lives inside `BootSequence.astro`):

```86:89:src/styles/animations.css
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

**Keep (do NOT remove) — these look similar but are live:** `.hud-frame` (used by `src/components/ui/HudBorder.astro`), `.divider-line` (used by `src/components/ui/SectionHeading.astro`), `.avatar-scan` (used by `HeroSection.astro`), `.timeline-draw` (used by `ExperienceSection.astro`), `.reveal`/`.revealed` (used everywhere), and the `nudge-right` keyframe (used by `BlogSection.astro`).

### The unused `react-doctor` devDependency

`package.json` lists `react-doctor` as a devDependency, but a repo-wide search finds it referenced **only** in `package.json` and `package-lock.json` — no script, config, or source file uses it (this is a static Astro site with no React):

```16:22:package.json
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "@tailwindcss/vite": "^4.3.0",
    "react-doctor": "^0.1.6",
    "tailwindcss": "^4.3.0",
    "typescript": "^5.7.0"
  },
```

### Repo conventions
- Two-space indentation; keep the existing CSS comment style when trimming blocks (remove the comment that belongs to a removed rule).
- Removing a CSS rule: delete the rule **and** its immediately-preceding explanatory comment; leave a single blank line between adjacent surviving rules (don't leave double blank lines).

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install deps | `npm ci` | exit 0 |
| Type-check | `npm run check` | exit 0, 0 errors |
| Build | `npm run build` | exit 0, writes `dist/` |
| Find a render site | `git grep -n "<ComponentName"` | (used in verification below) |

`npm ci` / `npm run build` write to git-ignored `node_modules/` and `dist/` — safe.

## Scope

**In scope** (modify/delete only these):
- Delete: `src/components/boot/BootSequence.astro`, `src/scripts/boot-sequence.ts`
- Delete: `src/components/ui/SandwormCursor.astro`, `src/scripts/sandworm-cursor.ts`
- Delete: `src/components/ui/ArcadeEasterEggs.astro`, `src/scripts/arcade-easter-eggs.ts`
- Delete: `src/components/ui/CircuitTrace.astro`
- Delete: `src/components/ui/TerminalWindow.astro`
- Delete the now-empty `src/components/boot/` directory
- Edit: `src/styles/global.css` (remove the two sandworm blocks)
- Edit: `src/styles/hud.css` (remove the circuit-trace block and the `.terminal-type` block)
- Edit: `src/styles/animations.css` (remove the `blink-cursor` keyframe)
- Edit: `package.json` (remove the `react-doctor` devDependency line) and regenerate `package-lock.json`

**Out of scope** (do NOT touch, even though they look related):
- `src/components/ui/DuneDunes.astro` — it IS mounted (in `BaseLayout.astro`) and renders under `[data-theme="dune"]`. It is live; leave it. (A separate theme-collapse effort owns theme removal.)
- The dune/arcade theme CSS blocks in `global.css`/`arcade.css`, `src/scripts/theme.ts`, and `src/components/ui/ThemeToggle.astro` — theme-system scope, owned by the parallel design overhaul. Do not touch.
- The unused `--animate-*` tokens/keyframes (`fade-in-up`, `glitch`, `pulse-glow`, `circuit-draw`, `typing`, `scan-line`) — see Maintenance notes; deliberately deferred to avoid colliding with the design overhaul's CSS work.
- Any live component: `HudBorder`, `SectionHeading`, `BadgeShield`, `GlitchText`, `ScrollProgress`, `SkipLink`, `DuneDunes`, all `sections/`, all `layout/`.

## Git workflow

- Branch: `advisor/002-remove-dead-components`
- Commit in logical units, Conventional Commits style (see `git log`): e.g. `refactor: remove never-mounted components and orphaned scripts`, then `chore: drop unused react-doctor devDependency`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Re-confirm each component is unmounted (safety gate)

For each of the five, confirm there is no render site other than its own definition file:

```
git grep -n "<BootSequence" -- 'src/**/*.astro'
git grep -n "<SandwormCursor" -- 'src/**/*.astro'
git grep -n "<ArcadeEasterEggs" -- 'src/**/*.astro'
git grep -n "<CircuitTrace" -- 'src/**/*.astro'
git grep -n "<TerminalWindow" -- 'src/**/*.astro'
```

**Verify**: every command returns **no output** (self-closing/opening tags are only ever written where the component is *used*; a component's own file never contains its own tag). If any command returns a match, that component is mounted — **STOP** (see STOP conditions).

Also confirm each script is imported only by the component being deleted:

```
git grep -n "sandworm-cursor" -- src
git grep -n "arcade-easter-eggs" -- src
git grep -n "boot-sequence" -- src
```

**Verify**: `sandworm-cursor` matches only `SandwormCursor.astro`, `sandworm-cursor.ts`, and the two `global.css` blocks (to be removed in Step 3). `arcade-easter-eggs` matches only `ArcadeEasterEggs.astro` and `arcade-easter-eggs.ts`. `boot-sequence` matches only `BootSequence.astro` and `boot-sequence.ts`. Any other match → investigate before deleting.

### Step 2: Delete the component and script files

Delete these eight files and the empty `boot/` directory:

- `src/components/boot/BootSequence.astro`
- `src/scripts/boot-sequence.ts`
- `src/components/ui/SandwormCursor.astro`
- `src/scripts/sandworm-cursor.ts`
- `src/components/ui/ArcadeEasterEggs.astro`
- `src/scripts/arcade-easter-eggs.ts`
- `src/components/ui/CircuitTrace.astro`
- `src/components/ui/TerminalWindow.astro`
- `src/components/boot/` (directory, now empty)

**Verify**: `git status --porcelain` shows exactly these eight files as deleted (`D`). `ls src/components/boot 2>/dev/null` returns nothing (directory gone).

### Step 3: Remove the dead CSS tied to the deleted components

In `src/styles/global.css`, delete both sandworm blocks shown in "Current state" (the `.sandworm-cursor-root` rule with its comment, lines ~232–240; and the `html[data-theme="dune"].sandworm-cursor-active ...` rule with its comment, lines ~277–286).

In `src/styles/hud.css`, delete the circuit-trace block (comment + three rules, lines ~156–168) and the `.terminal-type` block (comment + two rules, lines ~181–191).

In `src/styles/animations.css`, delete the `blink-cursor` keyframe (lines ~86–89).

**Verify**: these return **no matches**:

```
git grep -n "sandworm-cursor-root\|sandworm-cursor-active" -- src/styles
git grep -n "circuit-trace\|circuit-path\|circuit-branch\|circuit-dot" -- src/styles
git grep -n "terminal-type" -- src/styles
git grep -n "blink-cursor" -- src
```

All four commands must return nothing. If `circuit-draw` or `typing` still appear as `@keyframes`/token definitions, that is expected and out of scope for this plan (see Maintenance notes) — only the `.circuit-*` and `.terminal-type` *selectors* and the `blink-cursor` keyframe are removed here.

**Verify (keep-list intact)**: these MUST still return matches (proving live CSS was not removed):

```
git grep -n "hud-frame" -- src/styles      # used by HudBorder
git grep -n "avatar-scan" -- src/styles     # used by HeroSection
git grep -n "timeline-draw" -- src/styles   # used by ExperienceSection
git grep -n "divider-line" -- src/styles    # used by SectionHeading
```

### Step 4: Remove the unused `react-doctor` devDependency

In `package.json`, delete the line `"react-doctor": "^0.1.6",` from `devDependencies`. Then regenerate the lockfile:

```
npm install
```

(This updates `package-lock.json` to drop `react-doctor`; it writes to git-ignored `node_modules/` and to `package-lock.json`, which is tracked and expected to change here.)

**Verify**: `git grep -n "react-doctor" -- package.json package-lock.json` returns **no matches**.

### Step 5: Full verification — type-check and build

```
npm run check
npm run build
```

**Verify**: both exit 0. `npm run check` reports 0 errors. `npm run build` completes and writes `dist/`. A successful build proves no remaining file imported any deleted module and no `.astro` referenced a deleted component.

## Test plan

No unit-test framework exists in this repo; verification is type-check + build (the same gates CI uses):
- `npm run check` → 0 errors (catches dangling imports / missing components at the type layer).
- `npm run build` → exit 0 (catches any remaining reference at build time; Astro fails the build on an unresolved import or component).
- The grep assertions in Steps 1, 3, and 4 are the regression checks: they prove the deleted symbols have no surviving references and the live keep-list is intact.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] The eight files listed in Step 2 no longer exist; `src/components/boot/` is gone.
- [ ] `git grep -n "sandworm-cursor-root\|circuit-trace\|terminal-type\|blink-cursor" -- src` returns nothing.
- [ ] `git grep -n "react-doctor" -- package.json package-lock.json` returns nothing.
- [ ] `git grep -n "hud-frame" -- src/styles` and `git grep -n "avatar-scan" -- src/styles` still return matches (live CSS preserved).
- [ ] `npm run check` exits 0 with 0 errors.
- [ ] `npm run build` exits 0.
- [ ] No file outside the Scope list was modified (`git status`).
- [ ] `plans/README.md` status row for 002 updated.

## STOP conditions

Stop and report back (do not improvise) if:

- Any `git grep -n "<ComponentName"` in Step 1 returns a match outside the component's own file — the component is mounted and is NOT dead; do not delete it.
- A file this plan deletes has, since commit `799d009`, been imported by a live layout/page/component (drift-check surfaces this).
- `npm run check` or `npm run build` fails after the deletions — a reference you didn't expect exists; report the error rather than hunting blindly.
- Removing a CSS block would also remove a selector that a live component uses (the keep-list verification in Step 3 fails) — stop and re-scope.

## Maintenance notes

- **Interaction with the parallel design overhaul (light/dark only):** `SandwormCursor` (dune) and `ArcadeEasterEggs` (arcade) are theme-flavored; the design effort collapsing themes may delete these independently. This plan is safe either way — if they're already gone when you run it, skip those deletions and continue. `BootSequence`, `CircuitTrace`, and `TerminalWindow` are theme-agnostic dead code and are worth removing regardless of the theme decision.
- **Deferred follow-up (not in this plan):** the `@theme` block in `global.css` defines `--animate-fade-in-up`, `--animate-glitch`, `--animate-pulse-glow`, `--animate-circuit-draw`, `--animate-typing`, and `--animate-scan-line`, plus the `fade-in-up`/`glitch`/`pulse-glow`/`circuit-draw`/`typing`/`scan-line` keyframes. A repo search shows none of these are used as `animate-*` utilities in markup (the only animation utility used is `animate-[nudge-right...]` in `BlogSection.astro`, and `GlitchText.astro` defines its own local `glitch-top`/`glitch-bottom` keyframes). These are candidates for removal, but were left out here because the design overhaul is actively rewriting `global.css`; prune them in coordination with that work to avoid conflicts.
- **Also unused but intentionally left:** `.hud-corners` and `.glow-text` (in `hud.css`) currently have no users, but they are generic HUD utilities the design system documents (`DESIGN.md` §5). Leave them unless the design overhaul confirms they're gone for good.
- A reviewer should confirm the built `dist/` renders identically to before (nothing user-visible was removed, because none of this was mounted).
