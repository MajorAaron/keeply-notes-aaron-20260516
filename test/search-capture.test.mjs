import test from "node:test";
import assert from "node:assert/strict";
import { getSearchCaptureDraft } from "../search-capture.mjs";

test("builds a note capture draft from an active notes search", () => {
  assert.deepEqual(getSearchCaptureDraft({ view: "active", label: "work", query: "  quarterly decision log  " }), {
    available: true,
    mode: "note",
    action: "Capture as note",
    title: "quarterly decision log",
    body: "quarterly decision log",
    label: "work",
    priority: "normal",
    dueAt: ""
  });
});

test("builds a task capture draft with lightweight priority and due hints", () => {
  assert.deepEqual(getSearchCaptureDraft({ view: "tasks", label: "home", query: "urgent call plumber today!" }), {
    available: true,
    mode: "task",
    action: "Capture as task",
    title: "urgent call plumber today",
    body: "",
    label: "home",
    priority: "high",
    dueAt: 0
  });

  assert.equal(getSearchCaptureDraft({ view: "tasks", query: "send recap tomorrow" }).dueAt, 1);
});

test("hides capture when there is no searchable query or no capture view", () => {
  assert.equal(getSearchCaptureDraft({ view: "active", query: "   " }).available, false);
  assert.equal(getSearchCaptureDraft({ view: "archive", query: "old note" }).available, false);
});

test("truncates long capture titles and falls back to Ideas label", () => {
  const draft = getSearchCaptureDraft({ view: "active", label: "all", query: "a".repeat(100) });

  assert.equal(draft.title.length, 80);
  assert.equal(draft.title.endsWith("..."), true);
  assert.equal(draft.label, "ideas");
});
