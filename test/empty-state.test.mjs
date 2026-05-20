import test from "node:test";
import assert from "node:assert/strict";
import { getEmptyStateCopy, hasRecoverableEmptyStateFilters } from "../empty-state.mjs";

test("empty state copy keeps true-empty task views focused on creating", () => {
  assert.deepEqual(
    getEmptyStateCopy({ view: "tasks", label: "all", taskWindow: "all", taskPriority: "all", taskCompletion: "all", query: "" }),
    {
      title: "No tasks here",
      message: "Add a task with a due date, priority, and label.",
      action: ""
    }
  );
  assert.equal(hasRecoverableEmptyStateFilters({ view: "tasks", label: "all", taskWindow: "all", taskPriority: "all", taskCompletion: "all", query: "" }), false);
});

test("empty state copy offers filter recovery for task filters", () => {
  assert.deepEqual(
    getEmptyStateCopy({ view: "tasks", label: "work", taskWindow: "today", taskPriority: "high", taskCompletion: "done", query: "launch" }),
    {
      title: "No matching tasks",
      message: "Clear filters to get back to everything in this view.",
      action: "Clear filters"
    }
  );
  assert.equal(hasRecoverableEmptyStateFilters({ view: "tasks", taskWindow: "overdue" }), true);
  assert.equal(hasRecoverableEmptyStateFilters({ view: "tasks", taskCompletion: "open" }), true);
});

test("empty state copy offers filter recovery for note color, pin filters, and search", () => {
  assert.deepEqual(
    getEmptyStateCopy({ view: "active", label: "all", noteColor: "sky", notePin: "pinned", query: "" }),
    {
      title: "No matching notes",
      message: "Clear filters to get back to everything in this view.",
      action: "Clear filters"
    }
  );
  assert.equal(hasRecoverableEmptyStateFilters({ view: "active", noteColor: "all", notePin: "unpinned", query: "" }), true);
  assert.equal(hasRecoverableEmptyStateFilters({ view: "active", noteColor: "all", notePin: "all", query: " quarterly " }), true);
});

test("empty state copy distinguishes archive and trash when no filters are active", () => {
  assert.deepEqual(getEmptyStateCopy({ view: "archive" }), {
    title: "Archive is empty",
    message: "Archived notes and tasks will collect here when you need them later.",
    action: ""
  });
  assert.deepEqual(getEmptyStateCopy({ view: "trash" }), {
    title: "Trash is empty",
    message: "Deleted notes and tasks will wait here until you remove them forever.",
    action: ""
  });
});
