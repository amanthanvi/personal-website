import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

import worker, { markdownAssetPath, markdownStatus, prefersMarkdown } from "./worker.ts";
import { isRedirect, markdownBody, pageMetadata } from "../scripts/generate-markdown.mjs";

const { parse } = createRequire(import.meta.resolve("node-html-markdown"))("node-html-parser");

async function withFetch(stub, action) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = stub;

  try {
    return await action();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function varyValues(response) {
  return response.headers
    .get("vary")
    ?.split(",")
    .map((value) => value.trim().toLowerCase());
}

test("HTML responses vary on Accept", async () => {
  const response = await withFetch(
    async () =>
      new Response("<!doctype html>", {
        headers: {
          "content-type": "text/html; charset=utf-8",
          vary: "Accept-Encoding",
        },
      }),
    () =>
      worker.fetch(
        new Request("https://amanthanvi.com/", {
          headers: { accept: "text/html" },
        }),
      ),
  );

  assert.deepEqual(varyValues(response), ["accept-encoding", "accept"]);
});

test("unknown Markdown pages use the generated 404 representation", async () => {
  const paths = [];
  const response = await withFetch(
    async (request) => {
      const path = new URL(request.url).pathname;
      paths.push(path);
      if (path === "/agent-markdown/404.md") return new Response("# Page not found");
      return new Response("missing", {
        status: 404,
        headers: { "content-type": path === "/missing" ? "text/html" : "text/plain" },
      });
    },
    () => worker.fetch(new Request("https://amanthanvi.com/missing", {
      headers: { accept: "text/markdown" },
    })),
  );

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.deepEqual(varyValues(response), ["accept"]);
  assert.equal(await response.text(), "# Page not found");
  assert.deepEqual(paths, ["/agent-markdown/missing/index.md", "/missing", "/agent-markdown/404.md"]);
});

test("non-HTML assets do not gain an unnecessary Accept variance", async () => {
  const response = await withFetch(
    async () =>
      new Response("image", {
        headers: {
          "content-type": "image/png",
          vary: "Accept-Encoding",
        },
      }),
    () =>
      worker.fetch(
        new Request("https://amanthanvi.com/avatar.png", {
          headers: { accept: "image/png" },
        }),
      ),
  );

  assert.deepEqual(varyValues(response), ["accept-encoding"]);
});

test("non-negotiated methods pass through unchanged", async () => {
  const response = await withFetch(
    async () =>
      new Response("<!doctype html>", {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
    () =>
      worker.fetch(
        new Request("https://amanthanvi.com/", {
          method: "POST",
          headers: { accept: "text/markdown" },
        }),
      ),
  );

  assert.equal(response.headers.get("vary"), null);
});

for (const [accept, expected] of [
  ["text/markdown", true],
  ["*/*", false],
  ["text/html;q=0", false],
  ["text/markdown;q=0.9, text/html", false],
  ["text/markdown, text/html", true],
  ["text/html, text/markdown", false],
  ["text/markdown;q=0", false],
  ["text/markdown, text/html;q=0", true],
  ["text/*", true],
  ["", false],
  [null, false],
]) {
  test(`prefersMarkdown(${JSON.stringify(accept)}) is ${expected}`, () => {
    assert.equal(prefersMarkdown(accept), expected);
  });
}

for (const [path, asset, status] of [
  ["/", "/agent-markdown/index.md", 200],
  ["/x/", "/agent-markdown/x/index.md", 200],
  ["/x", "/agent-markdown/x/index.md", 200],
  ["/x.html", "/agent-markdown/x.md", 200],
  ["/404", "/agent-markdown/404.md", 404],
  ["/404/", "/agent-markdown/404.md", 404],
  ["/404.html", "/agent-markdown/404.md", 404],
]) {
  test(`Markdown path and status for ${path}`, () => {
    assert.equal(markdownAssetPath(path), asset);
    assert.equal(markdownStatus(path, 200), status);
    // error representations never revalidate: a missing page stays 404
    assert.equal(markdownStatus(path, 304), status === 404 ? 404 : 304);
  });
}

for (const path of ["/missing", "/404"]) {
  test(`conditional Markdown request for ${path} stays 404 and drops validators upstream`, async () => {
    const seen = [];
    const response = await withFetch(
      async (request) => {
        const { pathname } = new URL(request.url);
        seen.push([pathname, request.headers.get("if-none-match"), request.headers.get("if-modified-since")]);
        if (pathname === "/agent-markdown/404.md") {
          return new Response("# Not found", { headers: { "content-type": "text/markdown" } });
        }
        if (pathname.startsWith("/agent-markdown/")) return new Response("nope", { status: 404, headers: { "content-type": "text/html" } });
        return new Response("<main>404</main>", { status: 404, headers: { "content-type": "text/html" } });
      },
      () => worker.fetch(new Request(`https://amanthanvi.com${path}`, {
        headers: { accept: "text/markdown", "if-none-match": "*", "if-modified-since": "Mon, 26 Oct 2026 00:00:00 GMT" },
      })),
    );
    assert.equal(response.status, 404);
    assert.equal(await response.text(), "# Not found");
    for (const [pathname, etag, since] of seen) {
      if (pathname === "/agent-markdown/404.md") {
        assert.equal(etag, null);
        assert.equal(since, null);
      }
    }
  });
}

for (const method of ["GET", "HEAD"]) {
  test(`Markdown ${method} serves the representation and discovery headers`, async () => {
    const response = await withFetch(
      async (request) => {
        assert.equal(new URL(request.url).pathname, "/agent-markdown/x/index.md");
        assert.equal(request.method, method);
        return new Response("# Example", {
          headers: { etag: 'W/"markdown"', vary: "Accept-Encoding" },
        });
      },
      () => worker.fetch(new Request("https://amanthanvi.com/x?source=agent", {
        method, headers: { accept: "text/markdown" },
      })),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
    assert.equal(response.headers.get("link"), '<https://amanthanvi.com/x/>; rel="canonical"');
    assert.equal(response.headers.get("x-robots-tag"), "noindex");
    assert.equal(response.headers.get("etag"), 'W/"markdown"');
    assert.deepEqual(varyValues(response), ["accept-encoding", "accept"]);
    assert.equal(await response.text(), method === "HEAD" ? "" : "# Example");
  });
}

for (const method of ["GET", "HEAD"]) {
  test(`Markdown ${method} revalidation preserves a bodyless 304 and validators`, async () => {
    let calls = 0;
    const validators = {
      etag: 'W/"markdown"',
      "last-modified": "Mon, 26 Oct 2026 12:00:00 GMT",
      "cache-control": "public, max-age=0, must-revalidate",
    };
    const response = await withFetch(
      async (request) => {
        calls++;
        assert.equal(new URL(request.url).pathname, "/agent-markdown/index.md");
        assert.equal(request.headers.get("if-none-match"), validators.etag);
        return new Response(null, { status: 304, headers: validators });
      },
      () => worker.fetch(new Request("https://amanthanvi.com/", {
        method, headers: { accept: "text/markdown", "if-none-match": validators.etag },
      })),
    );
    assert.equal(calls, 1);
    assert.equal(response.status, 304);
    assert.equal(response.body, null);
    for (const [name, value] of Object.entries(validators)) {
      assert.equal(response.headers.get(name), value);
    }
    assert.deepEqual(varyValues(response), ["accept"]);
    assert.equal(response.headers.get("x-robots-tag"), "noindex");
    assert.equal(response.headers.get("link"), '<https://amanthanvi.com/>; rel="canonical"');
  });
}

for (const status of [301, 302, 307, 308]) {
  test(`Markdown fallback preserves origin ${status} redirect`, async () => {
    let calls = 0;
    const response = await withFetch(
      async () => ++calls === 1
        ? new Response("missing", { status: 404 })
        : new Response(null, { status, headers: { location: "/" } }),
      () => worker.fetch(new Request("https://amanthanvi.com/old-page", {
        headers: { accept: "text/markdown" },
      })),
    );
    assert.equal(response.status, status);
    assert.equal(response.headers.get("location"), "/");
    assert.equal(calls, 2);
    assert.equal(response.headers.get("x-robots-tag"), null);
  });
}

for (const status of [200, 404]) {
  test(`non-HTML asset ${status} passes through with Markdown Accept`, async () => {
    let calls = 0;
    const response = await withFetch(
      async () => {
        calls++;
        return new Response("image", { status, headers: { "content-type": "image/png" } });
      },
      () => worker.fetch(new Request("https://amanthanvi.com/avatar.png", {
        headers: { accept: "text/markdown" },
      })),
    );
    assert.equal(response.status, status);
    assert.equal(await response.text(), "image");
    assert.equal(response.headers.get("vary"), null);
    assert.equal(calls, 1);
  });
}

test("fingerprinted Astro assets receive immutable caching", async () => {
  const response = await withFetch(
    async () => new Response("css", { headers: { "content-type": "text/css", "cache-control": "max-age=14400" } }),
    () => worker.fetch(new Request("https://amanthanvi.com/_astro/index.hash.css")),
  );
  assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
  assert.equal(response.headers.get("vary"), null);
});

test("missing Astro assets are not cached immutably", async () => {
  const response = await withFetch(
    async () => new Response("missing", { status: 404 }),
    () => worker.fetch(new Request("https://amanthanvi.com/_astro/missing.css")),
  );
  assert.equal(response.headers.get("cache-control"), null);
});

for (const [path, method, accept, status, type] of [
  ["/", "GET", "text/markdown", 200, "text/plain"],
  ["/", "GET", "text/markdown", 304, "text/plain"],
  ["/", "GET", "text/html", 200, "text/html"],
  ["/", "POST", "text/markdown", 200, "text/html"],
  ["/missing.png", "GET", "image/png", 404, "text/plain"],
  ["/old", "GET", "text/html", 301, "text/plain"],
]) {
  test(`security headers cover ${method} ${path} ${status} ${accept}`, async () => {
    const response = await withFetch(
      async () => new Response(null, { status, headers: { "content-type": type } }),
      () => worker.fetch(new Request(`https://amanthanvi.com${path}`, { method, headers: { accept } })),
    );
    for (const [name, value] of Object.entries({
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "x-frame-options": "DENY",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "strict-transport-security": "max-age=31536000",
    })) assert.equal(response.headers.get(name), value);
    assert.equal(response.headers.get("content-security-policy"), null);
  });
}

test("successful HTML pages advertise Markdown without an extra upstream request", async () => {
  let calls = 0;
  const response = await withFetch(
    async () => {
      calls++;
      return new Response("<main>Hello</main>", { headers: { "content-type": "text/html" } });
    },
    () => worker.fetch(new Request("https://amanthanvi.com/", { headers: { accept: "text/html" } })),
  );
  assert.equal(calls, 1);
  assert.equal(response.headers.get("link"), '<https://amanthanvi.com/>; rel="alternate"; type="text/markdown"');
  assert.deepEqual(varyValues(response), ["accept"]);
});

test("redirect stubs and assets do not advertise Markdown", async () => {
  const redirect = await withFetch(
    async () => new Response(null, { status: 301, headers: { location: "https://amanthanvi.com/blog/", "content-type": "text/html" } }),
    () => worker.fetch(new Request("https://amanthanvi.com/blog", { headers: { accept: "text/html" } })),
  );
  assert.equal(redirect.headers.get("link"), null);
  const asset = await withFetch(
    async () => new Response("x", { headers: { "content-type": "text/css" } }),
    () => worker.fetch(new Request("https://amanthanvi.com/_astro/a.css", { headers: { accept: "text/css" } })),
  );
  assert.equal(asset.headers.get("link"), null);
});

test("direct Markdown assets are noindex and do not negotiate recursively", async () => {
  let calls = 0;
  const response = await withFetch(
    async (request) => {
      calls++;
      assert.equal(new URL(request.url).pathname, "/agent-markdown/index.md");
      return new Response("# Homepage", { headers: { "content-type": "text/markdown" } });
    },
    () => worker.fetch(new Request("https://amanthanvi.com/agent-markdown/index.md", {
      headers: { accept: "text/markdown" },
    })),
  );
  assert.equal(calls, 1);
  assert.equal(response.headers.get("x-robots-tag"), "noindex");
  assert.equal(response.headers.get("link"), '<https://amanthanvi.com/>; rel="canonical"');
});

test("Markdown conversion separates layout siblings and strips generic hidden UI", () => {
  const markdown = markdownBody(`<main>
    <div><a href="mailto:hello@example.com">Email</a><a href="/github">GitHub<span class="hint sr-only">new tab</span></a></div>
    <h3><a href="/project">SynAc<span aria-hidden="true"><b>hidden icon</b></span></a></h3>
    <div><span>IEEE CAI 2025</span><span>Jun 2024 — May 2025</span></div>
    <a href="/post"><h3>Hello World</h3><time>Jan 1, 2025</time><p>Welcome to the blog.</p></a>
    <div class="sr-only"><p>hidden block</p></div>
    <custom-element aria-hidden="true">hidden custom element</custom-element>
  </main>`, "https://example.com/");
  assert.match(markdown, /\[Email\]\(mailto:hello@example.com\)\s+\[GitHub\]/);
  assert.match(markdown, /IEEE CAI 2025\s+Jun 2024 — May 2025/);
  assert.match(markdown, /Hello World\s+Jan 1, 2025\s+Welcome to the blog/);
  assert.match(markdown, /https:\/\/example.com\/project/);
  assert.doesNotMatch(markdown, /hidden|new tab/);
});

test("Markdown conversion preserves code whitespace and rejects missing main", () => {
  const markdown = markdownBody('<main><pre><code>a<span>b</span><span>c</span></code></pre></main>', "https://example.com/");
  assert.match(markdown, /abc/);
  assert.throws(() => markdownBody('<html></html>', "https://example.com/"), /<main>/);
});

test("Astro asset revalidation keeps immutable caching without Accept variance", async () => {
  const response = await withFetch(
    async () => new Response(null, { status: 304, headers: { etag: '"asset"' } }),
    () => worker.fetch(new Request("https://amanthanvi.com/_astro/index.hash.css")),
  );
  assert.equal(response.status, 304);
  assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
  assert.equal(response.headers.get("vary"), null);
});

for (const method of ["GET", "HEAD"]) {
  test(`explicit 404 Markdown ${method} keeps the error status`, async () => {
    const response = await withFetch(
      async (request) => {
        assert.equal(new URL(request.url).pathname, "/agent-markdown/404.md");
        return new Response("# Not found");
      },
      () => worker.fetch(new Request("https://amanthanvi.com/404", {
        method, headers: { accept: "text/markdown" },
      })),
    );
    assert.equal(response.status, 404);
    assert.equal(await response.text(), method === "HEAD" ? "" : "# Not found");
    assert.equal(response.headers.get("link"), '<https://amanthanvi.com/404.html>; rel="canonical"');
  });
}

test("generator recognizes refresh stubs independently of missing main", () => {
  const redirect = parse('<html><head><meta content="0;url=/" http-equiv="Refresh"></head></html>');
  assert.equal(isRedirect(redirect), true);
  assert.equal(isRedirect(parse('<html><head></head></html>')), false);
});

test("generator metadata uses the page canonical and decodes existing copy", () => {
  const metadata = pageMetadata(parse(`<head>
    <title>Research &amp; writing</title>
    <link href="https://example.org/post/" rel="canonical">
    <meta name="description" content="Projects &amp; research">
  </head>`));
  assert.equal(metadata.url, "https://example.org/post/");
  assert.equal(metadata.title, "Research & writing");
  assert.equal(metadata.description, "Projects & research");
});

test("noindex generator metadata can use the homepage-derived fallback URL", () => {
  const page = parse('<head><title>Not found</title><meta name="robots" content="noindex"></head>');
  assert.equal(pageMetadata(page, "https://example.org/404.html").url, "https://example.org/404.html");
  assert.throws(() => pageMetadata(page), /canonical URL/);
});

test("the HTML 404 page advertises its generated Markdown representation", async () => {
  const response = await withFetch(
    async (request) => new URL(request.url).pathname === "/agent-markdown/404.md"
      ? new Response(null)
      : new Response("<main>Not found</main>", { status: 404, headers: { "content-type": "text/html" } }),
    () => worker.fetch(new Request("https://amanthanvi.com/404.html", { headers: { accept: "text/html" } })),
  );
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("link"), '<https://amanthanvi.com/404.html>; rel="alternate"; type="text/markdown"');
});

// astro.config.mjs derives redirects for unpublished posts from frontmatter only.
const { isDraft } = await import("../astro.config.mjs");
for (const [name, source, expected] of [
  ["published post quoting draft: true in its body", "---\ntitle: a\ndraft: false\n---\n\n```yaml\ndraft: true\n```\n", false],
  ["draft with an inline comment", "---\ntitle: a\ndraft: true # not ready\n---\nbody\n", true],
  ["plain draft", "---\ndraft: true\n---\n", true],
  ["draft: true only outside frontmatter", "---\ntitle: a\n---\ndraft: true\n", false],
]) {
  test(`isDraft: ${name}`, () => {
    assert.equal(isDraft(source), expected);
  });
}
