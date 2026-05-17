import test from "node:test";
import assert from "node:assert/strict";
import { getTaskDueShortcutDate, getVisibleTaskDueShortcuts } from "../task-due-shortcuts.mjs";

const baseDate = new Date("2026-05-17T12:00:00");

test("task due shortcuts produce stable date input values", () => {
  assert.equal(getTaskDueShortcutDate("today", baseDate), "2026-05-17");
  assert.equal(getTaskDueShortcutDate("tomorrow", baseDate), "2026-05-18");
  assert.equal(getTaskDueShortcutDate("clear", baseDate), "");
  assert.equal(getTaskDueShortcutDate("next-week", baseDate), null);
});

test("visible due shortcuts skip the task's current due state", () => {
  assert.deepEqual(
    getVisibleTaskDueShortcuts({ dueAt: "2026-05-17" }, baseDate).map((shortcut) => shortcut.key),
    ["tomorrow", "clear"]
  );
  assert.deepEqual(
    getVisibleTaskDueShortcuts({ dueAt: "" }, baseDate).map((shortcut) => shortcut.key),
    ["today", "tomorrow"]
  );
});
