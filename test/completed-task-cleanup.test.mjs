import test from "node:test";
import assert from "node:assert/strict";
import { archiveCompletedTasks } from "../completed-task-cleanup.mjs";

test("archives only completed active tasks", () => {
  const result = archiveCompletedTasks(
    [
      { id: "open", title: "Open", status: "active", completed: false, updatedAt: "old" },
      { id: "done", title: "Done", status: "active", completed: true, updatedAt: "old" },
      { id: "archived", title: "Archived", status: "archive", completed: true, updatedAt: "old" }
    ],
    { now: "2026-05-17T08:00:00.000Z" }
  );

  assert.equal(result.archived.length, 1);
  assert.equal(result.archived[0].id, "done");
  assert.deepEqual(
    result.tasks.map((task) => [task.id, task.status, task.updatedAt]),
    [
      ["open", "active", "old"],
      ["done", "archive", "2026-05-17T08:00:00.000Z"],
      ["archived", "archive", "old"]
    ]
  );
});

test("returns no archived tasks when there is nothing completed", () => {
  const tasks = [{ id: "open", title: "Open", status: "active", completed: false }];
  const result = archiveCompletedTasks(tasks, { now: "2026-05-17T08:00:00.000Z" });

  assert.equal(result.archived.length, 0);
  assert.equal(result.tasks[0], tasks[0]);
});
