import test from "node:test";
import assert from "node:assert/strict";
import { mergeItemsForSync, newerItem } from "../netlify/functions/items.mjs";

test("sync merge removes locally deleted remote items", () => {
  const current = {
    notes: [
      { id: "deleted-note", title: "Old note", type: "note", updatedAt: "2026-05-01T00:00:00.000Z" },
      { id: "kept-note", title: "Remote note", type: "note", updatedAt: "2026-05-01T00:00:00.000Z" }
    ],
    tasks: [{ id: "deleted-task", title: "Old task", type: "task", updatedAt: "2026-05-01T00:00:00.000Z" }]
  };
  const incoming = {
    notes: [
      { id: "deleted-note", title: "Stale local copy", updatedAt: "2026-05-10T00:00:00.000Z" },
      { id: "local-note", title: "Local note", updatedAt: "2026-05-10T00:00:00.000Z" }
    ],
    tasks: [{ id: "deleted-task", title: "Stale local task", updatedAt: "2026-05-10T00:00:00.000Z" }],
    deletedIds: ["deleted-note", "deleted-task"]
  };

  const merged = mergeItemsForSync(current, incoming);

  assert.deepEqual(
    merged.notes.map((note) => note.id).sort(),
    ["kept-note", "local-note"]
  );
  assert.deepEqual(merged.tasks, []);
});

test("sync merge keeps the newest copy when two clients edit the same item", () => {
  assert.deepEqual(
    newerItem(
      { id: "shared", title: "Local", updatedAt: "2026-05-11T00:00:00.000Z" },
      { id: "shared", title: "Remote", updatedAt: "2026-05-10T00:00:00.000Z" }
    ).title,
    "Local"
  );

  assert.deepEqual(
    newerItem(
      { id: "shared", title: "Local", updatedAt: "2026-05-10T00:00:00.000Z" },
      { id: "shared", title: "Remote", updatedAt: "2026-05-11T00:00:00.000Z" }
    ).title,
    "Remote"
  );
});
