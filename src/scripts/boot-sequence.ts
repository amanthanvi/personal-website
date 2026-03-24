interface BootLine {
  text: string;
  delay: number;
}

const BOOT_LINES: BootLine[] = [
  { text: '[INIT] Loading kernel modules...', delay: 0 },
  { text: '[OK]   Network interface configured', delay: 150 },
  { text: '[OK]   Encryption protocols active', delay: 300 },
  { text: '[SCAN] Running vulnerability assessment...', delay: 500 },
  { text: '[OK]   Perimeter secure', delay: 700 },
  { text: '[READY] Welcome, operator.', delay: 900 },
];

function getLineColor(text: string): string | null {
  // Use CSS custom properties so colors follow the active theme
  const style = getComputedStyle(document.documentElement);
  const accentProjects = style.getPropertyValue('--color-accent-projects').trim();
  const accentExperience = style.getPropertyValue('--color-accent-experience').trim();
  const accentHero = style.getPropertyValue('--color-accent-hero').trim();

  if (text.includes('] ') && text.endsWith('OK')) return accentProjects || 'oklch(0.72 0.19 142)';
  if (text.includes('SCAN')) return accentExperience || 'oklch(0.75 0.15 75)';
  if (text.includes('READY')) {
    return accentHero || 'oklch(0.78 0.15 194)';
  }
  return null;
}

function shouldSkipBoot(): boolean {
  try {
    if (sessionStorage.getItem('booted') === 'true') return true;
  } catch {
    // sessionStorage unavailable
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

  return false;
}

export function initBootSequence(): void {
  const overlay = document.getElementById('boot-overlay');
  if (!overlay) return;

  if (shouldSkipBoot()) {
    overlay.remove();
    return;
  }

  const terminal = overlay.querySelector<HTMLElement>('#boot-terminal');
  const cursor = overlay.querySelector<HTMLElement>('.boot-cursor');
  if (!terminal) return;

  // Show overlay
  overlay.style.display = 'flex';

  const bootLines = BOOT_LINES;
  const lastLineDelay = bootLines[bootLines.length - 1].delay;

  // Phase 1: Type out terminal lines
  bootLines.forEach(({ text, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'boot-line';
      line.textContent = text;

      const color = getLineColor(text);
      if (color) line.style.color = color;

      terminal.appendChild(line);
    }, delay);
  });

  // Phase 2: Boot-in transition
  const transitionStart = lastLineDelay + 600;

  setTimeout(() => {
    if (cursor) cursor.style.opacity = '0';

    terminal.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    terminal.style.opacity = '0';
    terminal.style.transform = 'scale(1.02)';

    setTimeout(() => {
      overlay.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      overlay.style.transform = 'translateY(-100%)';
      overlay.style.opacity = '0';

      overlay.addEventListener('transitionend', () => {
        overlay.remove();
        try {
          sessionStorage.setItem('booted', 'true');
        } catch {
          // sessionStorage unavailable
        }
      }, { once: true });
    }, 300);
  }, transitionStart);
}
