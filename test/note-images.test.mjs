import test from "node:test";
import assert from "node:assert/strict";
import { buildLocalNoteImage, dataUrlBytes } from "../note-images.mjs";

test("local note image fallback returns a safe data image", () => {
  const image = buildLocalNoteImage({
    title: "Garden plan",
    body: "Sketch raised beds and basil placement",
    label: "home"
  });

  assert.equal(image.mime, "image/svg+xml");
  assert.equal(image.generated, true);
  assert.equal(image.localFallback, true);
  assert.match(image.src, /^data:image\/svg\+xml;charset=utf-8,/);
  assert.equal(image.alt, "Sketch raised beds and basil placement");
  assert.ok(dataUrlBytes(image.src) > 100);
});

test("data url byte estimates support base64 and encoded payloads", () => {
  assert.equal(dataUrlBytes("data:text/plain;base64,SGVsbG8="), 6);
  assert.equal(dataUrlBytes("data:text/plain;charset=utf-8,Hello%20Keeply"), 12);
  assert.equal(dataUrlBytes(""), 0);
});
