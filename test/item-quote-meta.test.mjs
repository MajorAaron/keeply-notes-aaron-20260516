import test from "node:test";
import assert from "node:assert/strict";

import { getItemQuoteMeta } from "../item-quote-meta.mjs";

test("returns unavailable metadata when text has no quote cues", () => {
  assert.deepEqual(getItemQuoteMeta("Bring the metric snapshot and two product bets."), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects straight quoted excerpts", () => {
  assert.deepEqual(getItemQuoteMeta('Add customer note: "The onboarding flow feels calm."'), {
    available: true,
    label: "Quote",
    ariaLabel: "Contains a quoted excerpt",
    tone: "single"
  });
});

test("detects markdown blockquotes", () => {
  assert.deepEqual(getItemQuoteMeta("> Ship the smaller version first\nThen follow up next week."), {
    available: true,
    label: "Quote",
    ariaLabel: "Contains a quoted excerpt",
    tone: "single"
  });
});

test("summarizes multiple unique quoted excerpts", () => {
  assert.deepEqual(getItemQuoteMeta('Feedback: “Too slow” and "Needs polish".'), {
    available: true,
    label: "2 quotes",
    ariaLabel: "Contains 2 quoted excerpts",
    tone: "multiple"
  });
});

test("does not treat apostrophes inside words as quotes", () => {
  assert.deepEqual(getItemQuoteMeta("Maya's recap says the launch isn't blocked."), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});
