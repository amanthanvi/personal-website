const STORAGE_KEY = "theme";
const STATES = ["light", "dark"] as const;
type Theme = (typeof STATES)[number];

export { STATES, type Theme };

export function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function getStoredTheme(): Theme | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === "light" || val === "dark") return val;
  } catch {
    // localStorage unavailable
  }
  return null;
}

export function getActiveTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return getStoredTheme() ?? systemTheme();
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
  window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }));
}

export function setTheme(theme: Theme): void {
  applyTheme(theme);
}

export function toggleTheme(): Theme {
  const next: Theme = getActiveTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

/**
 * Follow the OS preference live until the visitor makes an explicit choice.
 * The pre-paint script in the head has already set the initial attribute.
 */
export function initTheme(): void {
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (getStoredTheme() !== null) return;
      const theme: Theme = e.matches ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;
      window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }));
    });
}
