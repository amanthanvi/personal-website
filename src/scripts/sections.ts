export interface NavSection {
  id: string;
  label: string;
}

/** Single source for homepage section nav + scroll spy. */
export const SECTIONS: readonly NavSection[] = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "writing-research", label: "Research" },
  { id: "blog", label: "Writing" },
];
