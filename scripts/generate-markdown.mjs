import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(projectRoot, 'dist');
const markdownRoot = join(distRoot, 'agent-markdown');
const siteOrigin = 'https://amanthanvi.com';

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return findHtmlFiles(path);
      }

      return extname(entry.name) === '.html' ? [path] : [];
    }),
  );

  return files.flat();
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/g)].map(
      ([, name, , value]) => [name.toLowerCase(), value],
    ),
  );
}

function metaContent(html, key, value) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const parsed = attributes(tag);
    if (parsed[key] === value && parsed.content) {
      return parsed.content;
    }
  }

  return undefined;
}

function frontmatter(html) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  const description = metaContent(html, 'name', 'description');
  const image = metaContent(html, 'property', 'og:image');
  const fields = { description, title, image };
  const lines = Object.entries(fields).flatMap(([name, value]) =>
    value ? [`${name}: ${JSON.stringify(value)}`] : [],
  );

  return lines.length > 0 ? `---\n${lines.join('\n')}\n---\n\n` : '';
}

function jsonLd(html) {
  const blocks = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  return blocks.flatMap(([, contents]) => {
    try {
      return [`\n\n\`\`\`json\n${JSON.stringify(JSON.parse(contents))}\n\`\`\``];
    } catch {
      return [];
    }
  }).join('');
}

function markdownBody(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) {
    throw new Error('Built page does not contain a <main> element.');
  }

  const absoluteLinks = main.replace(
    /\b(href|src)=(["'])\/(?!\/)(.*?)\2/gi,
    (_match, attribute, quote, path) =>
      `${attribute}=${quote}${siteOrigin}/${path}${quote}`,
  );

  return NodeHtmlMarkdown.translate(absoluteLinks, {
    bulletMarker: '-',
    codeBlockStyle: 'fenced',
    keepDataImages: false,
  });
}

function outputPath(htmlPath) {
  const sourcePath = relative(distRoot, htmlPath);
  const markdownPath = sourcePath.slice(0, -5) + '.md';
  return join(markdownRoot, markdownPath);
}

const htmlFiles = await findHtmlFiles(distRoot);

for (const htmlPath of htmlFiles) {
  const html = await readFile(htmlPath, 'utf8');
  const destination = outputPath(htmlPath);
  const body = markdownBody(html);
  if (!body.trim()) {
    throw new Error(`Generated empty Markdown for ${relative(distRoot, htmlPath)}.`);
  }

  const markdown = `${frontmatter(html)}${body}${jsonLd(html)}\n`;
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, markdown, 'utf8');
}

console.log(`Generated ${htmlFiles.length} Markdown page(s) in dist/agent-markdown.`);
