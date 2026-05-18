import test from "node:test";
import assert from "node:assert/strict";
import { getTaskPriorityFilterCounts, matchesTaskPriorityFilter, normalizeTaskPriorityFilter } from "../task-priority-filters.mjs";

test("task priority filter normalization keeps known filters", () => {
  assert.equal(normalizeTaskPriorityFilter("all"), "all");
  assert.equal(normalizeTaskPriorityFilter("high"), "high");
  assert.equal(normalizeTaskPriorityFilter("normal"), "normal");
  assert.equal(normalizeTaskPriorityFilter("low"), "low");
  assert.equal(normalizeTaskPriorityFilter("urgent"), "all");
});

test("task priority filters match tasks by normalized priority", () => {
  assert.equal(matchesTaskPriorityFilter({ priority: "high" }, "high"), true);
  assert.equal(matchesTaskPriorityFilter({ priority: "low" }, "high"), false);
  assert.equal(matchesTaskPriorityFilter({ priority: "normal" }, "all"), true);
  assert.equal(matchesTaskPriorityFilter({ priority: "urgent" }, "normal"), true);
});

test("task priority filter counts include missing priorities as normal", () => {
  assert.deepEqual(
    getTaskPriorityFilterCounts([
      { priority: "high" },
      { priority: "normal" },
      { priority: "low" },
      {},
      { priority: "high" }
    ]),
    {
      all: 5,
      high: 2,
      normal: 2,
      low: 1
    }
  );
});
