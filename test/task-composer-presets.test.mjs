import test from "node:test";
import assert from "node:assert/strict";
import { TASK_COMPOSER_DUE_PRESETS, getTaskComposerDueDate } from "../task-composer-presets.mjs";

test("task composer due presets expose mobile-friendly choices", () => {
  assert.deepEqual(
    TASK_COMPOSER_DUE_PRESETS.map((preset) => preset.key),
    ["today", "tomorrow", "none"]
  );
});

test("task composer due presets resolve relative dates", () => {
  const now = new Date("2026-05-17T12:00:00");
  assert.equal(getTaskComposerDueDate("today", now), "2026-05-17");
  assert.equal(getTaskComposerDueDate("tomorrow", now), "2026-05-18");
  assert.equal(getTaskComposerDueDate("none", now), "");
});

test("unknown task composer due preset is ignored", () => {
  assert.equal(getTaskComposerDueDate("later", new Date("2026-05-17T12:00:00")), null);
});
