interface NavSection {
  id: string;
  label: string;
}

const SECTIONS: NavSection[] = [
  { id: 'hero', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'blog', label: 'Writing' },
];

let cleanup: (() => void) | null = null;

export function initHudNav(): void {
  cleanup?.();
  cleanup = null;

  const dots = document.querySelectorAll<HTMLElement>('[data-section-nav] [data-section]');
  if (dots.length === 0) return;

  const sectionEls = SECTIONS.map((s) => document.getElementById(s.id)).filter(
    Boolean,
  ) as HTMLElement[];

  if (sectionEls.length === 0) return;

  let activeId = '';
  let frame = 0;

  function setActive(id: string): void {
    if (activeId === id) return;

    const section = SECTIONS.find((s) => s.id === id);
    if (!section) return;

    activeId = id;
    dots.forEach((dot) => {
      dot.setAttribute('aria-current', dot.dataset.section === id ? 'true' : 'false');
    });
  }

  function readActiveSection(): string {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      return sectionEls[sectionEls.length - 1]?.id ?? SECTIONS[0].id;
    }

    const marker = window.scrollY + window.innerHeight * 0.42;
    let current = sectionEls[0]?.id ?? SECTIONS[0].id;

    sectionEls.forEach((section) => {
      if (section.offsetTop <= marker) {
        current = section.id;
      }
    });

    return current;
  }

  function updateActiveSection(): void {
    frame = 0;
    setActive(readActiveSection());
  }

  function scheduleUpdate(): void {
    if (frame) return;
    frame = window.requestAnimationFrame(updateActiveSection);
  }

  // Smooth scroll on click
  dots.forEach((dot) => {
    if (dot.dataset.navBound === 'true') return;
    dot.dataset.navBound = 'true';

    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section || '');
      if (target) {
        setActive(target.id);
      }
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  updateActiveSection();

  cleanup = () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    window.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', scheduleUpdate);
  };
}
