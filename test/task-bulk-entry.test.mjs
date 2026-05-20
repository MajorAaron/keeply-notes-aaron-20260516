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

test("parseBulkTaskLine extracts next week scheduling hints", () => {
  assert.deepEqual(parseBulkTaskLine("Draft launch recap next week #normal @work", { today: "2026-05-18" }), {
    title: "Draft launch recap",
    dueAt: "2026-05-25",
    priority: "normal",
    label: "work"
  });
});


test("parseBulkTaskLine extracts weekend scheduling hints", () => {
  assert.deepEqual(parseBulkTaskLine("Buy trail snacks this weekend @home", { today: "2026-05-18" }), {
    title: "Buy trail snacks",
    dueAt: "2026-05-23",
    priority: "",
    label: "home"
  });
  assert.deepEqual(parseBulkTaskLine("Plan brunch weekend !low", { today: "2026-05-24" }), {
    title: "Plan brunch",
    dueAt: "2026-05-24",
    priority: "low",
    label: ""
  });
});

test("parseBulkTaskLine extracts weekday scheduling hints", () => {
  assert.deepEqual(parseBulkTaskLine("Send invoices Friday @work", { today: "2026-05-18" }), {
    title: "Send invoices",
    dueAt: "2026-05-22",
    priority: "",
    label: "work"
  });

  assert.deepEqual(parseBulkTaskLine("Meal prep this Monday #home", { today: "2026-05-18" }), {
    title: "Meal prep",
    dueAt: "2026-05-18",
    priority: "",
    label: "home"
  });
});

test("bulk task weekday hints override shared due dates per line", () => {
  const tasks = buildBulkTasksFromText("Review contract Thursday\nCall plumber", {
    label: "work",
    priority: "normal",
    dueAt: "2026-05-25",
    today: "2026-05-18",
    now: "2026-05-18T12:00:00.000Z",
    createId: (index) => `task-${index}`
  });

  assert.equal(tasks[0].title, "Review contract");
  assert.equal(tasks[0].dueAt, "2026-05-21");
  assert.equal(tasks[1].title, "Call plumber");
  assert.equal(tasks[1].dueAt, "2026-05-25");
});

test("same-day capture hints strip evening and EOD scheduling words", () => {
  assert.deepEqual(parseBulkTaskLine("Send agenda tonight @work", { today: "2026-05-18" }), {
    title: "Send agenda",
    dueAt: "2026-05-18",
    priority: "",
    label: "work"
  });

  const tasks = buildBulkTasksFromText("Review launch checklist EOD\nSend notes end of day", {
    label: "work",
    priority: "normal",
    dueAt: "2026-05-21",
    today: "2026-05-18",
    now: "2026-05-18T12:00:00.000Z",
    createId: (index) => `task-${index}`
  });

  assert.equal(tasks[0].title, "Review launch checklist");
  assert.equal(tasks[0].dueAt, "2026-05-18");
  assert.equal(tasks[1].title, "Send notes");
  assert.equal(tasks[1].dueAt, "2026-05-18");
});

test("no-date hints strip scheduling words and clear shared due dates", () => {
  assert.deepEqual(parseBulkTaskLine("Refill travel kit someday @home"), {
    title: "Refill travel kit",
    dueAt: "",
    priority: "",
    label: "home",
    clearsDue: true
  });

  const tasks = buildBulkTasksFromText("Buy batteries no date\nCall vet tomorrow", {
    label: "home",
    priority: "normal",
    dueAt: "2026-05-21",
    today: "2026-05-18",
    now: "2026-05-18T12:00:00.000Z",
    createId: (index) => `task-${index}`
  });

  assert.equal(tasks[0].title, "Buy batteries");
  assert.equal(tasks[0].dueAt, "");
  assert.equal(tasks[1].title, "Call vet");
  assert.equal(tasks[1].dueAt, "2026-05-19");
});
