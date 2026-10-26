interface MediaRange {
  type: string;
  subtype: string;
  quality: number;
  index: number;
}

interface Match {
  quality: number;
  index: number;
  specificity: number;
}

function parseAccept(header: string): MediaRange[] {
  return header.split(",").flatMap((entry, index) => {
    const [mediaType, ...parameters] = entry.trim().toLowerCase().split(";");
    const [type, subtype] = mediaType.trim().split("/");

    if (!type || !subtype) {
      return [];
    }

    const qualityParameter = parameters.find((parameter) =>
      parameter.trim().startsWith("q="),
    );
    const parsedQuality = qualityParameter
      ? Number.parseFloat(qualityParameter.trim().slice(2))
      : 1;
    const quality = Number.isFinite(parsedQuality)
      ? Math.min(1, Math.max(0, parsedQuality))
      : 0;

    return [{ type, subtype, quality, index }];
  });
}

function bestMatch(
  ranges: MediaRange[],
  type: string,
  subtype: string,
): Match | undefined {
  const matches = ranges.flatMap((range) => {
    if (range.type !== "*" && range.type !== type) {
      return [];
    }

    if (range.subtype !== "*" && range.subtype !== subtype) {
      return [];
    }

    const specificity =
      range.type === "*" ? 0 : range.subtype === "*" ? 1 : 2;
    return [{ ...range, specificity }];
  });

  return matches.sort(
    (left, right) =>
      right.specificity - left.specificity || left.index - right.index,
  )[0];
}

export function prefersMarkdown(header: string | null): boolean {
  if (!header) {
    return false;
  }

  const ranges = parseAccept(header);
  const markdown = bestMatch(ranges, "text", "markdown");
  const html = bestMatch(ranges, "text", "html");

  if (!markdown || markdown.quality === 0) {
    return false;
  }

  if (!html || html.quality === 0) {
    return true;
  }

  if (markdown.quality !== html.quality) {
    return markdown.quality > html.quality;
  }

  if (markdown.index !== html.index) {
    return markdown.index < html.index;
  }

  // Cloudflare treats text/* as a Markdown preference, while */* keeps HTML.
  return markdown.specificity === 1;
}

function appendVary(headers: Headers, value: string): void {
  const existing = headers.get("vary");
  const values = existing
    ? existing.split(",").map((entry) => entry.trim().toLowerCase())
    : [];

  if (!values.includes(value.toLowerCase())) {
    headers.set("vary", existing ? `${existing}, ${value}` : value);
  }
}

function isHtml(response: Response): boolean {
  return response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() === "text/html";
}

function isPagePath(pathname: string): boolean {
  return !pathname.split("/").pop()?.includes(".") || pathname.endsWith(".html");
}

function canonicalUrl(request: Request, assetPath: string): string {
  const url = new URL(request.url);
  url.pathname = assetPath.slice("/agent-markdown".length)
    .replace(/\/index\.md$/, "/")
    .replace(/\.md$/, ".html");
  url.search = "";
  url.hash = "";
  return url.href;
}

function markdownResponse(request: Request, asset: Response, assetPath: string, status: number): Response {
  const headers = new Headers(asset.headers);
  headers.set("content-type", "text/markdown; charset=utf-8");
  headers.set("link", `<${canonicalUrl(request, assetPath)}>; rel="canonical"`);
  headers.set("x-robots-tag", "noindex");
  appendVary(headers, "Accept");
  return new Response(request.method === "HEAD" || status === 304 ? null : asset.body, {
    status,
    headers,
  });
}

const CONDITIONAL_HEADERS = ["if-none-match", "if-modified-since", "if-match", "if-unmodified-since", "if-range"];

/**
 * `conditional: false` is for error representations: 404.md existing does not make the
 * requested URL exist, so a missing page must never revalidate to 304.
 */
async function fetchMarkdown(
  request: Request,
  pathname: string,
  { conditional = true }: { conditional?: boolean } = {},
): Promise<Response> {
  const url = new URL(request.url);
  url.pathname = pathname;
  const headers = new Headers(request.headers);
  if (!conditional) {
    for (const name of CONDITIONAL_HEADERS) headers.delete(name);
  }
  return fetch(new Request(url, { headers, method: request.method }));
}

function isNotFoundPath(pathname: string): boolean {
  return pathname === "/404" || pathname === "/404/" || pathname === "/404.html";
}

export function markdownAssetPath(pathname: string): string {
  if (pathname === "/" || pathname === "/index.html") {
    return "/agent-markdown/index.md";
  }
  if (isNotFoundPath(pathname)) {
    return "/agent-markdown/404.md";
  }
  if (pathname.endsWith(".html")) {
    return `/agent-markdown${pathname.slice(0, -5)}.md`;
  }
  return `/agent-markdown${pathname.replace(/\/$/, "")}/index.md`;
}

export function markdownStatus(pathname: string, assetStatus: number): number {
  if (isNotFoundPath(pathname)) return 404;
  return assetStatus;
}

async function negotiate(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const negotiable = (request.method === "GET" || request.method === "HEAD") &&
    !url.pathname.startsWith("/agent-markdown/") && isPagePath(url.pathname);
  const wantsMarkdown = negotiable && prefersMarkdown(request.headers.get("accept"));
  const assetPath = markdownAssetPath(url.pathname);

  if (wantsMarkdown) {
    const asset = await fetchMarkdown(request, assetPath, { conditional: !isNotFoundPath(url.pathname) });
    if (asset.ok || asset.status === 304) {
      return markdownResponse(request, asset, assetPath, markdownStatus(url.pathname, asset.status));
    }
  }

  const response = await fetch(request);
  if (wantsMarkdown && response.status === 404 && isHtml(response)) {
    const notFoundPath = "/agent-markdown/404.md";
    const asset = await fetchMarkdown(request, notFoundPath, { conditional: false });
    if (asset.ok) {
      return markdownResponse(request, asset, notFoundPath, 404);
    }
  }

  const headers = new Headers(response.headers);
  if ((request.method === "GET" || request.method === "HEAD") && isHtml(response)) {
    appendVary(headers, "Accept");
    // Every built page has a Markdown twin and every 404 has 404.md, so advertise the
    // negotiated URL without probing upstream: a probe would cost every visitor a round trip.
    if (negotiable && !wantsMarkdown && (response.ok || response.status === 404 || response.status === 304)) {
      headers.append("link", `<${url.href}>; rel="alternate"; type="text/markdown"`);
    }
  }
  return new Response(request.method === "HEAD" ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const response = await negotiate(request);
    const headers = new Headers(response.headers);
    headers.set("x-content-type-options", "nosniff");
    headers.set("referrer-policy", "strict-origin-when-cross-origin");
    headers.set("x-frame-options", "DENY");
    headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
    headers.set("strict-transport-security", "max-age=31536000");
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith("/_astro/") && (response.ok || response.status === 304)) {
      headers.set("cache-control", "public, max-age=31536000, immutable");
    }
    if (pathname.startsWith("/agent-markdown/")) {
      headers.set("x-robots-tag", "noindex");
      if (pathname.endsWith(".md")) {
        headers.set("link", `<${canonicalUrl(request, pathname)}>; rel="canonical"`);
      }
    }
    return new Response(request.method === "HEAD" ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
