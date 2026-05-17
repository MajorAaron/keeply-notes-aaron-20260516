import test from "node:test";
import assert from "node:assert/strict";
import { buildViewPreferences, normalizeViewPreferences, parseViewPreferences } from "../view-preferences.mjs";

test("view preferences preserve valid workspace choices", () => {
  assert.deepEqual(
    normalizeViewPreferences({
      view: "tasks",
      label: "work",
      taskWindow: "overdue",
      compact: true,
      theme: "night"
    }),
    {
      view: "tasks",
      label: "work",
      taskWindow: "overdue",
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
      compact: "yes",
      theme: "blue"
    }),
    {
      view: "active",
      label: "all",
      taskWindow: "all",
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
      compact: true,
      theme: "night"
    }),
    {
      view: "archive",
      label: "personal",
      taskWindow: "today",
      compact: true,
      theme: "night"
    }
  );
});
