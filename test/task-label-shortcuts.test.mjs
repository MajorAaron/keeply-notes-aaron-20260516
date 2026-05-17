import test from "node:test";
import assert from "node:assert/strict";
import { getTaskLabelShortcutValue, getVisibleTaskLabelShortcuts } from "../task-label-shortcuts.mjs";

test("task label shortcuts accept known labels only", () => {
  assert.equal(getTaskLabelShortcutValue("work"), "work");
  assert.equal(getTaskLabelShortcutValue("home"), "home");
  assert.equal(getTaskLabelShortcutValue("ideas"), "ideas");
  assert.equal(getTaskLabelShortcutValue("personal"), "personal");
  assert.equal(getTaskLabelShortcutValue("errand"), null);
});

test("visible task label shortcuts hide the task's current label", () => {
  assert.deepEqual(
    getVisibleTaskLabelShortcuts({ label: "work" }).map((shortcut) => shortcut.key),
    ["home", "ideas", "personal"]
  );
});

test("visible task label shortcuts default unknown tasks to ideas", () => {
  assert.deepEqual(
    getVisibleTaskLabelShortcuts({ label: "" }).map((shortcut) => shortcut.key),
    ["work", "home", "personal"]
  );
});
