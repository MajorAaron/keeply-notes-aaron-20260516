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

test("buildTaskCaptureFields applies next week title hints", () => {
  const task = buildTaskCaptureFields(
    {
      title: "Prep board update next week @work",
      details: "",
      label: "ideas",
      priority: "normal",
      dueAt: ""
    },
    { today: "2026-05-18" }
  );

  assert.equal(task.title, "Prep board update");
  assert.equal(task.label, "work");
  assert.equal(task.dueAt, "2026-05-25");
  assert.equal(task.usedHints, true);
});


test("buildTaskCaptureFields applies weekend title hints", () => {
  assert.deepEqual(
    buildTaskCaptureFields(
      { title: "Pack picnic basket this weekend @home", details: "" },
      { today: "2026-05-18" }
    ),
    {
      title: "Pack picnic basket",
      details: "",
      label: "home",
      priority: "normal",
      dueAt: "2026-05-23",
      usedHints: true
    }
  );
});

test("buildTaskCaptureFields applies weekday title hints", () => {
  const task = buildTaskCaptureFields(
    {
      title: "Send invoices Friday @work",
      details: "",
      label: "ideas",
      priority: "normal",
      dueAt: ""
    },
    { today: "2026-05-18" }
  );

  assert.deepEqual(task, {
    title: "Send invoices",
    details: "",
    label: "work",
    priority: "normal",
    dueAt: "2026-05-22",
    usedHints: true
  });

  assert.deepEqual(
    buildTaskCaptureFields(
      { title: "Draft launch notes next Friday @work", details: "", label: "ideas", priority: "normal", dueAt: "2026-05-19" },
      { today: "2026-05-18" }
    ),
    {
      title: "Draft launch notes",
      details: "",
      label: "work",
      priority: "normal",
      dueAt: "2026-05-29",
      usedHints: true
    }
  );
});

test("buildTaskCaptureFields applies same-day evening title hints", () => {
  assert.deepEqual(
    buildTaskCaptureFields(
      { title: "Send status update end of day @work", details: "", label: "ideas", dueAt: "2026-05-21" },
      { today: "2026-05-18" }
    ),
    {
      title: "Send status update",
      details: "",
      label: "work",
      priority: "normal",
      dueAt: "2026-05-18",
      usedHints: true
    }
  );
});

test("buildTaskCaptureFields applies relative duration title hints", () => {
  const task = buildTaskCaptureFields(
    { title: "Review vendor options in 2 weeks @work", details: "", label: "ideas", priority: "normal", dueAt: "2026-05-19" },
    { today: "2026-05-18" }
  );

  assert.deepEqual(task, {
    title: "Review vendor options",
    details: "",
    label: "work",
    priority: "normal",
    dueAt: "2026-06-01",
    usedHints: true
  });
});

test("buildTaskCaptureFields applies no-date title hints over selected due presets", () => {
  const task = buildTaskCaptureFields({
    title: "Inventory freezer someday @home",
    details: "",
    label: "work",
    priority: "high",
    dueAt: "2026-05-18"
  });

  assert.deepEqual(task, {
    title: "Inventory freezer",
    details: "",
    label: "home",
    priority: "high",
    dueAt: "",
    usedHints: true
  });
});
