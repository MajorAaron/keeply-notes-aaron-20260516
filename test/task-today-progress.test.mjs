import test from "node:test";
import assert from "node:assert/strict";

import { getTodayTaskProgress } from "../task-today-progress.mjs";

const now = new Date("2026-05-18T10:00:00-06:00");

const task = (overrides) => ({
  status: "active",
  completed: false,
  priority: "normal",
  dueAt: "2026-05-18",
  ...overrides
});

test("summarizes today's done, open, and high-priority tasks", () => {
  const summary = getTodayTaskProgress(
    [
      task({ completed: true }),
      task({ priority: "high" }),
      task({ priority: "low" }),
      task({ dueAt: "2026-05-19" }),
      task({ status: "archive", completed: false })
    ],
    { now }
  );

  assert.equal(summary.total, 3);
  assert.equal(summary.completed, 1);
  assert.equal(summary.open, 2);
  assert.equal(summary.highOpen, 1);
  assert.equal(summary.dueTomorrow, 1);
  assert.equal(summary.percent, 33);
  assert.equal(summary.title, "33% of today done");
  assert.equal(summary.summary, "1 done · 2 open · 1 high priority · 1 tomorrow");
  assert.equal(summary.ariaLabel, "33 percent complete for today's tasks: 1 done, 2 open, 1 high priority open");
  assert.deepEqual(summary.action, {
    label: "Show today",
    ariaLabel: "Show 2 open tasks due today",
    window: "today",
    completion: "open",
    disabled: false
  });
});

test("celebrates a completed today list", () => {
  const summary = getTodayTaskProgress([task({ completed: true }), task({ completed: true, priority: "high" })], { now });

  assert.equal(summary.percent, 100);
  assert.equal(summary.title, "Today is complete");
  assert.equal(summary.summary, "2 done · 0 open");
  assert.deepEqual(summary.action, {
    label: "Review done",
    ariaLabel: "Review completed tasks due today",
    window: "today",
    completion: "done",
    disabled: false
  });
});

test("handles days with no tasks due today", () => {
  const summary = getTodayTaskProgress([task({ dueAt: "2026-05-19" }), task({ dueAt: "" })], { now });

  assert.equal(summary.total, 0);
  assert.equal(summary.percent, 0);
  assert.equal(summary.title, "No tasks due today");
  assert.equal(summary.summary, "1 due tomorrow, nothing due today.");
  assert.equal(summary.ariaLabel, "No tasks due today");
  assert.deepEqual(summary.action, {
    label: "Show tomorrow",
    ariaLabel: "Show 1 open task due tomorrow",
    window: "tomorrow",
    completion: "open",
    disabled: false
  });
});

test("offers an open-task planning action when today and tomorrow are clear", () => {
  const summary = getTodayTaskProgress([task({ dueAt: "" }), task({ status: "archive", dueAt: "2026-05-18" })], { now });

  assert.equal(summary.title, "No tasks due today");
  assert.equal(summary.summary, "Nothing due today or tomorrow.");
  assert.deepEqual(summary.action, {
    label: "Plan tasks",
    ariaLabel: "Show open tasks",
    window: "all",
    completion: "open",
    disabled: false
  });
});
