import assert from "node:assert/strict";
import { removeCopiedItem } from "../duplicate-undo.mjs";

const items = [
  { id: "a", title: "First" },
  { id: "b", title: "Copy" },
  { id: "c", title: "Last" }
];

const result = removeCopiedItem(items, "b");
assert.deepEqual(result.items, [items[0], items[2]]);
assert.deepEqual(result.removed, items[1]);
assert.deepEqual(items.map((item) => item.id), ["a", "b", "c"]);

const missing = removeCopiedItem(items, "missing");
assert.equal(missing.items, items);
assert.equal(missing.removed, null);

const invalid = removeCopiedItem(null, "b");
assert.deepEqual(invalid.items, []);
assert.equal(invalid.removed, null);

console.log("duplicate undo tests passed");
