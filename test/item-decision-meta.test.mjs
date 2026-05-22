import test from "node:test";
import assert from "node:assert/strict";

import { getItemDecisionMeta } from "../item-decision-meta.mjs";

test("returns unavailable metadata when text has no decision language", () => {
  assert.deepEqual(getItemDecisionMeta("Review the options before tomorrow's meeting."), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects approvals and sign-offs", () => {
  assert.deepEqual(getItemDecisionMeta("Design is signed off; move into build."), {
    available: true,
    label: "Approved",
    ariaLabel: "Contains an approval or sign-off decision",
    tone: "approved"
  });
});

test("detects rejected or no-go decisions", () => {
  assert.deepEqual(getItemDecisionMeta("Vendor proposal rejected after security review."), {
    available: true,
    label: "Rejected",
    ariaLabel: "Contains a rejected or declined decision",
    tone: "rejected"
  });
});

test("detects general decision language", () => {
  assert.deepEqual(getItemDecisionMeta("Final call is to launch the small beta first."), {
    available: true,
    label: "Decision",
    ariaLabel: "Contains decision language",
    tone: "decision"
  });
});
