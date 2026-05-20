import test from "node:test";
import assert from "node:assert/strict";
import { getNoteImageMeta } from "../note-image-meta.mjs";

test("note image meta stays hidden when there is no safe note image", () => {
  assert.equal(getNoteImageMeta(null).available, false);
  assert.equal(getNoteImageMeta({ src: "https://example.com/photo.png" }).available, false);
});

test("note image meta labels attached images", () => {
  const meta = getNoteImageMeta({ src: "data:image/png;base64,abc" });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Image");
  assert.equal(meta.tone, "attached");
  assert.equal(meta.ariaLabel, "Note includes an attached image");
});

test("note image meta distinguishes generated and local fallback images", () => {
  assert.deepEqual(getNoteImageMeta({ src: "data:image/png;base64,abc", generated: true }), {
    available: true,
    label: "AI image",
    ariaLabel: "Note includes a generated image",
    tone: "generated"
  });

  assert.deepEqual(getNoteImageMeta({ src: "data:image/svg+xml;charset=utf-8,%3Csvg%3E", generated: true, localFallback: true }), {
    available: true,
    label: "Local image",
    ariaLabel: "Note includes a locally generated fallback image",
    tone: "local"
  });
});
