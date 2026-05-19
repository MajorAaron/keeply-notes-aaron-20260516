import test from "node:test";
import assert from "node:assert/strict";
import { getNoteSwipeAction } from "../note-swipe-actions.mjs";

test("note swipes stay idle until the threshold is crossed", () => {
  assert.equal(getNoteSwipeAction({ deltaX: 70, view: "active" }), null);
  assert.equal(getNoteSwipeAction({ deltaX: -10, view: "archive" }), null);
});

test("active note swipes pin or archive without sending notes straight to trash", () => {
  assert.equal(getNoteSwipeAction({ deltaX: 92, view: "active", pinned: false }), "pin");
  assert.equal(getNoteSwipeAction({ deltaX: 92, view: "active", pinned: true }), "unpin");
  assert.equal(getNoteSwipeAction({ deltaX: -92, view: "active" }), "archive");
});

test("archive and trash note swipes support restore and cleanup", () => {
  assert.equal(getNoteSwipeAction({ deltaX: 92, view: "archive" }), "restore");
  assert.equal(getNoteSwipeAction({ deltaX: -92, view: "archive" }), "trash");
  assert.equal(getNoteSwipeAction({ deltaX: 92, view: "trash" }), "restore");
  assert.equal(getNoteSwipeAction({ deltaX: -92, view: "trash" }), null);
});
