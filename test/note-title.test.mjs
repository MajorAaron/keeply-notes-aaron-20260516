import test from "node:test";
import assert from "node:assert/strict";
import { deriveNoteTitleFromBody, getNoteCaptureTitle } from "../note-title.mjs";

test("uses explicit note titles unchanged after whitespace cleanup", () => {
  assert.equal(getNoteCaptureTitle({ title: "  Project plan  ", body: "Body text" }), "Project plan");
});

test("derives a body-first note title from the first meaningful line", () => {
  assert.equal(
    getNoteCaptureTitle({ title: "", body: "\n  - Call Sam about the venue\nBring sample dates." }),
    "Call Sam about the venue"
  );
});

test("truncates long derived note titles at a readable word boundary", () => {
  const title = deriveNoteTitleFromBody(
    "This is a very long captured thought that should become a compact scannable mobile note title without swallowing the whole paragraph",
    { limit: 54 }
  );

  assert.equal(title, "This is a very long captured thought that should…");
});

test("falls back to image or untitled labels when no text is available", () => {
  assert.equal(getNoteCaptureTitle({ body: "", hasImage: true }), "Image note");
  assert.equal(getNoteCaptureTitle({ body: "" }), "Untitled");
});
