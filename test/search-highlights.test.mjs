import test from "node:test";
import assert from "node:assert/strict";
import { getSearchHighlightTerms, splitHighlightedText } from "../search-highlights.mjs";

test("search highlight terms are unique, useful, and length sorted", () => {
  assert.deepEqual(getSearchHighlightTerms("  Work work q market-list follow-up! "), ["market-list", "follow-up", "work"]);
});

test("search highlight terms ignore one-character fragments", () => {
  assert.deepEqual(getSearchHighlightTerms("a b Q3 ok"), ["ok", "q3"]);
});

test("highlight splitting preserves original text casing", () => {
  assert.deepEqual(splitHighlightedText("Quarterly check-in recap", ["check-in", "recap"]), [
    { text: "Quarterly ", highlighted: false },
    { text: "check-in", highlighted: true },
    { text: " ", highlighted: false },
    { text: "recap", highlighted: true }
  ]);
});

test("highlight splitting prefers the longest match at the same position", () => {
  assert.deepEqual(splitHighlightedText("Task today", ["task", "task today"]), [{ text: "Task today", highlighted: true }]);
});
