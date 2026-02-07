const BOOT_LINES = [
  { text: '[INIT] Loading kernel modules...', delay: 0 },
  { text: '[OK]   Network interface configured', delay: 150 },
  { text: '[OK]   Encryption protocols active', delay: 300 },
  { text: '[SCAN] Running vulnerability assessment...', delay: 500 },
  { text: '[OK]   Perimeter secure', delay: 700 },
  { text: '[READY] Welcome, operator.', delay: 900 },
];

const LAST_LINE_DELAY = BOOT_LINES[BOOT_LINES.length - 1].delay;

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

  // Phase 1: Type out terminal lines
  BOOT_LINES.forEach(({ text, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'boot-line';
      line.textContent = text;

      if (text.startsWith('[OK]')) {
        line.style.color = 'oklch(0.72 0.19 142)';
      } else if (text.startsWith('[SCAN]')) {
        line.style.color = 'oklch(0.75 0.15 75)';
      } else if (text.startsWith('[READY]')) {
        line.style.color = 'oklch(0.78 0.15 194)';
      }

      terminal.appendChild(line);
    }, delay);
  });

  // Phase 2: Boot-in transition — content scales up slightly and fades,
  // overlay slides up to reveal the page underneath
  const transitionStart = LAST_LINE_DELAY + 600;

  setTimeout(() => {
    // Hide cursor
    if (cursor) cursor.style.opacity = '0';

    // Scale up + fade the terminal content
    terminal.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    terminal.style.opacity = '0';
    terminal.style.transform = 'scale(1.02)';

    // Slide overlay up after a brief beat
    setTimeout(() => {
      overlay.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out';
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
