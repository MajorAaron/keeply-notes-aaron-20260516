import test from "node:test";
import assert from "node:assert/strict";
import { getNotePinLabel, toggleNotePin } from "../note-pin.mjs";

test("pins an active note and updates timestamp", () => {
  const result = toggleNotePin(
    [
      { id: "a", title: "Alpha", pinned: false, status: "active", updatedAt: "old" },
      { id: "b", title: "Beta", pinned: false, status: "active", updatedAt: "old" }
    ],
    "a",
    { now: "2026-05-17T23:00:00.000Z" }
  );

  assert.equal(result.pinned, true);
  assert.equal(result.note.id, "a");
  assert.deepEqual(
    result.notes.map((note) => [note.id, note.pinned, note.updatedAt]),
    [
      ["a", true, "2026-05-17T23:00:00.000Z"],
      ["b", false, "old"]
    ]
  );
});

test("unpins an already pinned note", () => {
  const result = toggleNotePin(
    [{ id: "a", title: "Alpha", pinned: true, status: "active", updatedAt: "old" }],
    "a",
    { now: "2026-05-17T23:00:00.000Z" }
  );

  assert.equal(result.pinned, false);
  assert.equal(result.notes[0].pinned, false);
  assert.equal(result.notes[0].updatedAt, "2026-05-17T23:00:00.000Z");
});

test("leaves notes unchanged when the note id is missing", () => {
  const notes = [{ id: "a", title: "Alpha", pinned: false, status: "active", updatedAt: "old" }];
  const result = toggleNotePin(notes, "missing", { now: "2026-05-17T23:00:00.000Z" });

  assert.equal(result.note, null);
  assert.equal(result.pinned, false);
  assert.equal(result.notes[0], notes[0]);
});

test("returns the matching pin action label", () => {
  assert.equal(getNotePinLabel({ pinned: false }), "Pin note");
  assert.equal(getNotePinLabel({ pinned: true }), "Unpin note");
});
