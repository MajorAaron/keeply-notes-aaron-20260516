import test from "node:test";
import assert from "node:assert/strict";
import { buildFollowUpTask, getNoteFollowUpDueDate } from "../note-followups.mjs";

const baseDate = new Date("2026-05-17T12:00:00");

test("note follow-up shortcuts produce stable task due dates", () => {
  assert.equal(getNoteFollowUpDueDate("today", baseDate), "2026-05-17");
  assert.equal(getNoteFollowUpDueDate("tomorrow", baseDate), "2026-05-18");
  assert.equal(getNoteFollowUpDueDate("later", baseDate), null);
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
