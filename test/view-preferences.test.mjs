import test from "node:test";
import assert from "node:assert/strict";
import { buildViewPreferences, normalizeViewPreferences, parseViewPreferences } from "../view-preferences.mjs";

test("view preferences preserve valid workspace choices", () => {
  assert.deepEqual(
    normalizeViewPreferences({
      view: "tasks",
      label: "work",
      taskWindow: "tomorrow",
      taskPriority: "high",
      taskCompletion: "done",
      noteColor: "mint",
      notePin: "pinned",
      compact: true,
      theme: "night"
    }),
    {
      view: "tasks",
      label: "work",
      taskWindow: "tomorrow",
      taskPriority: "high",
      taskCompletion: "done",
      noteColor: "mint",
      notePin: "pinned",
      compact: true,
      theme: "night"
    }
  );
});

test("view preferences fall back from unknown values", () => {
  assert.deepEqual(
    normalizeViewPreferences({
      view: "settings",
      label: "errands",
      taskWindow: "later",
      taskPriority: "urgent",
      taskCompletion: "finished",
      noteColor: "purple",
      notePin: "starred",
      compact: "yes",
      theme: "blue"
    }),
    {
      view: "active",
      label: "all",
      taskWindow: "all",
      taskPriority: "all",
      taskCompletion: "all",
      noteColor: "all",
      notePin: "all",
      compact: false,
      theme: "morning"
    }
  );
});

test("view preferences parse malformed storage safely", () => {
  assert.deepEqual(parseViewPreferences("{nope"), {
    view: "active",
    label: "all",
    taskWindow: "all",
    taskPriority: "all",
    taskCompletion: "all",
    noteColor: "all",
    notePin: "all",
    compact: false,
    theme: "morning"
  });
});

test("view preferences build from app state", () => {
  assert.deepEqual(
    buildViewPreferences({
      view: "archive",
      label: "personal",
      taskWindow: "today",
      taskPriority: "low",
      taskCompletion: "open",
      noteColor: "rose",
      notePin: "unpinned",
      compact: true,
      theme: "night"
    }),
    {
      view: "archive",
      label: "personal",
      taskWindow: "today",
      taskPriority: "low",
      taskCompletion: "open",
      noteColor: "rose",
      notePin: "unpinned",
      compact: true,
      theme: "night"
    }
  );
});
