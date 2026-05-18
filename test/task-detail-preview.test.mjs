import test from "node:test";
import assert from "node:assert/strict";

import { buildTaskDetailPreview } from "../task-detail-preview.mjs";

test("keeps short task details unchanged", () => {
  assert.deepEqual(buildTaskDetailPreview("Email the agenda before noon."), {
    text: "Email the agenda before noon.",
    expandedText: "Email the agenda before noon.",
    isTruncated: false
  });
});

test("collapses long task details at a word boundary", () => {
  const details = "Collect the screenshots, add short captions, confirm the mobile layout, and send the update to the launch channel.";

  assert.deepEqual(buildTaskDetailPreview(details, { maxLength: 58 }), {
    text: "Collect the screenshots, add short captions, confirm the…",
    expandedText: details,
    isTruncated: true
  });
});

test("normalizes whitespace before measuring task details", () => {
  const details = "First line with context.\n\nSecond line    keeps going with enough words for truncation.";

  assert.deepEqual(buildTaskDetailPreview(details, { maxLength: 48 }), {
    text: "First line with context. Second line keeps going…",
    expandedText: "First line with context. Second line keeps going with enough words for truncation.",
    isTruncated: true
  });
});

test("uses the friendly empty task detail fallback", () => {
  assert.deepEqual(buildTaskDetailPreview("   "), {
    text: "No extra details",
    expandedText: "No extra details",
    isTruncated: false
  });
});
