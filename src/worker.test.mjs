import assert from "node:assert/strict";
import test from "node:test";

import worker from "./worker.ts";

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

test("Markdown fallbacks preserve status and vary on Accept", async () => {
  let callCount = 0;
  const response = await withFetch(
    async () => {
      callCount += 1;

      return callCount === 1
        ? new Response("missing", {
            status: 404,
            headers: { "content-type": "text/plain" },
          })
        : new Response("<!doctype html>", {
            status: 404,
            headers: { "content-type": "text/html; charset=utf-8" },
          });
    },
    () =>
      worker.fetch(
        new Request("https://amanthanvi.com/missing", {
          headers: { accept: "text/markdown" },
        }),
      ),
  );

  assert.equal(response.status, 404);
  assert.deepEqual(varyValues(response), ["accept"]);
  assert.equal(callCount, 2);
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
