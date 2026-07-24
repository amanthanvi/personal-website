import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const site = 'https://amanthanvi.com';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);

  const paths = [
    '/',
    ...posts.map((p) => `/blog/${p.id.replace(/\.(mdx?|md)$/, '')}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${site}${path}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
