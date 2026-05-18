import test from "node:test";
import assert from "node:assert/strict";

import { getAskSuggestions } from "../ask-suggestions.mjs";

test("suggests urgent task and pinned note questions first", () => {
  const suggestions = getAskSuggestions(
    [
      {
        id: "task-1",
        type: "task",
        title: "Renew passport",
        label: "personal",
        priority: "high",
        dueAt: "2026-05-17",
        completed: false,
        updatedAt: "2026-05-17T09:00:00.000Z"
      },
      {
        id: "note-1",
        type: "note",
        title: "Trip planning",
        label: "personal",
        pinned: true,
        updatedAt: "2026-05-17T08:00:00.000Z"
      }
    ],
    { now: "2026-05-18T12:00:00.000Z" }
  );

  assert.deepEqual(suggestions, [
    "Which overdue task should I handle first?",
    "What did I note about Trip planning?",
    "What is saved under Personal?"
  ]);
});

test("falls back to today and recent note prompts without duplicates", () => {
  const suggestions = getAskSuggestions(
    [
      {
        id: "task-1",
        type: "task",
        title: "Draft project plan",
        label: "work",
        priority: "normal",
        dueAt: "2026-05-18",
        completed: false,
        updatedAt: "2026-05-18T09:00:00.000Z"
      },
      {
        id: "note-1",
        type: "note",
        title: "Launch ideas",
        label: "ideas",
        pinned: false,
        updatedAt: "2026-05-18T08:00:00.000Z"
      }
    ],
    { now: "2026-05-18T12:00:00.000Z" }
  );

  assert.deepEqual(suggestions, ["What should I focus on today?", "Summarize Launch ideas.", "What needs a follow-up?"]);
});

test("limits suggestions and cleans long item titles", () => {
  const suggestions = getAskSuggestions(
    [
      {
        id: "task-1",
        type: "task",
        title: "A very long task title that should be trimmed neatly for a compact chip",
        label: "home",
        priority: "normal",
        dueAt: "",
        completed: false,
        updatedAt: "2026-05-18T09:00:00.000Z"
      },
      {
        id: "task-2",
        type: "task",
        title: "Buy groceries",
        label: "home",
        priority: "normal",
        dueAt: "",
        completed: false,
        updatedAt: "2026-05-18T08:00:00.000Z"
      }
    ],
    { max: 2, now: "2026-05-18T12:00:00.000Z" }
  );

  assert.deepEqual(suggestions, ["What is the next step for A very long task title that shoul…?", "What is saved under Home?"]);
});

test("returns a starter prompt when there is no active context", () => {
  assert.deepEqual(getAskSuggestions([], { now: "2026-05-18T12:00:00.000Z" }), ["What should I capture first?"]);
});
