import test from "node:test";
import assert from "node:assert/strict";
import { buildComposerDraft, hasComposerDraftContent, normalizeComposerDraft } from "../composer-draft.mjs";

test("buildComposerDraft keeps valid note draft fields", () => {
  const draft = buildComposerDraft({
    mode: "note",
    title: "Quarterly check-in",
    body: "Bring metric notes.",
    label: "work",
    color: "sky",
    priority: "high",
    image: {
      src: "data:image/png;base64,abc",
      mime: "image/png",
      name: "chart.png",
      alt: "Chart",
      generated: false
    }
  });

  assert.equal(draft.mode, "note");
  assert.equal(draft.title, "Quarterly check-in");
  assert.equal(draft.label, "work");
  assert.equal(draft.color, "sky");
  assert.equal(draft.image.name, "chart.png");
  assert.equal(hasComposerDraftContent(draft), true);
});

test("normalizeComposerDraft sanitizes invalid values", () => {
  const draft = normalizeComposerDraft({
    mode: "weird",
    title: 42,
    body: null,
    label: "private",
    color: "purple",
    dueAt: "tomorrow",
    priority: "urgent",
    image: { src: "https://example.com/image.png" }
  });

  assert.deepEqual(draft, {
    mode: "note",
    title: "",
    body: "",
    label: "ideas",
    color: "sun",
    dueAt: "",
    priority: "normal",
    image: null
  });
  assert.equal(hasComposerDraftContent(draft), false);
});

test("task drafts do not carry note images", () => {
  const draft = normalizeComposerDraft({
    mode: "task",
    title: "Send recap",
    body: "Owners and decisions.",
    label: "work",
    dueAt: "2026-05-18",
    priority: "high",
    image: { src: "data:image/png;base64,abc" }
  });

  assert.equal(draft.mode, "task");
  assert.equal(draft.image, null);
  assert.equal(draft.dueAt, "2026-05-18");
  assert.equal(draft.priority, "high");
  assert.equal(hasComposerDraftContent(draft), true);
});
