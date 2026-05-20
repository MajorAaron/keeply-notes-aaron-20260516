import test from "node:test";
import assert from "node:assert/strict";
import { getActiveFilterSummary, shouldShowFilterSummary } from "../active-filters.mjs";

test("active filter summary stays hidden for default filters", () => {
  const summary = getActiveFilterSummary({
    view: "active",
    label: "all",
    taskWindow: "all",
    taskPriority: "all",
    taskCompletion: "all",
    noteColor: "all",
    notePin: "all",
    query: ""
  });

  assert.equal(summary.active, false);
  assert.deepEqual(summary.chips, []);
  assert.equal(shouldShowFilterSummary({ label: "all", taskWindow: "all", taskPriority: "all", taskCompletion: "all", noteColor: "all", notePin: "all", query: "" }), false);
});

test("active filter summary includes labels, note color, note pin state, and search", () => {
  assert.deepEqual(
    getActiveFilterSummary({
      view: "active",
      label: "work",
      taskWindow: "today",
      taskPriority: "high",
      noteColor: "sky",
      notePin: "pinned",
      query: "quarterly check-in"
    }),
    {
      active: true,
      chips: [
        { key: "label", label: "Work" },
        { key: "noteColor", label: "Sky notes" },
        { key: "notePin", label: "Pinned notes" },
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
      taskWindow: "week",
      taskPriority: "high",
      taskCompletion: "done",
      noteColor: "rose",
      notePin: "unpinned",
      query: "a very long search phrase that needs trimming"
    }),
    {
      active: true,
      chips: [
        { key: "label", label: "Home" },
        { key: "taskWindow", label: "This week" },
        { key: "taskPriority", label: "High priority" },
        { key: "taskCompletion", label: "Done tasks" },
        { key: "query", label: "Search: a very long search ph..." }
      ]
    }
  );
});
