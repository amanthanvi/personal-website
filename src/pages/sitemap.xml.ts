import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://amanthanvi.com';

function toSlug(id: string): string {
  return id.replace(/\.(mdx?|md)$/, '');
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);

  const entries: { loc: string; lastmod?: string }[] = [
    { loc: `${SITE}/` },
    ...posts.map((post) => ({
      loc: `${SITE}/blog/${toSlug(post.id)}/`,
      lastmod: (post.data.updatedDate ?? post.data.pubDate)
        .toISOString()
        .slice(0, 10),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ loc, lastmod }) =>
      `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
