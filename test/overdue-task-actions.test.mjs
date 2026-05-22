import test from "node:test";
import assert from "node:assert/strict";

import { getOverdueTaskNudge } from "../overdue-task-actions.mjs";

const now = new Date("2026-05-22T12:00:00");

test("shows nudge actions for an open overdue task", () => {
  const nudge = getOverdueTaskNudge({ dueAt: "2026-05-20", completed: false, status: "active" }, { now });

  assert.equal(nudge.visible, true);
  assert.equal(nudge.title, "Overdue nudge");
  assert.equal(nudge.summary, "Was due May 20");
  assert.deepEqual(
    nudge.actions.map(({ key, label, dueAt, toast }) => ({ key, label, dueAt, toast })),
    [
      { key: "tomorrow", label: "Snooze to tomorrow", dueAt: "2026-05-23", toast: "Due tomorrow" },
      { key: "clear", label: "No date", dueAt: "", toast: "Due date cleared" }
    ]
  );
});

test("hides nudge actions for today, future, completed, and archived tasks", () => {
  const quietTasks = [
    { dueAt: "2026-05-22", completed: false, status: "active" },
    { dueAt: "2026-05-23", completed: false, status: "active" },
    { dueAt: "2026-05-20", completed: true, status: "active" },
    { dueAt: "2026-05-20", completed: false, status: "archive" },
    { dueAt: "", completed: false, status: "active" }
  ];

  for (const task of quietTasks) {
    assert.equal(getOverdueTaskNudge(task, { now }).visible, false);
  }
});
