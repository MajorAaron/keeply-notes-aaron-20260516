import test from "node:test";
import assert from "node:assert/strict";
import { buildBulkTasksFromText, getBulkTaskLines } from "../task-bulk-entry.mjs";

test("extracts task titles from pasted lines and strips bullets", () => {
  assert.deepEqual(getBulkTaskLines("- Call Sam\n• Send agenda\n[ ] Book room"), ["Call Sam", "Send agenda", "Book room"]);
});

test("ignores empty lines and requires at least two task lines", () => {
  assert.deepEqual(getBulkTaskLines("\n  One thing only\n"), []);
  assert.deepEqual(getBulkTaskLines("\n1. First task\n\n2) Second task\n"), ["First task", "Second task"]);
});

test("builds new active tasks with shared metadata", () => {
  const tasks = buildBulkTasksFromText("Buy milk\nPick up basil", {
    label: "home",
    priority: "high",
    dueAt: "2026-05-18",
    now: "2026-05-17T18:30:00.000Z",
    createId: (index) => `task-${index}`
  });

  assert.deepEqual(tasks, [
    {
      id: "task-0",
      title: "Buy milk",
      details: "",
      label: "home",
      priority: "high",
      dueAt: "2026-05-18",
      completed: false,
      status: "active",
      createdAt: "2026-05-17T18:30:00.000Z",
      updatedAt: "2026-05-17T18:30:00.000Z"
    },
    {
      id: "task-1",
      title: "Pick up basil",
      details: "",
      label: "home",
      priority: "high",
      dueAt: "2026-05-18",
      completed: false,
      status: "active",
      createdAt: "2026-05-17T18:30:00.000Z",
      updatedAt: "2026-05-17T18:30:00.000Z"
    }
  ]);
});
