import test from "node:test";
import assert from "node:assert/strict";

import { extractTaskScheduledTime, getTaskScheduledTimeMeta } from "../task-scheduled-time-meta.mjs";

test("hides scheduled time metadata when a task has no explicit time", () => {
  assert.deepEqual(getTaskScheduledTimeMeta({ title: "Write launch notes", details: "Estimate 30m" }), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects meridiem times in task titles", () => {
  const meta = getTaskScheduledTimeMeta({ title: "Call Priya at 3:30pm", details: "" });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "3:30 PM");
  assert.equal(meta.ariaLabel, "Mentions scheduled time 3:30 PM");
});

test("detects contextual 24-hour times in task details", () => {
  const time = extractTaskScheduledTime("Prep room before 14:05 with projector");

  assert.deepEqual(time, {
    hour: 14,
    minute: 5,
    label: "2:05 PM",
    ariaLabel: "2:05 PM"
  });
});

test("detects noon and midnight schedule language", () => {
  assert.equal(getTaskScheduledTimeMeta({ title: "Submit forms by noon" }).label, "Noon");
  assert.equal(getTaskScheduledTimeMeta({ title: "Rotate keys at midnight" }).ariaLabel, "Mentions scheduled time midnight");
});

test("does not treat bare small numbers as scheduled times", () => {
  assert.equal(extractTaskScheduledTime("Review 3 draft options before launch"), null);
  assert.equal(extractTaskScheduledTime("Budget v2 and priority 1 followup"), null);
});
