import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the mobile mole game", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>地鼠快打｜60 秒限時挑戰<\/title>/i);
  assert.match(html, /地鼠/);
  assert.match(html, /60 秒限時挑戰/);
  assert.match(html, /九個地鼠洞/);
  assert.match(html, /拖曳鎚子，輕點敲擊/);
  assert.match(html, /desktop-hammer/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
