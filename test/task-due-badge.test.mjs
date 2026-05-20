import test from "node:test";
import assert from "node:assert/strict";

import { getTaskDueBadge } from "../task-due-badge.mjs";

const now = new Date("2026-05-17T15:00:00-06:00");

test("labels overdue tasks with the missed date", () => {
  assert.deepEqual(getTaskDueBadge({ dueAt: "2026-05-16", completed: false }, { now }), {
    label: "Overdue · Sat, May 16",
    tone: "overdue",
    dateTime: "2026-05-16",
    ariaLabel: "Due Saturday, May 16, overdue"
  });
});

test("labels today's task as due today", () => {
  assert.deepEqual(getTaskDueBadge({ dueAt: "2026-05-17", completed: false }, { now }), {
    label: "Today",
    tone: "today",
    dateTime: "2026-05-17",
    ariaLabel: "Due today"
  });
});

test("labels tomorrow's task as due tomorrow", () => {
  assert.deepEqual(getTaskDueBadge({ dueAt: "2026-05-18", completed: false }, { now }), {
    label: "Tomorrow",
    tone: "tomorrow",
    dateTime: "2026-05-18",
    ariaLabel: "Due tomorrow"
  });
});

test("adds weekday context to future due dates", () => {
  assert.deepEqual(getTaskDueBadge({ dueAt: "2026-05-21", completed: false }, { now }), {
    label: "Thu, May 21",
    tone: "upcoming",
    dateTime: "2026-05-21",
    ariaLabel: "Due Thursday, May 21"
  });
});

test("marks unscheduled tasks without a dateTime", () => {
  assert.deepEqual(getTaskDueBadge({ dueAt: "", completed: false }, { now }), {
    label: "No date",
    tone: "unscheduled",
    dateTime: "",
    ariaLabel: "No due date"
  });
});

test("keeps completed tasks visually quiet", () => {
  assert.deepEqual(getTaskDueBadge({ dueAt: "2026-05-16", completed: true }, { now }), {
    label: "Done · Sat, May 16",
    tone: "done",
    dateTime: "2026-05-16",
    ariaLabel: "Completed task, due Saturday, May 16"
  });
});
