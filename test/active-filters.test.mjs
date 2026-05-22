import test from "node:test";
import assert from "node:assert/strict";
import { getActiveFilterSummary, getFilterRemovalPatch, shouldShowFilterSummary } from "../active-filters.mjs";

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
        { key: "label", label: "Work", removeLabel: "Remove Work filter", title: "Remove Work" },
        { key: "noteColor", label: "Sky notes", removeLabel: "Remove Sky notes filter", title: "Remove Sky notes" },
        { key: "notePin", label: "Pinned notes", removeLabel: "Remove Pinned notes filter", title: "Remove Pinned notes" },
        { key: "query", label: "Search: quarterly check-in", removeLabel: "Remove Search: quarterly check-in filter", title: "Remove Search: quarterly check-in" }
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
        { key: "label", label: "Home", removeLabel: "Remove Home filter", title: "Remove Home" },
        { key: "taskWindow", label: "This week", removeLabel: "Remove This week filter", title: "Remove This week" },
        { key: "taskPriority", label: "High priority", removeLabel: "Remove High priority filter", title: "Remove High priority" },
        { key: "taskCompletion", label: "Done tasks", removeLabel: "Remove Done tasks filter", title: "Remove Done tasks" },
        { key: "query", label: "Search: a very long search ph...", removeLabel: "Remove Search: a very long search ph... filter", title: "Remove Search: a very long search ph..." }
      ]
    }
  );
});

test("filter removal patches reset one chip at a time", () => {
  assert.deepEqual(getFilterRemovalPatch("label"), { key: "label", value: "all" });
  assert.deepEqual(getFilterRemovalPatch("taskWindow"), { key: "taskWindow", value: "all" });
  assert.deepEqual(getFilterRemovalPatch("taskPriority"), { key: "taskPriority", value: "all" });
  assert.deepEqual(getFilterRemovalPatch("taskCompletion"), { key: "taskCompletion", value: "all" });
  assert.deepEqual(getFilterRemovalPatch("noteColor"), { key: "noteColor", value: "all" });
  assert.deepEqual(getFilterRemovalPatch("notePin"), { key: "notePin", value: "all" });
  assert.deepEqual(getFilterRemovalPatch("query"), { key: "query", value: "" });
  assert.equal(getFilterRemovalPatch("unknown"), null);
});
