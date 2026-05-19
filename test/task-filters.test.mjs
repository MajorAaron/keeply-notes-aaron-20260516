import test from "node:test";
import assert from "node:assert/strict";
import { getTaskWindowCounts, matchesTaskWindow } from "../task-filters.mjs";

const baseDate = new Date("2026-05-17T12:00:00");

const tasks = [
  { id: "overdue", dueAt: "2026-05-16", completed: false },
  { id: "done-overdue", dueAt: "2026-05-16", completed: true },
  { id: "today", dueAt: "2026-05-17", completed: false },
  { id: "tomorrow", dueAt: "2026-05-18", completed: false },
  { id: "future", dueAt: "2026-05-20", completed: false },
  { id: "unscheduled", dueAt: "", completed: false }
];

test("matches task windows by due date and completion state", () => {
  assert.equal(matchesTaskWindow(tasks[0], "overdue", baseDate), true);
  assert.equal(matchesTaskWindow(tasks[1], "overdue", baseDate), false);
  assert.equal(matchesTaskWindow(tasks[2], "today", baseDate), true);
  assert.equal(matchesTaskWindow(tasks[3], "tomorrow", baseDate), true);
  assert.equal(matchesTaskWindow(tasks[3], "upcoming", baseDate), true);
  assert.equal(matchesTaskWindow(tasks[4], "upcoming", baseDate), true);
  assert.equal(matchesTaskWindow(tasks[5], "unscheduled", baseDate), true);
});

test("task window counts summarize visible task groups", () => {
  assert.deepEqual(getTaskWindowCounts(tasks, baseDate), {
    all: 6,
    overdue: 1,
    today: 1,
    tomorrow: 1,
    upcoming: 2,
    unscheduled: 1
  });
});
