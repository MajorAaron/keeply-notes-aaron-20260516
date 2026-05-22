import test from "node:test";
import assert from "node:assert/strict";

import { getItemBillingMeta } from "../item-billing-meta.mjs";

test("detects invoice and billing statement cues", () => {
  const meta = getItemBillingMeta("Send invoice and billing statement to finance before Friday.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Invoice");
  assert.equal(meta.tone, "invoice");
  assert.equal(meta.ariaLabel, "Contains a invoice billing cue");
});

test("detects subscription renewal cues", () => {
  const meta = getItemBillingMeta("Subscription renewal: annual plan renews on June 2 after the free trial.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Subscription");
  assert.equal(meta.tone, "subscription");
});

test("summarizes multiple billing cues", () => {
  const meta = getItemBillingMeta("Invoice receipt: payment due by Monday, subscription renews next week, request refund if double charged.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "4 billing");
  assert.equal(meta.tone, "multiple");
  assert.equal(meta.ariaLabel, "Contains 4 billing cues");
});

test("ignores common non-billing product and engineering phrases", () => {
  assert.equal(getItemBillingMeta("Payment pipeline rollout and reactive subscription pattern notes.").available, false);
  assert.equal(getItemBillingMeta("Invoice component polish and receipt parser test cases.").available, false);
});

test("returns empty metadata for blank text", () => {
  assert.deepEqual(getItemBillingMeta(""), { available: false, label: "", ariaLabel: "", tone: "" });
});
