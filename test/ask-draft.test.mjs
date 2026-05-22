import test from "node:test";
import assert from "node:assert/strict";

import { getAskDraftStatus, normalizeAskDraft, parseAskDraft, serializeAskDraft } from "../ask-draft.mjs";

test("normalizes ask drafts into compact saved questions", () => {
  const draft = normalizeAskDraft("  What   did I promise   Sam?  ", { now: new Date("2026-05-22T10:00:00Z") });

  assert.deepEqual(draft, {
    question: "What did I promise Sam?",
    updatedAt: "2026-05-22T10:00:00.000Z"
  });
});

test("ignores blank, malformed, and expired ask drafts", () => {
  const now = new Date("2026-05-22T10:00:00Z");

  assert.equal(normalizeAskDraft("   "), null);
  assert.equal(parseAskDraft("not json", { now }), null);
  assert.equal(parseAskDraft(JSON.stringify({ question: "Old question", updatedAt: "2026-05-18T09:59:00Z" }), { now }), null);
});

test("round trips active ask drafts through localStorage-safe JSON", () => {
  const saved = serializeAskDraft({ question: "Summarize launch blockers", updatedAt: "2026-05-22T09:00:00Z" });

  assert.deepEqual(parseAskDraft(saved, { now: new Date("2026-05-22T10:00:00Z") }), {
    question: "Summarize launch blockers",
    updatedAt: "2026-05-22T09:00:00.000Z"
  });
});

test("builds accessible draft status copy", () => {
  assert.deepEqual(getAskDraftStatus(null), {
    visible: false,
    text: "",
    clearLabel: "Clear question draft"
  });

  assert.deepEqual(getAskDraftStatus({ question: "What changed?" }), {
    visible: true,
    text: "Question draft saved on this device",
    clearLabel: "Clear saved Ask Keeply draft: What changed?"
  });
});
