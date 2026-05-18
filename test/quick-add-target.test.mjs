import test from "node:test";
import assert from "node:assert/strict";
import { getQuickAddTarget } from "../quick-add-target.mjs";

test("quick add targets tasks from the task view", () => {
  assert.deepEqual(getQuickAddTarget("tasks"), {
    mode: "task",
    ariaLabel: "Quick add task",
    title: "Quick add task",
    toast: "Task composer ready"
  });
});

test("quick add targets notes from note and cleanup views", () => {
  assert.equal(getQuickAddTarget("active").mode, "note");
  assert.equal(getQuickAddTarget("archive").ariaLabel, "Quick add note");
  assert.equal(getQuickAddTarget("trash").title, "Quick add note");
});

test("quick add falls back to notes for unknown views", () => {
  assert.equal(getQuickAddTarget("calendar").mode, "note");
  assert.equal(getQuickAddTarget().toast, "Note composer ready");
});
