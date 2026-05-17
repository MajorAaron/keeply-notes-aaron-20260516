import test from "node:test";
import assert from "node:assert/strict";
import { captureItemRestore, restoreItem } from "../undo-restore.mjs";

test("captureItemRestore stores the matching item and original index", () => {
  const items = [
    { id: "a", title: "A" },
    { id: "b", title: "B", status: "active" },
    { id: "c", title: "C" }
  ];

  assert.deepEqual(captureItemRestore(items, "b"), {
    index: 1,
    item: { id: "b", title: "B", status: "active" }
  });
});

test("restoreItem replaces an edited item with its snapshot", () => {
  const items = [
    { id: "a", title: "A" },
    { id: "b", title: "Changed", status: "trash" }
  ];
  const snapshot = { index: 1, item: { id: "b", title: "B", status: "active" } };

  assert.deepEqual(restoreItem(items, snapshot), [
    { id: "a", title: "A" },
    { id: "b", title: "B", status: "active" }
  ]);
});

test("restoreItem reinserts a deleted item near its original position", () => {
  const items = [
    { id: "a", title: "A" },
    { id: "c", title: "C" }
  ];
  const snapshot = { index: 1, item: { id: "b", title: "B" } };

  assert.deepEqual(restoreItem(items, snapshot), [
    { id: "a", title: "A" },
    { id: "b", title: "B" },
    { id: "c", title: "C" }
  ]);
});

test("restoreItem ignores missing snapshots", () => {
  const items = [{ id: "a", title: "A" }];
  assert.equal(restoreItem(items, null), items);
});
