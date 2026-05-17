import test from "node:test";
import assert from "node:assert/strict";
import { getActiveFilterSummary, shouldShowFilterSummary } from "../active-filters.mjs";

test("active filter summary stays hidden for default filters", () => {
  const summary = getActiveFilterSummary({
    view: "active",
    label: "all",
    taskWindow: "all",
    query: ""
  });

  assert.equal(summary.active, false);
  assert.deepEqual(summary.chips, []);
  assert.equal(shouldShowFilterSummary({ label: "all", taskWindow: "all", query: "" }), false);
});

test("active filter summary includes labels and search", () => {
  assert.deepEqual(
    getActiveFilterSummary({
      view: "active",
      label: "work",
      taskWindow: "today",
      query: "quarterly check-in"
    }),
    {
      active: true,
      chips: [
        { key: "label", label: "Work" },
        { key: "query", label: "Search: quarterly check-in" }
      ]
    }
  );
});

test("active filter summary includes task date windows only in tasks view", () => {
  assert.deepEqual(
    getActiveFilterSummary({
      view: "tasks",
      label: "home",
      taskWindow: "unscheduled",
      query: "a very long search phrase that needs trimming"
    }),
    {
      active: true,
      chips: [
        { key: "label", label: "Home" },
        { key: "taskWindow", label: "No date" },
        { key: "query", label: "Search: a very long search ph..." }
      ]
    }
  );
});
