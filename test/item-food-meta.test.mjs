import test from "node:test";
import assert from "node:assert/strict";

import { getItemFoodMeta } from "../item-food-meta.mjs";

test("detects grocery and shopping-list cues", () => {
  const meta = getItemFoodMeta("Grocery list: pick up milk, eggs, bread, and pantry staples.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Groceries");
  assert.equal(meta.tone, "grocery");
  assert.equal(meta.ariaLabel, "Contains a groceries food cue");
});

test("detects recipe preparation cues", () => {
  const meta = getItemFoodMeta("Recipe draft: preheat oven, simmer sauce, and bake for 20 minutes.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Recipe");
  assert.equal(meta.tone, "recipe");
});

test("summarizes multiple food cues", () => {
  const meta = getItemFoodMeta("Meal prep plan: grocery run for ingredients, recipe notes, and dinner reservation backup.");

  assert.equal(meta.available, true);
  assert.equal(meta.label, "4 food");
  assert.equal(meta.tone, "multiple");
  assert.equal(meta.ariaLabel, "Contains 4 food cues");
});

test("ignores common non-food menu and delivery phrases", () => {
  assert.equal(getItemFoodMeta("Open the browser menu and check delivery pipeline status.").available, false);
  assert.equal(getItemFoodMeta("Recipe for success kickoff and marketing runbook.").available, false);
});

test("returns empty metadata for blank text", () => {
  assert.deepEqual(getItemFoodMeta(""), { available: false, label: "", ariaLabel: "", tone: "" });
});
