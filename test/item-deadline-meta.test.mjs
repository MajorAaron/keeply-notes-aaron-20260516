import test from "node:test";
import assert from "node:assert/strict";

import { getItemDeadlineMeta } from "../item-deadline-meta.mjs";

test("detects explicit deadline cues", () => {
  const meta = getItemDeadlineMeta("Grant application deadline is Friday at noon.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Deadline");
  assert.equal(meta.tone, "deadline");
  assert.equal(meta.ariaLabel, "Contains a deadline cue");
});

test("detects RSVP and response deadlines", () => {
  const meta = getItemDeadlineMeta("RSVP by Tuesday and confirm by end of day.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "RSVP");
  assert.equal(meta.tone, "rsvp");
});

test("detects expiration and offer-end cues", () => {
  const meta = getItemDeadlineMeta("Coupon expires tomorrow; offer ends Friday.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Expires");
  assert.equal(meta.tone, "expires");
});

test("summarizes multiple deadline cue types", () => {
  const meta = getItemDeadlineMeta("Submit by Monday, RSVP by Tuesday, and note the final deadline before the offer expires.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "4 deadlines");
  assert.equal(meta.tone, "multiple");
  assert.equal(meta.ariaLabel, "Contains 4 deadline cues");
});

test("ignores common technical deadline and expiration phrases", () => {
  assert.equal(getItemDeadlineMeta("Deadline scheduler and submit button tests for cache expires headers.").available, false);
  assert.equal(getItemDeadlineMeta("JWT expires header and reply-by header parser cleanup.").available, false);
});

test("returns empty metadata for blank text", () => {
  assert.deepEqual(getItemDeadlineMeta(""), { available: false, label: "", ariaLabel: "", tone: "" });
});
