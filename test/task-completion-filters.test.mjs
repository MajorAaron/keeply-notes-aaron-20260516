import test from "node:test";
import assert from "node:assert/strict";

import {
  getTaskCompletionFilterCounts,
  matchesTaskCompletionFilter,
  normalizeTaskCompletionFilter
} from "../task-completion-filters.mjs";

test("normalizes task completion filters", () => {
  assert.equal(normalizeTaskCompletionFilter("open"), "open");
  assert.equal(normalizeTaskCompletionFilter("done"), "done");
  assert.equal(normalizeTaskCompletionFilter("finished"), "all");
});

test("matches tasks by open or done state", () => {
  const openTask = { completed: false };
  const missingStateTask = {};
  const doneTask = { completed: true };

  assert.equal(matchesTaskCompletionFilter(openTask, "all"), true);
  assert.equal(matchesTaskCompletionFilter(openTask, "open"), true);
  assert.equal(matchesTaskCompletionFilter(missingStateTask, "open"), true);
  assert.equal(matchesTaskCompletionFilter(openTask, "done"), false);
  assert.equal(matchesTaskCompletionFilter(doneTask, "done"), true);
  assert.equal(matchesTaskCompletionFilter(doneTask, "open"), false);
});

test("counts all, open, and done task filters", () => {
  assert.deepEqual(
    getTaskCompletionFilterCounts([{ completed: false }, { completed: true }, {}, { completed: true }]),
    { all: 4, open: 2, done: 2 }
  );
});
