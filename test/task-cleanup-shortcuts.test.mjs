import test from "node:test";
import assert from "node:assert/strict";
import { getTaskCleanupShortcut } from "../task-cleanup-shortcuts.mjs";

test("builds a completed-task cleanup shortcut", () => {
  assert.deepEqual(getTaskCleanupShortcut("done", 3), {
    kind: "done",
    count: 3,
    label: "3 done",
    ariaLabel: "Show completed tasks: 3",
    disabled: false,
    taskWindow: "all",
    taskCompletion: "done",
    taskPriority: "all",
    toast: "Show completed tasks"
  });
});

test("builds an overdue cleanup shortcut that targets open overdue tasks", () => {
  const shortcut = getTaskCleanupShortcut("overdue", 2);

  assert.equal(shortcut.label, "2 overdue");
  assert.equal(shortcut.ariaLabel, "Show overdue tasks: 2");
  assert.equal(shortcut.disabled, false);
  assert.equal(shortcut.taskWindow, "overdue");
  assert.equal(shortcut.taskCompletion, "open");
  assert.equal(shortcut.taskPriority, "all");
});

test("disables cleanup shortcuts when the count is empty", () => {
  assert.deepEqual(getTaskCleanupShortcut("done", 0), {
    kind: "done",
    count: 0,
    label: "0 done",
    ariaLabel: "No done tasks",
    disabled: true,
    taskWindow: "all",
    taskCompletion: "done",
    taskPriority: "all",
    toast: "Show completed tasks"
  });

  assert.equal(getTaskCleanupShortcut("overdue", -4).label, "0 overdue");
  assert.equal(getTaskCleanupShortcut("overdue", "nope").disabled, true);
});

test("returns null for unknown shortcut kinds", () => {
  assert.equal(getTaskCleanupShortcut("later", 4), null);
});
