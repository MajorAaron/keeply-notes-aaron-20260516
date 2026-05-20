import test from "node:test";
import assert from "node:assert/strict";

import { getItemContactMeta } from "../item-contact-meta.mjs";

test("hides contact metadata when text has no email or phone", () => {
  assert.deepEqual(getItemContactMeta("Review launch notes and docs"), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects a single email address", () => {
  const meta = getItemContactMeta("Send deck to Casey@Example.com before standup");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Email");
  assert.equal(meta.tone, "email");
  assert.equal(meta.ariaLabel, "Contains email address Casey at Example.com");
});

test("deduplicates repeated email addresses", () => {
  const meta = getItemContactMeta("alex@example.com then ALEX@example.com");

  assert.equal(meta.label, "Email");
  assert.equal(meta.ariaLabel, "Contains email address alex at example.com");
});

test("detects phone numbers in common mobile formats", () => {
  const meta = getItemContactMeta("Call (303) 555-0199 after lunch");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Phone");
  assert.equal(meta.tone, "phone");
  assert.equal(meta.ariaLabel, "Contains phone ending 0199");
});

test("summarizes multiple contact details", () => {
  const meta = getItemContactMeta("Vendor jane@example.com, ops@example.com, +1 303-555-0199");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "3 contacts");
  assert.equal(meta.tone, "mixed");
  assert.equal(meta.ariaLabel, "3 contact details: 2 email addresses and 1 phone number");
});
