import test from "node:test";
import assert from "node:assert/strict";

import { getItemTravelMeta } from "../item-travel-meta.mjs";

test("detects flight cues from gates and boarding details", () => {
  const meta = getItemTravelMeta("Boarding pass for flight AS42 at gate C18.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Flight");
  assert.equal(meta.tone, "flight");
  assert.equal(meta.ariaLabel, "Contains a flight travel cue");
});

test("detects hotel and lodging cues", () => {
  const meta = getItemTravelMeta("Hotel check-in confirmation and room reservation for Friday.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Hotel");
  assert.equal(meta.tone, "hotel");
});

test("summarizes multiple travel cues", () => {
  const meta = getItemTravelMeta("Trip itinerary: flight DL9, hotel booking, and rental car pickup.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "4 travel");
  assert.equal(meta.tone, "multiple");
  assert.equal(meta.ariaLabel, "Contains 4 travel cues");
});

test("ignores common non-travel terminal and gate phrases", () => {
  assert.equal(getItemTravelMeta("Run terminal command after gate review passes.").available, false);
  assert.equal(getItemTravelMeta("Send check-in recap after the weekly sync.").available, false);
});

test("returns empty metadata for blank text", () => {
  assert.deepEqual(getItemTravelMeta(""), { available: false, label: "", ariaLabel: "", tone: "" });
});
