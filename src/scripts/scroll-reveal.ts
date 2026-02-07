export function initScrollReveal(): void {
  // Bail on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show all elements immediately
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 },
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });
}
