import test from "node:test";
import assert from "node:assert/strict";

import { buildTaskCaptureFields } from "../task-capture-hints.mjs";

test("buildTaskCaptureFields strips single-task title hints and applies metadata", () => {
  const task = buildTaskCaptureFields(
    {
      title: "Call dentist tomorrow !high @home",
      details: "Ask about appointment slots",
      label: "ideas",
      priority: "normal",
      dueAt: ""
    },
    { today: "2026-05-18" }
  );

  assert.equal(task.title, "Call dentist");
  assert.equal(task.details, "Ask about appointment slots");
  assert.equal(task.label, "home");
  assert.equal(task.priority, "high");
  assert.equal(task.dueAt, "2026-05-19");
  assert.equal(task.usedHints, true);
});

test("buildTaskCaptureFields preserves composer defaults when no hints are present", () => {
  const task = buildTaskCaptureFields({
    title: "Draft launch recap",
    details: "Include owners and dates",
    label: "work",
    priority: "low",
    dueAt: "2026-06-01"
  });

  assert.deepEqual(task, {
    title: "Draft launch recap",
    details: "Include owners and dates",
    label: "work",
    priority: "low",
    dueAt: "2026-06-01",
    usedHints: false
  });
});

test("buildTaskCaptureFields applies detail-first titles before parsing hints", () => {
  const task = buildTaskCaptureFields(
    {
      title: "",
      details: "- Water basil today #low #home\nMove it to the sunny window.",
      label: "ideas",
      priority: "normal",
      dueAt: ""
    },
    { today: "2026-05-18" }
  );

  assert.equal(task.title, "Water basil");
  assert.equal(task.details, "- Water basil today #low #home\nMove it to the sunny window.");
  assert.equal(task.label, "home");
  assert.equal(task.priority, "low");
  assert.equal(task.dueAt, "2026-05-18");
});

test("buildTaskCaptureFields returns an empty title for blank drafts", () => {
  const task = buildTaskCaptureFields({ title: "", details: "", label: "missing", priority: "urgent", dueAt: null });

  assert.equal(task.title, "");
  assert.equal(task.label, "ideas");
  assert.equal(task.priority, "normal");
  assert.equal(task.dueAt, "");
  assert.equal(task.usedHints, false);
});
