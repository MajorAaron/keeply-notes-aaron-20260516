import test from "node:test";
import assert from "node:assert/strict";

import { compareTasksForDisplay, getTaskPriorityRank } from "../task-sort.mjs";

function task(overrides = {}) {
  return {
    completed: false,
    priority: "normal",
    dueAt: "",
    createdAt: "2026-05-17T10:00:00.000Z",
    ...overrides
  };
}

test("priority rank puts high priority first and unknown values with normal", () => {
  assert.equal(getTaskPriorityRank("high"), 0);
  assert.equal(getTaskPriorityRank("normal"), 1);
  assert.equal(getTaskPriorityRank("low"), 2);
  assert.equal(getTaskPriorityRank("later"), 1);
  assert.equal(getTaskPriorityRank(), 1);
});

test("open tasks stay ahead of completed tasks", () => {
  const items = [task({ title: "done", completed: true, priority: "high" }), task({ title: "open", completed: false, priority: "low" })];

  items.sort(compareTasksForDisplay);

  assert.deepEqual(
    items.map((item) => item.title),
    ["open", "done"]
  );
});

test("dated tasks stay before undated tasks and sort by due date", () => {
  const items = [
    task({ title: "no date", dueAt: "" }),
    task({ title: "tomorrow", dueAt: "2026-05-19" }),
    task({ title: "today", dueAt: "2026-05-18" })
  ];

  items.sort(compareTasksForDisplay);

  assert.deepEqual(
    items.map((item) => item.title),
    ["today", "tomorrow", "no date"]
  );
});

test("same-date tasks sort by priority before newest-created tiebreaker", () => {
  const items = [
    task({ title: "normal newest", dueAt: "2026-05-18", priority: "normal", createdAt: "2026-05-18T12:00:00.000Z" }),
    task({ title: "low", dueAt: "2026-05-18", priority: "low", createdAt: "2026-05-18T14:00:00.000Z" }),
    task({ title: "high older", dueAt: "2026-05-18", priority: "high", createdAt: "2026-05-18T08:00:00.000Z" }),
    task({ title: "high newest", dueAt: "2026-05-18", priority: "high", createdAt: "2026-05-18T13:00:00.000Z" })
  ];

  items.sort(compareTasksForDisplay);

  assert.deepEqual(
    items.map((item) => item.title),
    ["high newest", "high older", "normal newest", "low"]
  );
});
