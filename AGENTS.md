# Repository Guidelines

## Project Structure & Module Organization
- Root `index.html` contains all markup, critical CSS, and the theme toggle; edit here for copy or design tweaks.
- `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, and `CNAME` support GitHub Pages routing—keep canonical URLs aligned.
- Assets live in `static/images/`; compress profile imagery (<200 KB) and retain width/height attributes in HTML.
- GitHub Actions reside in `.github/workflows/`: `pages.yml` deploys, while `quality.yml` runs lint, spellcheck, and link audits.

## Build, Test, and Development Commands
- `python3 -m http.server 8080` — local preview with correct MIME types.
- `npx serve .` — optional alternative when Node is available.
- `codespell --ignore-words-list adn,aman,thanvi,doj,ustp,cisa,nasa,umd,sdls,cfs,nos3,ccds,ngn,scan,ltsc,eoust,govt,config` — mirrors CI spellcheck; run before content-heavy commits.
- `npx lychee --no-progress './*.html'` — quick link validation consistent with automation.

## Coding Style & Naming Conventions
- Use two-space indentation; follow existing attribute ordering (`lang`, `data-theme`, meta, link, script).
- Keep inline CSS grouped by purpose inside the single `<style>` block; limit new utility classes.
- Favor semantic HTML (`header`, `main`, `section`) and descriptive `aria-*` labels; match the existing tone.
- Keep file names lowercase with hyphens; add new assets only under `static/images/`.

## Testing Guidelines
- No unit tests ship; rely on the quality workflow and manual checks in light/dark themes and responsive widths.
- Confirm Lighthouse budgets (page <200 KB, CSS <10 KB, JS <2 KB) after visual changes; document exceptions in PRs.
- Run spellcheck and link validation locally whenever introducing new copy or outbound links.

## Commit & Pull Request Guidelines
- Follow Conventional Commit prefixes seen in history (`feat`, `fix`, `refactor`, optional scope like `fix(hero)`); keep summaries concise.
- Provide body context for intent, link issues with `Closes #N`, and note any follow-up work.
- Pull requests should describe user-facing impact, link previews when relevant, and include before/after screenshots for visual updates.
- Wait for GitHub Actions to finish; call out expected warnings from non-blocking checks.

## Accessibility & Performance Targets
- Preserve skip links, focus outlines, and the theme toggle keyboard path; test with `Tab`, `Shift+Tab`, and `prefers-reduced-motion`.
- Re-optimize new images with `sips` or ImageOptim before committing so the main page weight stays within budget.
