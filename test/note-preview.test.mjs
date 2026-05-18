import test from "node:test";
import assert from "node:assert/strict";

import { buildNotePreview } from "../note-preview.mjs";

test("keeps short note bodies unchanged", () => {
  assert.deepEqual(buildNotePreview("Bring the metric snapshot."), {
    text: "Bring the metric snapshot.",
    isTruncated: false
  });
});

test("collapses long note bodies at a word boundary", () => {
  const body = "One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen.";

  assert.deepEqual(buildNotePreview(body, { maxLength: 42 }), {
    text: "One two three four five six seven eight…",
    isTruncated: true
  });
});

test("normalizes repeated whitespace before measuring", () => {
  const body = "Line one with context.\n\nLine two    keeps going with more detail than preview.";

  assert.deepEqual(buildNotePreview(body, { maxLength: 44 }), {
    text: "Line one with context. Line two keeps going…",
    isTruncated: true
  });
});

test("falls back to a friendly empty note preview", () => {
  assert.deepEqual(buildNotePreview("   "), {
    text: "No extra details",
    isTruncated: false
  });
});
