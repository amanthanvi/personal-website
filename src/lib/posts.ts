import type { CollectionEntry } from "astro:content";

/**
 * The glob loader's `id` may or may not carry the file extension depending on
 * loader version, so strip it defensively — the result is the route slug either way.
 */
export function postSlug(post: CollectionEntry<"blog">): string {
  return post.id.replace(/\.mdx?$/, "");
}

export function postPath(post: CollectionEntry<"blog">): string {
  return `/blog/${postSlug(post)}/`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
