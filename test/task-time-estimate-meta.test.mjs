import test from "node:test";
import assert from "node:assert/strict";

import { extractTaskEstimateMinutes, getTaskTimeEstimateMeta } from "../task-time-estimate-meta.mjs";

test("task time estimate meta highlights minute estimates", () => {
  const meta = getTaskTimeEstimateMeta({ title: "Draft launch note 25m", details: "" });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "25m");
  assert.equal(meta.ariaLabel, "Estimated task time 25 minutes");
});

test("task time estimate meta formats hour and minute estimates", () => {
  const meta = getTaskTimeEstimateMeta({ title: "Plan workshop", details: "Estimate 1h 30m with review" });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "1h 30m");
  assert.equal(meta.ariaLabel, "Estimated task time 1 hour 30 minutes");
});

test("task time estimate meta supports decimal hour estimates", () => {
  const meta = getTaskTimeEstimateMeta({ title: "Deep work", details: "Need 1.5 hours" });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "1h 30m");
});

test("task time estimate meta stays hidden without a reasonable estimate", () => {
  assert.equal(getTaskTimeEstimateMeta({ title: "Review invoice 2026", details: "" }).available, false);
  assert.equal(getTaskTimeEstimateMeta({ title: "Marathon", details: "estimate 48h" }).available, false);
  assert.equal(getTaskTimeEstimateMeta({ title: "", details: "" }).available, false);
});

test("extract task estimate minutes returns the first valid estimate", () => {
  assert.equal(extractTaskEstimateMinutes("Sweep inbox 15 minutes then review"), 15);
  assert.equal(extractTaskEstimateMinutes("Workshop 2 hrs 5 mins"), 125);
});
