import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

const blogDir = new URL('./src/content/blog/', import.meta.url);

/** Reads `draft` from the frontmatter block only, never from the post body. */
export function isDraft(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  return /^draft:\s*true\s*(#.*)?$/m.test(frontmatter);
}

function draftPostRedirects() {
  return Object.fromEntries(
    readdirSync(blogDir)
      .filter((file) => /\.mdx?$/.test(file))
      .filter((file) => isDraft(readFileSync(new URL(file, blogDir), 'utf8')))
      .map((file) => [`/blog/${file.replace(/\.mdx?$/, '')}`, '/']),
  );
}

export default defineConfig({
  site: 'https://amanthanvi.com',
  output: 'static',
  // There is no blog index, and a draft post's URL may already have been shared:
  // send both home instead of a 404. Redirects are derived from `draft: true`, so
  // publishing a post removes its redirect (a leftover one would shadow the post).
  redirects: {
    '/blog': '/',
    ...draftPostRedirects(),
  },
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
