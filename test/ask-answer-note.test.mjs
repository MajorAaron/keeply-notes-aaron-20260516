import test from "node:test";
import assert from "node:assert/strict";

import { buildAskAnswerCopyText, buildAskAnswerNote } from "../ask-answer-note.mjs";

test("builds a note from an Ask Keeply answer", () => {
  const note = buildAskAnswerNote(
    {
      title: "Best local match",
      answer: "Quarterly check-in has the decision notes.",
      nextStep: "Review the pinned note before standup.",
      sources: [{ type: "note", title: "Quarterly check-in" }]
    },
    { question: "What did I say about the check-in?", id: "note-1", now: "2026-05-20T08:00:00.000Z" }
  );

  assert.deepEqual(note, {
    id: "note-1",
    title: "Ask: What did I say about the check-in?",
    body:
      "Question\nWhat did I say about the check-in?\n\nAnswer\nQuarterly check-in has the decision notes.\n\nNext step\nReview the pinned note before standup.\n\nSources\n- note · Quarterly check-in",
    label: "ideas",
    color: "sky",
    pinned: false,
    status: "active",
    createdAt: "2026-05-20T08:00:00.000Z",
    updatedAt: "2026-05-20T08:00:00.000Z"
  });
});

test("falls back to answer title and default copy when answer text is missing", () => {
  const note = buildAskAnswerNote(
    { title: "Nothing active yet", sources: [{ type: "task", title: "" }] },
    { id: "note-2", now: new Date("2026-05-20T09:00:00.000Z"), label: "work", color: "mint" }
  );

  assert.equal(note.title, "Ask: Nothing active yet");
  assert.equal(note.label, "work");
  assert.equal(note.color, "mint");
  assert.match(note.body, /Answer\nNo answer was found in the active Keeply items\./);
  assert.match(note.body, /Sources\n- task · Untitled/);
});

test("truncates long question titles for card readability", () => {
  const longQuestion = "How should I summarize ".repeat(8);
  const note = buildAskAnswerNote({ answer: "Keep the summary short." }, { question: longQuestion, now: "2026-05-20T10:00:00.000Z" });

  assert.equal(note.title.length, 90);
  assert.ok(note.title.endsWith("…"));
  assert.match(note.body, /Question\nHow should I summarize/);
});

test("formats Ask Keeply answers for clipboard sharing", () => {
  const text = buildAskAnswerCopyText(
    {
      title: "Best local match",
      answer: "  Quarterly check-in has the decision notes.\n",
      nextStep: "Review the pinned note before standup.",
      sources: [
        { type: "note", title: "Quarterly check-in" },
        { type: "task", title: "Prep agenda" }
      ]
    },
    { question: "What did I say about the check-in?" }
  );

  assert.equal(
    text,
    "Best local match\n\nQuestion\nWhat did I say about the check-in?\n\nAnswer\nQuarterly check-in has the decision notes.\n\nNext step\nReview the pinned note before standup.\n\nSources\n- note · Quarterly check-in\n- task · Prep agenda"
  );
});

test("clipboard text falls back to useful answer copy", () => {
  const text = buildAskAnswerCopyText({}, { question: "" });

  assert.equal(text, "Keeply answer\n\nAnswer\nNo answer was found in the active Keeply items.");
});
