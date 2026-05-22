import test from "node:test";
import assert from "node:assert/strict";

import { getItemAmountMeta } from "../item-amount-meta.mjs";

test("detects symbol currency amounts and compacts labels", () => {
  assert.deepEqual(getItemAmountMeta("Invoice Ada for $42 after lunch"), {
    available: true,
    label: "$42",
    ariaLabel: "Contains amount $42",
    tone: "amount"
  });

  assert.equal(getItemAmountMeta("Venue deposit is €1,250.50").label, "€1.3k");
  assert.equal(getItemAmountMeta("Reimburse $12.50 for snacks").label, "$12.50");
  assert.equal(getItemAmountMeta("Budget hold £1200").tone, "large");
});

test("detects currency codes before and after amounts", () => {
  assert.equal(getItemAmountMeta("Reimburse USD 75 for supplies").label, "$75");
  assert.equal(getItemAmountMeta("Flights 320 cad").label, "CA$320");
  assert.equal(getItemAmountMeta("Backup quote is 90 GBP").label, "£90");
});

test("summarizes multiple unique amounts", () => {
  assert.deepEqual(getItemAmountMeta("Pay $18 for lunch and $42 for materials; lunch was $18"), {
    available: true,
    label: "2 amounts",
    ariaLabel: "Contains 2 amounts including $18",
    tone: "multiple",
    totalLabel: "$60"
  });
});

test("ignores unrelated numbers and invalid amounts", () => {
  assert.deepEqual(getItemAmountMeta("Call room 400 at 3pm about sprint 12"), {
    available: false,
    label: "",
    ariaLabel: ""
  });

  assert.deepEqual(getItemAmountMeta(""), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});
