import test from "node:test";
import assert from "node:assert/strict";
import { getNotePinFilterCounts, matchesNotePinFilter, normalizeNotePinFilter } from "../note-pin-filters.mjs";

test("note pin filter normalization keeps known filters", () => {
  assert.equal(normalizeNotePinFilter("all"), "all");
  assert.equal(normalizeNotePinFilter("pinned"), "pinned");
  assert.equal(normalizeNotePinFilter("unpinned"), "unpinned");
  assert.equal(normalizeNotePinFilter("saved"), "all");
});

test("note pin filters match pinned and unpinned notes", () => {
  assert.equal(matchesNotePinFilter({ pinned: true }, "pinned"), true);
  assert.equal(matchesNotePinFilter({ pinned: false }, "pinned"), false);
  assert.equal(matchesNotePinFilter({ pinned: false }, "unpinned"), true);
  assert.equal(matchesNotePinFilter({}, "unpinned"), true);
  assert.equal(matchesNotePinFilter({ pinned: true }, "all"), true);
});

test("note pin filter counts split pinned from other notes", () => {
  assert.deepEqual(getNotePinFilterCounts([{ pinned: true }, { pinned: false }, {}, { pinned: true }]), {
    all: 4,
    pinned: 2,
    unpinned: 2
  });
});
