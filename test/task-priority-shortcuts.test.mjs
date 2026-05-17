import test from "node:test";
import assert from "node:assert/strict";
import { getTaskPriorityShortcutValue, getVisibleTaskPriorityShortcuts } from "../task-priority-shortcuts.mjs";

test("task priority shortcuts accept known priorities only", () => {
  assert.equal(getTaskPriorityShortcutValue("high"), "high");
  assert.equal(getTaskPriorityShortcutValue("normal"), "normal");
  assert.equal(getTaskPriorityShortcutValue("low"), "low");
  assert.equal(getTaskPriorityShortcutValue("urgent"), null);
});

test("visible priority shortcuts hide the task's current priority", () => {
  assert.deepEqual(
    getVisibleTaskPriorityShortcuts({ priority: "high" }).map((shortcut) => shortcut.key),
    ["normal", "low"]
  );
  assert.deepEqual(
    getVisibleTaskPriorityShortcuts({ priority: "" }).map((shortcut) => shortcut.key),
    ["high", "low"]
  );
});
