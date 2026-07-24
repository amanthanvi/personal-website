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

    link.addEventListener("click", () => {
      const target = document.getElementById(link.dataset.section || "");
      if (target) setActive(target.id);
      target?.scrollIntoView({ behavior: "smooth" });
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
