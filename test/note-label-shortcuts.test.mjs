import test from "node:test";
import assert from "node:assert/strict";
import { getNoteLabelShortcutValue, getVisibleNoteLabelShortcuts } from "../note-label-shortcuts.mjs";

test("note label shortcuts accept known labels only", () => {
  assert.equal(getNoteLabelShortcutValue("work"), "work");
  assert.equal(getNoteLabelShortcutValue("home"), "home");
  assert.equal(getNoteLabelShortcutValue("ideas"), "ideas");
  assert.equal(getNoteLabelShortcutValue("personal"), "personal");
  assert.equal(getNoteLabelShortcutValue("errand"), null);
});

test("visible note label shortcuts hide the note's current label", () => {
  assert.deepEqual(
    getVisibleNoteLabelShortcuts({ label: "home" }).map((shortcut) => shortcut.key),
    ["work", "ideas", "personal"]
  );
});

test("visible note label shortcuts default unknown notes to ideas", () => {
  assert.deepEqual(
    getVisibleNoteLabelShortcuts({ label: "" }).map((shortcut) => shortcut.key),
    ["work", "home", "personal"]
  );
});
