import test from "node:test";
import assert from "node:assert/strict";
import { buildNoteSharePayload, buildTaskSharePayload } from "../item-share.mjs";

test("builds a compact share payload for notes", () => {
  assert.deepEqual(
    buildNoteSharePayload({
      title: "  Quarterly check-in  ",
      body: "Bring the metric snapshot.\n\nInclude risks.",
      label: "work"
    }),
    {
      title: "Quarterly check-in",
      text: "Quarterly check-in\nLabel: Work\nBring the metric snapshot. Include risks."
    }
  );
});

test("mentions attached note images without embedding data URLs", () => {
  assert.equal(
    buildNoteSharePayload({
      title: "Moodboard",
      body: "",
      label: "ideas",
      image: { src: "data:image/png;base64,abc" }
    }).text,
    "Moodboard\nLabel: Ideas\nImage attached in Keeply."
  );
});

test("builds a task payload with status and metadata", () => {
  assert.deepEqual(
    buildTaskSharePayload({
      title: "Send check-in recap",
      details: "Include decisions and owners.",
      label: "work",
      priority: "high",
      dueAt: "2026-05-18",
      completed: false
    }),
    {
      title: "Send check-in recap",
      text: "[ ] Send check-in recap\nLabel: Work\nPriority: High\nDue: 2026-05-18\nInclude decisions and owners."
    }
  );
});

test("marks completed shared tasks", () => {
  assert.equal(
    buildTaskSharePayload({
      title: "Water the basil",
      completed: true
    }).text,
    "[x] Water the basil"
  );
});
