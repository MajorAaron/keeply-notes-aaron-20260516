import test from "node:test";
import assert from "node:assert/strict";
import { TASK_COMPOSER_DUE_PRESETS, getTaskComposerDueDate, getTaskComposerDueHint } from "../task-composer-presets.mjs";

test("task composer due presets expose mobile-friendly choices", () => {
  assert.deepEqual(
    TASK_COMPOSER_DUE_PRESETS.map((preset) => preset.key),
    ["today", "tomorrow", "next-week", "none"]
  );
});

test("task composer due presets resolve relative dates", () => {
  const now = new Date("2026-05-17T12:00:00");
  assert.equal(getTaskComposerDueDate("today", now), "2026-05-17");
  assert.equal(getTaskComposerDueDate("tomorrow", now), "2026-05-18");
  assert.equal(getTaskComposerDueDate("next-week", now), "2026-05-24");
  assert.equal(getTaskComposerDueDate("none", now), "");
});

test("unknown task composer due preset is ignored", () => {
  assert.equal(getTaskComposerDueDate("later", new Date("2026-05-17T12:00:00")), null);
});

test("task composer due hint explains relative dates", () => {
  const now = new Date("2026-05-17T12:00:00");
  assert.equal(getTaskComposerDueHint("", now), "No date selected");
  assert.equal(getTaskComposerDueHint("2026-05-16", now), "Overdue by 1 day");
  assert.equal(getTaskComposerDueHint("2026-05-17", now), "Due today");
  assert.equal(getTaskComposerDueHint("2026-05-18", now), "Due tomorrow");
  assert.equal(getTaskComposerDueHint("2026-05-21", now), "Due in 4 days");
  assert.equal(getTaskComposerDueHint("2026-05-24", now), "Due in 7 days");
});

test("task composer due hint handles older and custom dates", () => {
  const now = new Date("2026-05-17T23:45:00");
  assert.equal(getTaskComposerDueHint("2026-05-14", now), "Overdue by 3 days");
  assert.match(getTaskComposerDueHint("2026-05-28", now), /^Due /);
  assert.equal(getTaskComposerDueHint("not-a-date", now), "Custom due date");
});
