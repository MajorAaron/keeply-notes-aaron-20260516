import test from "node:test";
import assert from "node:assert/strict";
import { duplicateNote, duplicateTask } from "../duplicate-items.mjs";

test("duplicates notes as active unpinned copies", () => {
  assert.deepEqual(
    duplicateNote(
      {
        id: "note-1",
        title: "Quarterly check-in",
        body: "Bring metrics.",
        label: "work",
        color: "sky",
        pinned: true,
        status: "archive",
        createdAt: "2026-05-01T10:00:00.000Z",
        updatedAt: "2026-05-02T10:00:00.000Z"
      },
      { id: "note-2", now: "2026-05-17T19:30:00.000Z" }
    ),
    {
      id: "note-2",
      title: "Copy of Quarterly check-in",
      body: "Bring metrics.",
      label: "work",
      color: "sky",
      pinned: false,
      status: "active",
      createdAt: "2026-05-17T19:30:00.000Z",
      updatedAt: "2026-05-17T19:30:00.000Z"
    }
  );
});

test("does not stack copy prefixes on notes", () => {
  assert.equal(duplicateNote({ title: "Copy of Market list" }, { id: "note-2", now: "2026-05-17T19:30:00.000Z" }).title, "Copy of Market list");
});

test("duplicates tasks as active open copies", () => {
  assert.deepEqual(
    duplicateTask(
      {
        id: "task-1",
        title: "Send check-in recap",
        details: "Include owners.",
        label: "work",
        priority: "high",
        dueAt: "2026-05-18",
        completed: true,
        status: "trash",
        createdAt: "2026-05-01T10:00:00.000Z",
        updatedAt: "2026-05-02T10:00:00.000Z"
      },
      { id: "task-2", now: "2026-05-17T19:31:00.000Z" }
    ),
    {
      id: "task-2",
      title: "Copy of Send check-in recap",
      details: "Include owners.",
      label: "work",
      priority: "high",
      dueAt: "2026-05-18",
      completed: false,
      status: "active",
      createdAt: "2026-05-17T19:31:00.000Z",
      updatedAt: "2026-05-17T19:31:00.000Z"
    }
  );
});
