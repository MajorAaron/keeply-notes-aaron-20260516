import test from "node:test";
import assert from "node:assert/strict";
import {
  TASK_COMPOSER_PRIORITY_PRESETS,
  getTaskComposerPriorityLabel,
  normalizeTaskComposerPriority
} from "../task-composer-priorities.mjs";

test("task composer priority presets expose mobile-friendly choices", () => {
  assert.deepEqual(
    TASK_COMPOSER_PRIORITY_PRESETS.map((preset) => preset.key),
    ["high", "normal", "low"]
  );
});

test("task composer priority normalization keeps valid choices", () => {
  assert.equal(normalizeTaskComposerPriority("high"), "high");
  assert.equal(normalizeTaskComposerPriority("normal"), "normal");
  assert.equal(normalizeTaskComposerPriority("low"), "low");
});

test("task composer priority normalization falls back to normal", () => {
  assert.equal(normalizeTaskComposerPriority(""), "normal");
  assert.equal(normalizeTaskComposerPriority("urgent"), "normal");
  assert.equal(normalizeTaskComposerPriority(null), "normal");
});

test("task composer priority labels explain the selected preset", () => {
  assert.equal(getTaskComposerPriorityLabel("high"), "High priority selected");
  assert.equal(getTaskComposerPriorityLabel("normal"), "Normal priority selected");
  assert.equal(getTaskComposerPriorityLabel("low"), "Low priority selected");
  assert.equal(getTaskComposerPriorityLabel("later"), "Normal priority selected");
});
