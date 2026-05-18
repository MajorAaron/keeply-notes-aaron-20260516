import test from "node:test";
import assert from "node:assert/strict";
import { buildBulkTasksFromText, getBulkTaskLines, parseBulkTaskLine } from "../task-bulk-entry.mjs";

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

test("parseBulkTaskLine extracts mobile paste hints", () => {
  assert.deepEqual(parseBulkTaskLine("- Call dentist tomorrow !high @home", { today: "2026-05-18" }), {
    title: "Call dentist",
    dueAt: "2026-05-19",
    priority: "high",
    label: "home"
  });

  assert.deepEqual(parseBulkTaskLine("Send agenda today asap #work", { today: "2026-05-18" }), {
    title: "Send agenda",
    dueAt: "2026-05-18",
    priority: "high",
    label: "work"
  });
});

test("bulk task hints override shared metadata per pasted line", () => {
  const tasks = buildBulkTasksFromText("Call dentist tomorrow !high @home\nDraft launch note #ideas", {
    label: "work",
    priority: "normal",
    dueAt: "2026-05-20",
    now: "2026-05-18T12:00:00.000Z",
    createId: (index) => `task-${index}`
  });

  assert.equal(tasks[0].title, "Call dentist");
  assert.equal(tasks[0].label, "home");
  assert.equal(tasks[0].priority, "high");
  assert.equal(tasks[0].dueAt, "2026-05-19");
  assert.equal(tasks[1].title, "Draft launch note");
  assert.equal(tasks[1].label, "ideas");
  assert.equal(tasks[1].priority, "normal");
  assert.equal(tasks[1].dueAt, "2026-05-20");
});
