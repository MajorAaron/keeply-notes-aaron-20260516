import test from "node:test";
import assert from "node:assert/strict";
import { deriveTaskTitleFromDetails, getTaskCaptureTitle } from "../task-title.mjs";

test("uses explicit task titles unchanged after whitespace cleanup", () => {
  assert.equal(getTaskCaptureTitle({ title: "  Send recap  ", details: "Include owners" }), "Send recap");
});

test("derives a task title from the first meaningful details line", () => {
  assert.equal(
    getTaskCaptureTitle({ title: "", details: "\n  - Call Sam about the venue\nBring sample dates." }),
    "Call Sam about the venue"
  );
});

test("cleans checklist and numbered prefixes from derived task titles", () => {
  assert.equal(getTaskCaptureTitle({ details: "[ ] Draft the follow-up email" }), "Draft the follow-up email");
  assert.equal(getTaskCaptureTitle({ details: "2. Pick up coffee filters" }), "Pick up coffee filters");
});

test("truncates long derived task titles at a readable word boundary", () => {
  const title = deriveTaskTitleFromDetails(
    "This is a very long task detail that should become a compact scannable mobile task title without swallowing the whole paragraph",
    { limit: 54 }
  );

  assert.equal(title, "This is a very long task detail that should become a…");
});

test("returns an empty title when no task text is available", () => {
  assert.equal(getTaskCaptureTitle({ title: "", details: "" }), "");
});
