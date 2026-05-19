import test from "node:test";
import assert from "node:assert/strict";

import { getSearchClearState } from "../search-clear.mjs";

test("hides the clear shortcut when the search is empty", () => {
  assert.deepEqual(getSearchClearState("", { view: "active" }), {
    visible: false,
    label: "Clear note search",
    title: "Clear search"
  });
});

test("shows a note search clear label with trimmed query context", () => {
  assert.deepEqual(getSearchClearState("  basil  ", { view: "active" }), {
    visible: true,
    label: "Clear note search for basil",
    title: "Clear search: basil"
  });
});

test("uses task wording in task search", () => {
  assert.deepEqual(getSearchClearState("urgent", { view: "tasks" }), {
    visible: true,
    label: "Clear task search for urgent",
    title: "Clear search: urgent"
  });
});
