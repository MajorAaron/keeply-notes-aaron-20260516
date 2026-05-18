import test from "node:test";
import assert from "node:assert/strict";
import { getTaskSwipeAction } from "../task-swipe-actions.mjs";

test("right swipe in task view completes an open task", () => {
  assert.equal(getTaskSwipeAction({ deltaX: 84, view: "tasks", completed: false }), "complete");
});

test("right swipe in task view reopens a completed task", () => {
  assert.equal(getTaskSwipeAction({ deltaX: 84, view: "tasks", completed: true }), "reopen");
});

test("left swipe archives active tasks without deleting them", () => {
  assert.equal(getTaskSwipeAction({ deltaX: -84, view: "tasks", completed: false }), "archive");
});

test("right swipe restores tasks from archive or trash", () => {
  assert.equal(getTaskSwipeAction({ deltaX: 84, view: "archive", completed: false }), "restore");
  assert.equal(getTaskSwipeAction({ deltaX: 84, view: "trash", completed: false }), "restore");
});

test("short swipes and unknown views do nothing", () => {
  assert.equal(getTaskSwipeAction({ deltaX: 42, view: "tasks", completed: false }), null);
  assert.equal(getTaskSwipeAction({ deltaX: -84, view: "trash", completed: false }), null);
  assert.equal(getTaskSwipeAction({ deltaX: 84, view: "active", completed: false }), null);
});
