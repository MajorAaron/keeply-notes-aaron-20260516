import test from "node:test";
import assert from "node:assert/strict";

import { getItemQuestionMeta } from "../item-question-meta.mjs";

test("returns unavailable metadata when text has no questions", () => {
  assert.deepEqual(getItemQuestionMeta("Review the launch plan and send the recap."), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects a single question in note or task text", () => {
  assert.deepEqual(getItemQuestionMeta("Ask: what changed in the launch plan?"), {
    available: true,
    label: "Question",
    ariaLabel: "Contains 1 question",
    tone: "single"
  });
});

test("summarizes multiple questions compactly", () => {
  assert.deepEqual(getItemQuestionMeta("What is blocked? Who owns the next step?"), {
    available: true,
    label: "2 questions",
    ariaLabel: "Contains 2 questions",
    tone: "multiple"
  });
});

test("counts question marks in shorthand mobile notes", () => {
  assert.deepEqual(getItemQuestionMeta("Budget approved? Ask legal?"), {
    available: true,
    label: "2 questions",
    ariaLabel: "Contains 2 questions",
    tone: "multiple"
  });
});
