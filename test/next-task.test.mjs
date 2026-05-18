import test from "node:test";
import assert from "node:assert/strict";

import { getNextTaskHighlight } from "../next-task.mjs";

const now = new Date("2026-05-18T10:00:00-06:00");

const task = (overrides = {}) => ({
  id: crypto.randomUUID(),
  title: "Default task",
  status: "active",
  completed: false,
  priority: "normal",
  dueAt: "2026-05-18",
  createdAt: "2026-05-17T10:00:00.000Z",
  updatedAt: "2026-05-17T10:00:00.000Z",
  ...overrides
});

test("highlights overdue work before today and upcoming tasks", () => {
  const summary = getNextTaskHighlight(
    [
      task({ title: "Today high", priority: "high", dueAt: "2026-05-18" }),
      task({ title: "Old normal", priority: "normal", dueAt: "2026-05-16" }),
      task({ title: "Future high", priority: "high", dueAt: "2026-05-20" })
    ],
    { now }
  );

  assert.equal(summary.available, true);
  assert.equal(summary.title, "Old normal");
  assert.equal(summary.kicker, "Overdue · Normal");
  assert.equal(summary.window, "overdue");
  assert.equal(summary.buttonLabel, "Show overdue");
  assert.equal(summary.canComplete, true);
  assert.equal(summary.completeLabel, "Mark done");
  assert.equal(summary.completeAriaLabel, "Mark next task done: Old normal");
  assert.match(summary.summary, /Due May 16/);
});

test("uses priority inside the same due window", () => {
  const summary = getNextTaskHighlight(
    [
      task({ title: "Today low", priority: "low", dueAt: "2026-05-18" }),
      task({ title: "Today high", priority: "high", dueAt: "2026-05-18" })
    ],
    { now }
  );

  assert.equal(summary.title, "Today high");
  assert.equal(summary.kicker, "Today · High");
  assert.equal(summary.summary, "Due today — a good next move.");
});

test("falls back to latest updated unscheduled task when no dated work exists", () => {
  const summary = getNextTaskHighlight(
    [
      task({ title: "Older floating task", dueAt: "", updatedAt: "2026-05-15T10:00:00.000Z" }),
      task({ title: "Newest floating task", dueAt: "", updatedAt: "2026-05-17T10:00:00.000Z" })
    ],
    { now }
  );

  assert.equal(summary.title, "Newest floating task");
  assert.equal(summary.kicker, "No date · Normal");
  assert.equal(summary.window, "unscheduled");
  assert.equal(summary.summary, "No due date yet — ready when you are.");
});

test("ignores completed and inactive tasks", () => {
  const summary = getNextTaskHighlight(
    [
      task({ title: "Done", completed: true, dueAt: "2026-05-16" }),
      task({ title: "Archived", status: "archive", dueAt: "2026-05-16" })
    ],
    { now }
  );

  assert.equal(summary.available, false);
  assert.equal(summary.title, "No open tasks");
  assert.equal(summary.window, "all");
  assert.equal(summary.canComplete, false);
  assert.equal(summary.completeAriaLabel, "No next task to complete");
});
