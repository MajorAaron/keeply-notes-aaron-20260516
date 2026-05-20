import test from "node:test";
import assert from "node:assert/strict";
import { addAskHistoryQuestion, getAskHistoryChips, parseAskHistory, serializeAskHistory } from "../ask-history.mjs";

test("adds newest ask question first and removes case-insensitive duplicates", () => {
  const history = addAskHistoryQuestion(["What is due today?", "Summarize work notes"], " what is due today? ");

  assert.deepEqual(history, ["what is due today?", "Summarize work notes"]);
});

test("limits recent ask history to four normalized questions", () => {
  const history = addAskHistoryQuestion(["Second", "Third", "Fourth", "Fifth"], "First");

  assert.deepEqual(history, ["First", "Second", "Third", "Fourth"]);
});

test("parses stored history defensively", () => {
  assert.deepEqual(parseAskHistory("not json"), []);
  assert.deepEqual(parseAskHistory(JSON.stringify(["  One  ", "one", "Two", "", 42])), ["One", "Two", "42"]);
});

test("serializes normalized bounded history", () => {
  assert.equal(serializeAskHistory(["One", "Two", "Two", "Three", "Four", "Five"]), '["One","Two","Three","Four"]');
});

test("builds accessible recent-question chips", () => {
  assert.deepEqual(getAskHistoryChips(["What is due today?"]), [
    {
      question: "What is due today?",
      label: "Recent: What is due today?",
      ariaLabel: "Ask recent question: What is due today?"
    }
  ]);
});
