import test from "node:test";
import assert from "node:assert/strict";
import { snoozeOverdueTasks } from "../snooze-overdue-tasks.mjs";

test("snoozes active overdue tasks to tomorrow", () => {
  const result = snoozeOverdueTasks(
    [
      { id: "old", title: "Old", status: "active", completed: false, dueAt: "2026-05-16", updatedAt: "old" },
      { id: "today", title: "Today", status: "active", completed: false, dueAt: "2026-05-17", updatedAt: "old" }
    ],
    { now: new Date("2026-05-17T10:00:00.000Z"), updatedAt: "2026-05-17T10:00:00.000Z" }
  );

  assert.equal(result.tomorrow, "2026-05-18");
  assert.deepEqual(result.snoozed.map((task) => task.id), ["old"]);
  assert.deepEqual(
    result.tasks.map((task) => [task.id, task.dueAt, task.updatedAt]),
    [
      ["old", "2026-05-18", "2026-05-17T10:00:00.000Z"],
      ["today", "2026-05-17", "old"]
    ]
  );
});

test("does not snooze completed archived or unscheduled tasks", () => {
  const tasks = [
    { id: "done", status: "active", completed: true, dueAt: "2026-05-16" },
    { id: "archived", status: "archive", completed: false, dueAt: "2026-05-16" },
    { id: "unscheduled", status: "active", completed: false, dueAt: "" }
  ];
  const result = snoozeOverdueTasks(tasks, { now: new Date("2026-05-17T10:00:00.000Z") });

  assert.equal(result.snoozed.length, 0);
  assert.equal(result.tasks[0], tasks[0]);
  assert.equal(result.tasks[1], tasks[1]);
  assert.equal(result.tasks[2], tasks[2]);
});
