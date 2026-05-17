import assert from "node:assert/strict";
import {
  buildEditedNote,
  buildEditedTask,
  buildNoteEditPatch,
  buildTaskEditPatch,
  getEditableNoteDraft,
  getEditableTaskDraft
} from "../edit-items.mjs";

const now = "2026-05-17T21:00:00.000Z";

const note = {
  id: "note-1",
  title: "Old note",
  body: "Original body",
  label: "work",
  color: "sky",
  pinned: true,
  status: "archive",
  createdAt: "2026-05-16T12:00:00.000Z",
  updatedAt: "2026-05-16T12:00:00.000Z"
};

const editedNote = buildEditedNote(
  note,
  {
    title: "  Better note  ",
    body: "  polished   body ",
    label: "home",
    color: "mint",
    image: { src: "data:image/png;base64,abc", name: "sketch.png" }
  },
  { now }
);

assert.equal(editedNote.id, note.id);
assert.equal(editedNote.title, "Better note");
assert.equal(editedNote.body, "polished body");
assert.equal(editedNote.label, "home");
assert.equal(editedNote.color, "mint");
assert.equal(editedNote.pinned, true);
assert.equal(editedNote.status, "archive");
assert.equal(editedNote.createdAt, note.createdAt);
assert.equal(editedNote.updatedAt, now);
assert.equal(editedNote.image.name, "sketch.png");

const notePatch = buildNoteEditPatch(note, { title: "Patch", body: "Body", label: "bad", color: "bad" }, { now });
assert.deepEqual(notePatch, {
  title: "Patch",
  body: "Body",
  image: null,
  label: "work",
  color: "sky",
  updatedAt: now
});

assert.equal(buildEditedNote(note, { title: "", body: "", image: null }), null);

assert.deepEqual(getEditableNoteDraft({ ...note, image: "data:image/jpeg;base64,xyz" }), {
  mode: "note",
  title: "Old note",
  body: "Original body",
  label: "work",
  color: "sky",
  image: {
    src: "data:image/jpeg;base64,xyz",
    mime: "image/png",
    name: "Image",
    alt: "",
    prompt: "",
    generated: false,
    createdAt: ""
  }
});

const task = {
  id: "task-1",
  title: "Old task",
  details: "Original details",
  label: "ideas",
  priority: "low",
  dueAt: "2026-05-18",
  completed: true,
  status: "active",
  createdAt: "2026-05-16T12:00:00.000Z",
  updatedAt: "2026-05-16T12:00:00.000Z"
};

const editedTask = buildEditedTask(
  task,
  {
    title: "  Follow up  ",
    body: " Send recap ",
    label: "personal",
    priority: "high",
    dueAt: "2026-05-20"
  },
  { now }
);

assert.equal(editedTask.id, task.id);
assert.equal(editedTask.title, "Follow up");
assert.equal(editedTask.details, "Send recap");
assert.equal(editedTask.label, "personal");
assert.equal(editedTask.priority, "high");
assert.equal(editedTask.dueAt, "2026-05-20");
assert.equal(editedTask.completed, true);
assert.equal(editedTask.status, "active");
assert.equal(editedTask.updatedAt, now);

assert.equal(buildEditedTask(task, { title: "", body: "ignored" }), null);
assert.equal(buildEditedTask(task, { title: "New", priority: "urgent", dueAt: "tomorrow" }, { now }).priority, "low");
assert.equal(buildEditedTask(task, { title: "New", priority: "urgent", dueAt: "tomorrow" }, { now }).dueAt, "");

assert.deepEqual(getEditableTaskDraft(task), {
  mode: "task",
  title: "Old task",
  body: "Original details",
  label: "ideas",
  priority: "low",
  dueAt: "2026-05-18"
});

console.log("edit-items tests passed");
