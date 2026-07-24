const STORAGE_KEY = "theme";
const STATES = ["auto", "light", "dark"] as const;
type Theme = (typeof STATES)[number];
type ResolvedTheme = "light" | "dark";

export { STATES, type Theme, type ResolvedTheme };

export function getStoredTheme(): Theme {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val && STATES.includes(val as Theme)) return val as Theme;
    if (val === "dune") return "light";
    if (val === "arcade") return "dark";
  } catch {
    // localStorage unavailable
  }
  return "auto";
}

export function resolveTheme(theme: Theme = getStoredTheme()): ResolvedTheme {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-resolved", resolved);
  document.documentElement.style.colorScheme = resolved;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
  window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }));
}

function withTransition(run: () => void): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => void;
  };

  if (!reduced && typeof doc.startViewTransition === "function") {
    doc.startViewTransition(run);
    return;
  }
  run();
}

export function setTheme(theme: Theme): void {
  withTransition(() => applyTheme(theme));
}

/** Flip explicit light ↔ dark (resolves auto first). */
export function toggleTheme(): ResolvedTheme {
  const next: ResolvedTheme = resolveTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

export function initThemeToggle(): void {
  applyTheme(getStoredTheme());

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getStoredTheme() === "auto") {
        applyTheme("auto");
      }
    });
}
