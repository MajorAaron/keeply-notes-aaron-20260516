import test from "node:test";
import assert from "node:assert/strict";

import { getItemAttachmentMeta } from "../item-attachment-meta.mjs";

test("returns unavailable metadata when text has no attachment cues", () => {
  assert.deepEqual(getItemAttachmentMeta("Review the next steps after lunch."), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects PDF attachment references", () => {
  assert.deepEqual(getItemAttachmentMeta("Read vendor-contract.pdf before approval."), {
    available: true,
    label: "PDF",
    ariaLabel: "Contains a PDF attachment reference",
    tone: "pdf"
  });
});

test("detects document and spreadsheet cues", () => {
  assert.deepEqual(getItemAttachmentMeta("Attach the planning doc and budget sheet."), {
    available: true,
    label: "2 files",
    ariaLabel: "Contains 2 attachment types",
    tone: "multiple"
  });
});

test("detects presentation cues", () => {
  assert.deepEqual(getItemAttachmentMeta("Share the launch deck after design review."), {
    available: true,
    label: "Deck",
    ariaLabel: "Contains a presentation attachment reference",
    tone: "deck"
  });
});

test("falls back to a generic file badge for unknown attachments", () => {
  assert.deepEqual(getItemAttachmentMeta("Uploaded handoff-assets.zip to the shared folder."), {
    available: true,
    label: "File",
    ariaLabel: "Contains an attachment or file reference",
    tone: "file"
  });
});
