# Plan 001: Make the type-check a real, blocking CI gate (and gate deploys on it)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 799d009..HEAD -- .github/workflows package.json` — if `.github/workflows/quality.yml`, `.github/workflows/pages.yml`, or `package.json` changed since this plan was written, compare the "Current state" excerpts against the live files before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED (making the gate blocking can turn CI red if the codebase currently has a latent type error — Step 1 catches this before any workflow change)
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `799d009`, 2026-07-16

## Why this matters

The repo has exactly one meaningful correctness gate for this static site — `npm run check` (Astro type-check) — plus `npm run build`. But in CI the type-check job is marked `continue-on-error: true`, so it can never fail a pull request, and the deploy workflow (`pages.yml`) never runs the type-check at all. The net effect: a broken type, a broken `astro:content` schema, or a bad import can merge to `main` and deploy to production with a green checkmark. This plan turns the existing check into an actual gate on PRs and blocks deploys when it fails, so every later change (including the other plans in this folder) has a trustworthy signal. It changes CI configuration only — no site code changes.

## Current state

Relevant files:

- `.github/workflows/quality.yml` — "Content Quality" workflow; runs on `pull_request` and `push` to `main`. Its `typecheck` job runs `npm run check` but with `continue-on-error: true`, so failures are cosmetic.
- `.github/workflows/pages.yml` — "Deploy Astro site to Pages"; runs on `push` to `main`. It runs `npm ci` then `npm run build`, then deploys `dist`. It does **not** run `npm run check`, and it does **not** depend on `quality.yml` (workflows run independently), so a push that fails the type-check still deploys.
- `package.json` — defines the scripts this plan relies on:

```4:11:package.json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
```

Current `typecheck` job in `.github/workflows/quality.yml` (note the trailing `continue-on-error: true`):

```48:58:.github/workflows/quality.yml
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
        continue-on-error: true
```

Current `build` job in `.github/workflows/pages.yml` (no type-check step):

```16:34:.github/workflows/pages.yml
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build Astro site
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist
```

Repo conventions to honor:
- Workflows pin action major versions with `@vN` (e.g. `actions/checkout@v7`, `actions/setup-node@v6`). Match that style; do not change existing action versions.
- Node version is `22` and npm cache is enabled in both workflows. Match it in any new step.
- The other three jobs in `quality.yml` (`lint-markdown`, `lint-yaml`, `spellcheck`) intentionally use third-party linters that produce noisy/false-positive output (proper nouns, etc.). **Leave those three jobs' `continue-on-error: true` as-is** — this plan only hardens the type-check, which is the deterministic correctness signal.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Install deps | `npm ci` | exit 0 |
| Type-check | `npm run check` | exit 0, "0 errors" reported by `astro check` |
| Build (optional local confirm) | `npm run build` | exit 0, writes `dist/` |
| YAML sanity (optional) | `npx yamllint .github/workflows` (only if `yamllint` available) | exit 0 |

This repo's dependencies may not be installed in your environment; run `npm ci` first. `npm ci` and `npm run build` write to `node_modules/` and `dist/` respectively — both are already git-ignored, so this is safe.

## Scope

**In scope** (the only files you should modify):
- `.github/workflows/quality.yml`
- `.github/workflows/pages.yml`

**Out of scope** (do NOT touch, even though they look related):
- Any file under `src/`, `public/`, or `astro.config.mjs` — this plan must not change site behavior or output.
- The `lint-markdown`, `lint-yaml`, and `spellcheck` jobs in `quality.yml` — leave their `continue-on-error: true` untouched (deliberate; noisy linters).
- `package.json` scripts — reuse `npm run check` / `npm run build` as they are.

## Git workflow

- Branch: `advisor/001-ci-verification-gate`
- One commit; message style is Conventional Commits (see `git log`, e.g. `chore(ci): ...`). Suggested: `ci: make astro type-check a blocking gate and gate deploys on it`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Establish the current baseline (must pass before changing CI)

Run the type-check locally exactly as CI will:

```
npm ci
npm run check
```

**Verify**: `npm run check` exits 0 and reports 0 errors.

**If `npm run check` reports ANY error**: STOP and report the errors. Do not proceed — making the gate blocking while the tree is red would immediately break `main`'s CI. The type errors must be fixed first (that is a separate change, out of scope here).

