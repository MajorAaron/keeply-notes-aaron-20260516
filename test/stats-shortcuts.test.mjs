import test from "node:test";
import assert from "node:assert/strict";
import { getStatsShortcut } from "../stats-shortcuts.mjs";

test("builds task stat shortcuts for all and open work", () => {
  assert.deepEqual(getStatsShortcut({ view: "tasks", slot: "total" }).filters, {
    view: "tasks",
    label: "all",
    query: "",
    taskWindow: "all",
    taskPriority: "all",
    taskCompletion: "all"
  });

  const open = getStatsShortcut({ view: "tasks", slot: "middle" });
  assert.equal(open.label, "Show open tasks");
  assert.equal(open.filters.taskCompletion, "open");
  assert.equal(open.filters.taskWindow, "all");
});

test("routes task due shortcut to the nearest due window", () => {
  const today = getStatsShortcut({ view: "tasks", slot: "right", counts: { dueToday: 2, dueTomorrow: 3 } });
  assert.equal(today.label, "Show tasks due today");
  assert.equal(today.filters.taskWindow, "today");
  assert.equal(today.filters.taskCompletion, "open");

  const tomorrow = getStatsShortcut({ view: "tasks", slot: "right", counts: { dueToday: 0, dueTomorrow: 1 } });
  assert.equal(tomorrow.label, "Show tasks due tomorrow");
  assert.equal(tomorrow.filters.taskWindow, "tomorrow");
});

test("builds note shortcuts for all and pinned notes", () => {
  const allNotes = getStatsShortcut({ view: "active", slot: "total" });
  assert.equal(allNotes.label, "Show all active notes");
  assert.equal(allNotes.filters.notePin, "all");

  const pinned = getStatsShortcut({ view: "active", slot: "middle" });
  assert.equal(pinned.label, "Show pinned notes");
  assert.equal(pinned.filters.notePin, "pinned");
});

test("disables summary-only stat slots", () => {
  const summary = getStatsShortcut({ view: "active", slot: "right" });
  assert.equal(summary.enabled, false);
  assert.equal(summary.filters, null);
});
