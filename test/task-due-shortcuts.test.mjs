import test from "node:test";
import assert from "node:assert/strict";
import { getTaskDueShortcutDate, getVisibleTaskDueShortcuts } from "../task-due-shortcuts.mjs";

const baseDate = new Date("2026-05-17T12:00:00");

test("task due shortcuts produce stable date input values", () => {
  assert.equal(getTaskDueShortcutDate("today", baseDate), "2026-05-17");
  assert.equal(getTaskDueShortcutDate("tomorrow", baseDate), "2026-05-18");
  assert.equal(getTaskDueShortcutDate("weekend", baseDate), "2026-05-17");
  assert.equal(getTaskDueShortcutDate("next-week", baseDate), "2026-05-24");
  assert.equal(getTaskDueShortcutDate("clear", baseDate), "");
  assert.equal(getTaskDueShortcutDate("later", baseDate), null);
});

test("visible due shortcuts skip the task's current due state", () => {
  assert.deepEqual(
    getVisibleTaskDueShortcuts({ dueAt: "2026-05-17" }, baseDate).map((shortcut) => shortcut.key),
    ["tomorrow", "next-week", "clear"]
  );
  assert.deepEqual(
    getVisibleTaskDueShortcuts({ dueAt: "" }, baseDate).map((shortcut) => shortcut.key),
    ["today", "tomorrow", "weekend", "next-week"]
  );
});


test("weekend due shortcut stays on the current weekend", () => {
  assert.equal(getTaskDueShortcutDate("weekend", new Date("2026-05-18T09:00:00")), "2026-05-23");
  assert.equal(getTaskDueShortcutDate("weekend", new Date("2026-05-23T09:00:00")), "2026-05-23");
  assert.equal(getTaskDueShortcutDate("weekend", new Date("2026-05-24T09:00:00")), "2026-05-24");
});
