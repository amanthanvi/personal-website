import { SECTIONS } from "./sections";

let cleanup: (() => void) | null = null;

export function initSectionNav(): void {
  cleanup?.();
  cleanup = null;

  const links = document.querySelectorAll<HTMLElement>(
    "[data-section-nav] [data-section]",
  );
  if (links.length === 0) return;

  const sectionEls = SECTIONS.map((s) => document.getElementById(s.id)).filter(
    Boolean,
  ) as HTMLElement[];

  if (sectionEls.length === 0) return;

  let activeId = "";
  let frame = 0;

  function setActive(id: string): void {
    if (activeId === id) return;
    activeId = id;
    links.forEach((link) => {
      link.setAttribute(
        "aria-current",
        link.dataset.section === id ? "true" : "false",
      );
    });
  }

  function readActiveSection(): string {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4
    ) {
      return sectionEls[sectionEls.length - 1]?.id ?? SECTIONS[0].id;
    }

    const marker = window.scrollY + window.innerHeight * 0.35;
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

  links.forEach((link) => {
    if (link.dataset.navBound === "true") return;
    link.dataset.navBound = "true";

    link.addEventListener("click", (event) => {
      const id = link.dataset.section || "";
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      setActive(id);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", `#${id}`);
    });
  });

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  updateActiveSection();

  cleanup = () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
  };
}
