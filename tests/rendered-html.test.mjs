import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the BrightNest clinic page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>BrightNest Pediatric Clinic/i);
  assert.match(html, /Gentle care for every/);
  assert.match(html, /Book consultation/i);
  assert.match(html, /About/i);
  assert.match(html, /Choose a time that works for your family/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("finished site replaces all starter preview artifacts", async () => {
  const [page, layout, packageJson, bookingRoute] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/api/book/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<ClinicPage \/>/);
  assert.match(layout, /BrightNest Pediatric Clinic/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(bookingRoute, /bookingSchema\.safeParse/);
  assert.match(bookingRoute, /RESEND|resend/i);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});

test("appointment contact fields stay editable before a time is selected", async () => {
  const bookingEngine = await readFile(
    new URL("../components/BookingEngine.tsx", import.meta.url),
    "utf8",
  );

  assert.match(bookingEngine, /<fieldset className="form-step details-step">/);
  assert.doesNotMatch(
    bookingEngine,
    /<fieldset[^>]+disabled=\{!selectedTime\}/,
  );
});
