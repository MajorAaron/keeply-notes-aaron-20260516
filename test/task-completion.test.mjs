import test from "node:test";
import assert from "node:assert/strict";
import { toggleTaskCompletion } from "../task-completion.mjs";

test("toggles an open task to complete", () => {
  const result = toggleTaskCompletion(
    [
      { id: "a", title: "Alpha", completed: false, updatedAt: "old" },
      { id: "b", title: "Beta", completed: false, updatedAt: "old" }
    ],
    "a",
    { now: "2026-05-17T10:00:00.000Z" }
  );

  assert.equal(result.completed, true);
  assert.equal(result.task.id, "a");
  assert.deepEqual(
    result.tasks.map((task) => [task.id, task.completed, task.updatedAt]),
    [
      ["a", true, "2026-05-17T10:00:00.000Z"],
      ["b", false, "old"]
    ]
  );
});

test("toggles a completed task back open", () => {
  const result = toggleTaskCompletion(
    [{ id: "a", title: "Alpha", completed: true, updatedAt: "old" }],
    "a",
    { now: "2026-05-17T10:00:00.000Z" }
  );

  assert.equal(result.completed, false);
  assert.equal(result.tasks[0].completed, false);
  assert.equal(result.tasks[0].updatedAt, "2026-05-17T10:00:00.000Z");
});

test("leaves tasks unchanged when the task id is missing", () => {
  const tasks = [{ id: "a", title: "Alpha", completed: false, updatedAt: "old" }];
  const result = toggleTaskCompletion(tasks, "missing", { now: "2026-05-17T10:00:00.000Z" });

  assert.equal(result.task, null);
  assert.equal(result.completed, false);
  assert.equal(result.tasks[0], tasks[0]);
});