### Step 2: Make the type-check job blocking in `quality.yml`

In `.github/workflows/quality.yml`, delete the `continue-on-error: true` line under the `typecheck` job's `- run: npm run check` step (lines 57–58 in the excerpt above). The step must end at `- run: npm run check`.

Resulting `typecheck` job:

```yaml
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v6
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
```

**Verify**: `grep -n "continue-on-error" .github/workflows/quality.yml` returns exactly three matches, all inside the `lint-markdown`, `lint-yaml`, and `spellcheck` jobs (none in the `typecheck` job). Confirm by eye that the three remaining matches are not under `typecheck`.

### Step 3: Gate the deploy on the type-check in `pages.yml`

In `.github/workflows/pages.yml`, add a type-check step to the `build` job **before** the "Build Astro site" step, so a type error stops the deploy. Insert it between "Install dependencies" and "Build Astro site":

```yaml
      - name: Install dependencies
        run: npm ci
      - name: Type-check
        run: npm run check
      - name: Build Astro site
        run: npm run build
```

**Verify**: `grep -n "npm run check" .github/workflows/pages.yml` returns exactly one match, positioned before the `npm run build` line (compare line numbers).

### Step 4: Validate the workflow YAML is well-formed

Confirm both files still parse as valid YAML. If `python` is available:

```
python -c "import yaml,sys; [yaml.safe_load(open(f)) for f in ['.github/workflows/quality.yml','.github/workflows/pages.yml']]; print('yaml ok')"
```

**Verify**: prints `yaml ok` (exit 0). If neither `python` nor a YAML linter is available, skip this step and rely on Step 5, but note the skip in your report.

### Step 5: Confirm no site behavior changed

```
git diff --name-only 799d009..HEAD
```

**Verify**: only `.github/workflows/quality.yml` and `.github/workflows/pages.yml` (and `plans/README.md`, updated at the end) appear. No file under `src/`, `public/`, or config files changed.

## Test plan

No unit tests apply (CI configuration change). Verification is:
- `npm run check` exits 0 locally (Step 1) — proves the gate will be green on the current tree.
- Grep assertions in Steps 2–3 confirm the exact config edits.
- YAML parses (Step 4).

There is no existing test suite to model after; this repo verifies via type-check + build only.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `npm run check` exits 0 on the current tree (Step 1).
- [ ] `.github/workflows/quality.yml` has no `continue-on-error` under the `typecheck` job; `grep -c "continue-on-error" .github/workflows/quality.yml` returns `3`.
- [ ] `.github/workflows/pages.yml` runs `npm run check` before `npm run build` in the `build` job (`grep -n "npm run check" .github/workflows/pages.yml` returns one match, before the build line).
- [ ] `git diff --name-only 799d009..HEAD` shows only the two workflow files (plus `plans/README.md`).
- [ ] `plans/README.md` status row for 001 updated.

## STOP conditions

Stop and report back (do not improvise) if:

- `npm run check` reports any error in Step 1 (the tree is not currently green — report the exact errors; do not make the gate blocking over a red tree).
- The `typecheck` job in `quality.yml` no longer matches the "Current state" excerpt (someone changed it since commit `799d009`).
- `pages.yml`'s `build` job structure differs from the excerpt (e.g. steps renamed), so the insertion point is ambiguous.
- You find a reason the type-check is *intentionally* non-blocking (e.g. a comment or ADR saying so) — surface it instead of overriding it.

## Maintenance notes

- After this lands, any PR that breaks types (or `astro:content` schema, or an import) will fail the "Content Quality / typecheck" check, and a broken `main` push will fail "Deploy Astro site to Pages" before deploying. That is the intended behavior.
- If the team later wants the markdown/YAML/spell linters to also block, remove their `continue-on-error` too — but expect proper-noun false positives from `codespell` (the ignore list lives in `quality.yml`).
- A reviewer should confirm the `typecheck` job is the only one made blocking and that `pages.yml` still deploys `dist` unchanged.
- Follow-up deliberately deferred: adding a broken-internal-link check (e.g. the `robots.txt` → `sitemap.xml` gap addressed in plan 003) would strengthen this gate further, but is out of scope here.
