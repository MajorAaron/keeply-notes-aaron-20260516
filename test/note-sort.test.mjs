import test from "node:test";
import assert from "node:assert/strict";

import { compareNotesForDisplay, getNoteTimestamp } from "../note-sort.mjs";

function note(overrides = {}) {
  return {
    title: "Note",
    pinned: false,
    createdAt: "2026-05-17T10:00:00.000Z",
    updatedAt: "2026-05-17T10:00:00.000Z",
    ...overrides
  };
}

test("pinned notes stay ahead of unpinned notes", () => {
  const items = [note({ title: "regular", pinned: false }), note({ title: "pinned", pinned: true, updatedAt: "2026-05-16T10:00:00.000Z" })];

  items.sort(compareNotesForDisplay);

  assert.deepEqual(
    items.map((item) => item.title),
    ["pinned", "regular"]
  );
});

test("notes sort newest updated first within a pinned group", () => {
  const items = [
    note({ title: "older edit", updatedAt: "2026-05-17T08:00:00.000Z" }),
    note({ title: "fresh edit", updatedAt: "2026-05-18T08:00:00.000Z", createdAt: "2026-05-16T08:00:00.000Z" }),
    note({ title: "middle edit", updatedAt: "2026-05-17T12:00:00.000Z" })
  ];

  items.sort(compareNotesForDisplay);

  assert.deepEqual(
    items.map((item) => item.title),
    ["fresh edit", "middle edit", "older edit"]
  );
});

test("created date and title provide deterministic fallback ordering", () => {
  const items = [
    note({ title: "Beta", updatedAt: "not-a-date", createdAt: "2026-05-17T10:00:00.000Z" }),
    note({ title: "Alpha", updatedAt: "", createdAt: "2026-05-17T10:00:00.000Z" }),
    note({ title: "Newest created", updatedAt: "", createdAt: "2026-05-18T10:00:00.000Z" })
  ];

  items.sort(compareNotesForDisplay);

  assert.deepEqual(
    items.map((item) => item.title),
    ["Newest created", "Alpha", "Beta"]
  );
});

test("getNoteTimestamp falls back from updatedAt to createdAt", () => {
  assert.equal(getNoteTimestamp({ updatedAt: "", createdAt: "2026-05-18T10:00:00.000Z" }), new Date("2026-05-18T10:00:00.000Z").getTime());
  assert.equal(getNoteTimestamp({ updatedAt: "bad", createdAt: "also-bad" }), 0);
});
