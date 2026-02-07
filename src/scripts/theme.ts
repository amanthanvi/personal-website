const STORAGE_KEY = 'theme';
const STATES = ['auto', 'dark', 'light'] as const;
type Theme = (typeof STATES)[number];

function getStoredTheme(): Theme {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val && STATES.includes(val as Theme)) return val as Theme;
  } catch {
    // localStorage unavailable
  }
  return 'auto';
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
}

export function initThemeToggle(): void {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const updateButton = (theme: Theme) => {
    const label = theme.charAt(0).toUpperCase() + theme.slice(1);
    btn.setAttribute('aria-label', `Theme: ${label}. Click to change.`);
    btn.setAttribute('data-theme-value', theme);
  };

  // Apply stored theme
  const current = getStoredTheme();
  applyTheme(current);
  updateButton(current);

  // Cycle on click
  btn.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') as Theme || 'auto';
    const next = STATES[(STATES.indexOf(now) + 1) % STATES.length];
    applyTheme(next);
    updateButton(next);
  });

  // Sync when system preference changes (for auto mode)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'auto') {
      applyTheme('auto');
      updateButton('auto');
    }
  });
}
