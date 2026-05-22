import test from "node:test";
import assert from "node:assert/strict";

import { getItemUrgencyMeta } from "../item-urgency-meta.mjs";

test("detects ASAP urgency cues", () => {
  assert.deepEqual(getItemUrgencyMeta("Send invoice ASAP before lunch"), {
    available: true,
    label: "ASAP",
    tone: "asap",
    ariaLabel: "Contains an ASAP urgency cue"
  });
});

test("prefers critical labels for critical and P0 cues", () => {
  assert.deepEqual(getItemUrgencyMeta("P0 critical outage follow-up"), {
    available: true,
    label: "Critical",
    tone: "critical",
    ariaLabel: "Contains a critical urgency cue"
  });
});

test("detects broader urgent language", () => {
  assert.deepEqual(getItemUrgencyMeta("Time-sensitive renewal for Maya"), {
    available: true,
    label: "Urgent",
    tone: "urgent",
    ariaLabel: "Contains an urgent cue"
  });
});

test("ignores negated urgency language", () => {
  assert.equal(getItemUrgencyMeta("This is not urgent anymore").available, false);
  assert.equal(getItemUrgencyMeta("non-urgent backlog polish").available, false);
});

test("stays quiet for ordinary priority words", () => {
  assert.equal(getItemUrgencyMeta("Review priority list when convenient").available, false);
});
