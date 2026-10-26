/** Contact paths shown in the hero and footer, and listed as `sameAs` in JSON-LD. */
export const CONTACT_EMAIL = "contact@amanthanvi.com";

export const contactLinks = [
  { label: "Email", href: `mailto:${CONTACT_EMAIL}` },
  { label: "GitHub", href: "https://github.com/amanthanvi" },
  { label: "LinkedIn", href: "https://linkedin.com/in/amanthanvi" },
] as const;

export const profileURLs = contactLinks
  .map(({ href }) => href)
  .filter((href) => href.startsWith("https://"));
