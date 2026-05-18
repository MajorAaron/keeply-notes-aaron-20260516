import test from "node:test";
import assert from "node:assert/strict";
import { getNoteColorFilterCounts, matchesNoteColorFilter, normalizeNoteColorFilter } from "../note-color-filters.mjs";

test("note color filter normalization keeps known filters", () => {
  assert.equal(normalizeNoteColorFilter("all"), "all");
  assert.equal(normalizeNoteColorFilter("sun"), "sun");
  assert.equal(normalizeNoteColorFilter("mint"), "mint");
  assert.equal(normalizeNoteColorFilter("sky"), "sky");
  assert.equal(normalizeNoteColorFilter("rose"), "rose");
  assert.equal(normalizeNoteColorFilter("ink"), "ink");
  assert.equal(normalizeNoteColorFilter("purple"), "all");
});

test("note color filters match notes by normalized color", () => {
  assert.equal(matchesNoteColorFilter({ color: "mint" }, "mint"), true);
  assert.equal(matchesNoteColorFilter({ color: "sky" }, "mint"), false);
  assert.equal(matchesNoteColorFilter({ color: "rose" }, "all"), true);
  assert.equal(matchesNoteColorFilter({ color: "purple" }, "sun"), true);
});

test("note color filter counts include missing colors as sun", () => {
  assert.deepEqual(
    getNoteColorFilterCounts([
      { color: "sun" },
      { color: "mint" },
      { color: "sky" },
      { color: "rose" },
      { color: "ink" },
      {},
      { color: "mint" }
    ]),
    {
      all: 7,
      sun: 2,
      mint: 2,
      sky: 1,
      rose: 1,
      ink: 1
    }
  );
});
