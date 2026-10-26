const STORAGE_KEY = "theme";
type Theme = "auto" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

export function getStoredTheme(): Theme {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === "light" || val === "dark") return val;
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
}

/** Only an explicit choice is stored; a visitor who never clicks stays on `auto`. */
function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
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

/** Flip explicit light ↔ dark (resolves auto first). */
export function toggleTheme(): ResolvedTheme {
  const next: ResolvedTheme = resolveTheme() === "dark" ? "light" : "dark";
  persistTheme(next);
  withTransition(() => applyTheme(next));
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
