import test from "node:test";
import assert from "node:assert/strict";
import { getArchiveRestoreAction, getTrashAction } from "../item-status-actions.mjs";

test("archive action archives active notes and tasks", () => {
  assert.deepEqual(getArchiveRestoreAction({ view: "active", type: "note" }), {
    action: "archive",
    status: "archive",
    ariaLabel: "Archive note",
    title: "Archive note",
    buttonLabel: "",
    message: "Archived"
  });

  assert.equal(getArchiveRestoreAction({ view: "tasks", type: "task" }).ariaLabel, "Archive task");
});

test("archive control becomes a restore action in archive and trash", () => {
  assert.deepEqual(getArchiveRestoreAction({ view: "archive", type: "task" }), {
    action: "restore",
    status: "active",
    ariaLabel: "Restore task",
    title: "Restore task",
    buttonLabel: "Restore",
    message: "Restored"
  });

  assert.deepEqual(getArchiveRestoreAction({ view: "trash", type: "note" }), {
    action: "restore",
    status: "active",
    ariaLabel: "Restore note",
    title: "Restore note",
    buttonLabel: "Restore",
    message: "Restored"
  });
});

test("trash action labels permanent deletes only in trash", () => {
  assert.deepEqual(getTrashAction({ view: "tasks", type: "task" }), {
    action: "trash",
    ariaLabel: "Move task to trash",
    title: "Move task to trash",
    message: "Moved to trash"
  });

  assert.deepEqual(getTrashAction({ view: "trash", type: "note" }), {
    action: "deleteForever",
    ariaLabel: "Delete note forever",
    title: "Delete note forever",
    message: "Deleted forever"
  });
});
