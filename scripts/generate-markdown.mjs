import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { NodeHtmlMarkdown } from 'node-html-markdown';

// Reuse the converter's parser without adding another dependency.
const { parse } = createRequire(import.meta.resolve('node-html-markdown'))('node-html-parser');
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(projectRoot, 'dist');
const markdownRoot = join(distRoot, 'agent-markdown');

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return findHtmlFiles(path);
      return extname(entry.name) === '.html' ? [path] : [];
    }),
  );
  return files.flat().sort();
}

export function pageMetadata(page, fallbackUrl) {
  const canonical = page.querySelectorAll('link').find((link) =>
    link.getAttribute('rel')?.toLowerCase().split(/\s+/).includes('canonical'),
  )?.getAttribute('href') ?? fallbackUrl;
  if (!canonical) throw new Error('Built page does not contain a canonical URL.');
  return {
    description: page.querySelector('meta[name="description"]')?.getAttribute('content'),
    title: page.querySelector('title')?.textContent,
    image: page.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    url: new URL(canonical).href,
  };
}

function frontmatter(metadata) {
  const lines = Object.entries(metadata).flatMap(([name, value]) =>
    value ? [`${name}: ${JSON.stringify(value)}`] : [],
  );
  return `---\n${lines.join('\n')}\n---\n\n`;
}

function jsonLd(page) {
  return page.querySelectorAll('script[type="application/ld+json"]').flatMap((script) => {
    try {
      return [`\n\n\`\`\`json\n${JSON.stringify(JSON.parse(script.textContent))}\n\`\`\``];
    } catch {
      return [];
    }
  }).join('');
}

export function isRedirect(page) {
  return redirectTarget(page) !== undefined;
}

/** The `url=` of an Astro meta-refresh redirect stub, or undefined for a real page. */
export function redirectTarget(page) {
  const refresh = page.querySelectorAll('meta').find((meta) =>
    meta.getAttribute('http-equiv')?.toLowerCase() === 'refresh',
  );
  if (!refresh) return undefined;
  return refresh.getAttribute('content')?.match(/url=(.+)$/i)?.[1].trim() ?? '/';
}

export function markdownBody(html, canonical) {
  const page = parse(html);
  const main = page.querySelector('main');
  if (!main) throw new Error('Built page does not contain a <main> element.');

  for (const hidden of main.querySelectorAll('.sr-only, [aria-hidden="true"]')) {
    hidden.remove();
  }
  // Flex/grid layouts can separate element siblings without any HTML whitespace.
  for (const element of main.querySelectorAll('h3, time, span, p, a, div')) {
    if (element.nextSibling?.nodeType === 1 && !element.closest('pre, code')) {
      element.insertAdjacentHTML('afterend', ' ');
    }
  }
  for (const element of main.querySelectorAll('[href], [src]')) {
    for (const attribute of ['href', 'src']) {
      const value = element.getAttribute(attribute);
      if (value?.startsWith('/') && !value.startsWith('//')) {
        element.setAttribute(attribute, new URL(value, canonical).href);
      }
    }
  }

  return NodeHtmlMarkdown.translate(main.innerHTML, {
    bulletMarker: '-',
    codeBlockStyle: 'fenced',
    keepDataImages: false,
  });
}

async function generateMarkdown() {
  const pages = [];
  const htmlFiles = await findHtmlFiles(distRoot);
  const homepageDocument = parse(await readFile(join(distRoot, 'index.html'), 'utf8'));
  const homepageMetadata = pageMetadata(homepageDocument);
  for (const htmlPath of htmlFiles) {
    const html = await readFile(htmlPath, 'utf8');
    const page = parse(html);
    const sourcePath = relative(distRoot, htmlPath);
    const target = redirectTarget(page);
    if (target !== undefined) {
      // The Worker advertises a Markdown alternate for every HTML page, redirect stubs
      // included, so give each stub a one-line Markdown twin instead of a dead link.
      const destination = join(markdownRoot, sourcePath.slice(0, -5) + '.md');
      const href = new URL(target, homepageMetadata.url).href;
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, `${frontmatter({ url: href })}This page moved to <${href}>.\n`, 'utf8');
      continue;
    }
    // Noindex pages such as 404 intentionally omit a canonical link.
    const fallbackUrl = new URL(sourcePath.replace(/index\.html$/, ''), homepageMetadata.url).href;
    const metadata = pageMetadata(page, fallbackUrl);
    const body = markdownBody(html, metadata.url);
    if (!body.trim()) {
      throw new Error(`Generated empty Markdown for ${relative(distRoot, htmlPath)}.`);
    }
    const markdownPath = sourcePath.slice(0, -5) + '.md';
    const destination = join(markdownRoot, markdownPath);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, `${frontmatter(metadata)}${body}${jsonLd(page)}\n`, 'utf8');
    const noindex = page.querySelector('meta[name="robots"]')?.getAttribute('content')?.toLowerCase().split(/[\s,]+/).includes('noindex');
    pages.push({ ...metadata, noindex, markdownPath: `/agent-markdown/${markdownPath}` });
  }

  const homepage = pages.find((page) => new URL(page.url).pathname === '/');
  if (!homepage) throw new Error('Built site does not contain a canonical homepage.');
  const siteName = homepageDocument.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ?? homepage.title;
  const links = pages.filter((page) => !page.noindex).map((page) =>
    `- [${page.title}](<${page.url}>): [Markdown](<${new URL(page.markdownPath, homepage.url).href}>)`,
  );
  await writeFile(join(distRoot, 'llms.txt'),
    `# ${siteName}\n\n> ${homepage.description ?? ''}\n\n## Pages\n\n${links.join('\n')}\n`, 'utf8');
  console.log(`Generated ${pages.length} Markdown page(s) in dist/agent-markdown and dist/llms.txt.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateMarkdown();
}
