import test from "node:test";
import assert from "node:assert/strict";
import { getNoteColorShortcutValue, getVisibleNoteColorShortcuts } from "../note-color-shortcuts.mjs";

test("visible note color shortcuts hide the current note color", () => {
  assert.deepEqual(
    getVisibleNoteColorShortcuts({ color: "mint" }).map((shortcut) => shortcut.key),
    ["sun", "sky", "rose", "ink"]
  );
});

test("visible note color shortcuts default unknown notes to sun", () => {
  assert.deepEqual(
    getVisibleNoteColorShortcuts({}).map((shortcut) => shortcut.key),
    ["mint", "sky", "rose", "ink"]
  );
});

test("note color shortcut values reject unknown keys", () => {
  assert.equal(getNoteColorShortcutValue("rose"), "rose");
  assert.equal(getNoteColorShortcutValue("purple"), null);
  assert.equal(getNoteColorShortcutValue(""), null);
});
