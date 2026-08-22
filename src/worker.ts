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

function markdownHeaders(markdownResponse: Response): Headers {
  const headers = new Headers(markdownResponse.headers);
  headers.set("content-type", "text/markdown; charset=utf-8");
  appendVary(headers, "Accept");
  return headers;
}

export function markdownAssetPath(pathname: string): string {
  if (pathname === "/" || pathname === "/index.html") {
    return "/agent-markdown/index.md";
  }

  if (pathname.endsWith("/")) {
    return `/agent-markdown${pathname}index.md`;
  }

  if (pathname.endsWith(".html")) {
    return `/agent-markdown${pathname.slice(0, -5)}.md`;
  }

  return `/agent-markdown${pathname}.md`;
}

export function markdownStatus(pathname: string, assetStatus: number): number {
  return pathname === "/404" || pathname === "/404.html" ? 404 : assetStatus;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (
      (request.method !== "GET" && request.method !== "HEAD") ||
      !prefersMarkdown(request.headers.get("accept"))
    ) {
      return fetch(request);
    }

    const url = new URL(request.url);
    const requestedPath = url.pathname;
    url.pathname = markdownAssetPath(url.pathname);
    const markdownRequest = new Request(url, {
      headers: request.headers,
      method: request.method,
    });
    const markdownResponse = await fetch(markdownRequest);

    if (markdownResponse.ok) {
      return new Response(
        request.method === "HEAD" ? null : markdownResponse.body,
        {
          status: markdownStatus(requestedPath, markdownResponse.status),
          statusText:
            requestedPath === "/404" || requestedPath === "/404.html"
              ? "Not Found"
              : markdownResponse.statusText,
          headers: markdownHeaders(markdownResponse),
        },
      );
    }

    // Preserve normal origin redirects, 404s, and non-HTML assets when no
    // generated Markdown representation exists for the requested path.
    return fetch(request);
  },
};
