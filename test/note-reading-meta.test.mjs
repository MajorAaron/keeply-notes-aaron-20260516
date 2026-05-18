import test from "node:test";
import assert from "node:assert/strict";

import { getNoteReadingMeta } from "../note-reading-meta.mjs";

test("describes empty notes quietly", () => {
  assert.deepEqual(getNoteReadingMeta(""), {
    label: "Quick note",
    ariaLabel: "Quick note with no body text",
    wordCount: 0,
    minutes: 0
  });
});

test("counts words and rounds short notes to one minute", () => {
  const meta = getNoteReadingMeta("Bring the metric snapshot, open risks, and two decisions.");

  assert.equal(meta.wordCount, 9);
  assert.equal(meta.minutes, 1);
  assert.equal(meta.label, "9 words · 1 min");
  assert.equal(meta.ariaLabel, "9 words, about 1 minute to read");
});

test("normalizes whitespace and rounds longer notes up", () => {
  const body = Array.from({ length: 241 }, (_, index) => `word${index}`).join("\n\t ");

  assert.deepEqual(getNoteReadingMeta(body), {
    label: "241 words · 2 min",
    ariaLabel: "241 words, about 2 minutes to read",
    wordCount: 241,
    minutes: 2
  });
});

test("handles singular word and minute labels", () => {
  assert.deepEqual(getNoteReadingMeta("Focus"), {
    label: "1 word · 1 min",
    ariaLabel: "1 word, about 1 minute to read",
    wordCount: 1,
    minutes: 1
  });
});
