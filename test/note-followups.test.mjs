import test from "node:test";
import assert from "node:assert/strict";
import { buildFollowUpTask, getNoteFollowUpDueDate, getNoteFollowUpToast, removeFollowUpTask } from "../note-followups.mjs";

const baseDate = new Date("2026-05-17T12:00:00");

test("note follow-up shortcuts produce stable task due dates", () => {
  assert.equal(getNoteFollowUpDueDate("today", baseDate), "2026-05-17");
  assert.equal(getNoteFollowUpDueDate("tomorrow", baseDate), "2026-05-18");
  assert.equal(getNoteFollowUpDueDate("weekend", new Date("2026-05-20T12:00:00")), "2026-05-23");
  assert.equal(getNoteFollowUpDueDate("weekend", new Date("2026-05-23T12:00:00")), "2026-05-23");
  assert.equal(getNoteFollowUpDueDate("weekend", baseDate), "2026-05-17");
  assert.equal(getNoteFollowUpDueDate("next-week", baseDate), "2026-05-24");
  assert.equal(getNoteFollowUpDueDate("later", baseDate), null);
});

test("note follow-up shortcuts produce concise toast copy", () => {
  assert.equal(getNoteFollowUpToast("today"), "Task added for today");
  assert.equal(getNoteFollowUpToast("tomorrow"), "Task added for tomorrow");
  assert.equal(getNoteFollowUpToast("weekend"), "Task added for the weekend");
  assert.equal(getNoteFollowUpToast("next-week"), "Task added for next week");
  assert.equal(getNoteFollowUpToast("later"), "Task added");
});

test("buildFollowUpTask carries note context into a task", () => {
  const task = buildFollowUpTask(
    {
      id: "note-1",
      title: "Quarterly planning",
      body: "Draft agenda and owners.",
      label: "work"
    },
    {
      shortcut: "tomorrow",
      id: "task-1",
      baseDate,
      now: new Date("2026-05-17T15:30:00Z")
    }
  );

  assert.deepEqual(task, {
    id: "task-1",
    title: "Follow up: Quarterly planning",
    details: "Draft agenda and owners.",
    label: "work",
    priority: "normal",
    dueAt: "2026-05-18",
    completed: false,
    status: "active",
    sourceNoteId: "note-1",
    createdAt: "2026-05-17T15:30:00.000Z",
    updatedAt: "2026-05-17T15:30:00.000Z"
  });
});

test("buildFollowUpTask rejects unknown shortcuts and missing notes", () => {
  assert.equal(buildFollowUpTask({ id: "note-1" }, { shortcut: "later", baseDate }), null);
  assert.equal(buildFollowUpTask(null, { shortcut: "today", baseDate }), null);
});

test("removeFollowUpTask removes only the matching task from its source note", () => {
  const tasks = [
    { id: "task-1", title: "Keep", sourceNoteId: "note-1" },
    { id: "task-2", title: "Follow up", sourceNoteId: "note-2" },
    { id: "task-3", title: "Other", sourceNoteId: "note-2" }
  ];

  const result = removeFollowUpTask(tasks, { id: "task-2", sourceNoteId: "note-2" });

  assert.deepEqual(result.tasks, [tasks[0], tasks[2]]);
  assert.deepEqual(result.removed, tasks[1]);
  assert.deepEqual(tasks.map((task) => task.id), ["task-1", "task-2", "task-3"]);
});

test("removeFollowUpTask refuses mismatched or invalid follow-up snapshots", () => {
  const tasks = [{ id: "task-2", title: "Changed", sourceNoteId: "note-2" }];

  assert.equal(removeFollowUpTask(tasks, { id: "task-2", sourceNoteId: "other-note" }).removed, null);
  assert.equal(removeFollowUpTask(tasks, { id: "task-2" }).removed, null);
  assert.deepEqual(removeFollowUpTask(null, { id: "task-2", sourceNoteId: "note-2" }), { tasks: [], removed: null });
});
