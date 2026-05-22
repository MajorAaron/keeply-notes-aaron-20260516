import test from "node:test";
import assert from "node:assert/strict";

import { extractTaskRepeatCue, getTaskRepeatMeta } from "../task-repeat-meta.mjs";

test("hides repeat metadata when a task has no recurrence language", () => {
  assert.deepEqual(getTaskRepeatMeta({ title: "Write launch notes", details: "Next steps" }), {
    available: false,
    label: "",
    ariaLabel: "",
    tone: ""
  });
});

test("detects daily repeat language in task titles", () => {
  const meta = getTaskRepeatMeta({ title: "Water the basil every day", details: "" });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Daily");
  assert.equal(meta.ariaLabel, "Mentions daily repeat");
  assert.equal(meta.tone, "daily");
});

test("detects weekly weekday repeat cues", () => {
  assert.deepEqual(extractTaskRepeatCue("Send payroll reminder every Friday"), {
    key: "weekly",
    label: "Weekly",
    aria: "weekly repeat"
  });
});

test("detects monthly and yearly repeat language", () => {
  assert.equal(getTaskRepeatMeta({ title: "Pay rent monthly" }).label, "Monthly");
  assert.equal(getTaskRepeatMeta({ title: "Renew domain annually" }).label, "Yearly");
});

test("summarizes multiple repeat cues and hides completed task repeats", () => {
  assert.equal(getTaskRepeatMeta({ title: "Repeat daily and monthly" }).label, "Repeats");
  assert.equal(getTaskRepeatMeta({ title: "Water plants daily", completed: true }).available, false);
});

test("avoids generic cadence words without a repeat cue", () => {
  assert.equal(extractTaskRepeatCue("Prepare weekly report notes"), null);
  assert.equal(extractTaskRepeatCue("Monthly planning ideas"), null);
});
