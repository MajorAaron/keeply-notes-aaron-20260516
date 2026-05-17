import test from "node:test";
import assert from "node:assert/strict";
import { formatLabelCount, getLabelCounts } from "../label-counts.mjs";

test("label counts summarize all known labels", () => {
  assert.deepEqual(
    getLabelCounts([
      { label: "work" },
      { label: "home" },
      { label: "work" },
      { label: "ideas" },
      { label: "unknown" },
      {}
    ]),
    {
      all: 6,
      work: 2,
      home: 1,
      ideas: 1,
      personal: 0
    }
  );
});

test("label count formatter caps long counts for compact chips", () => {
  assert.equal(formatLabelCount(0), "0");
  assert.equal(formatLabelCount(42), "42");
  assert.equal(formatLabelCount(125), "99+");
  assert.equal(formatLabelCount(Number.NaN), "0");
});
