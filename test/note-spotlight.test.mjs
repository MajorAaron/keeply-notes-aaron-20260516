import test from "node:test";
import assert from "node:assert/strict";
import { getNoteSpotlight } from "../note-spotlight.mjs";

test("returns an empty spotlight when there are no active notes", () => {
  const spotlight = getNoteSpotlight([{ title: "Archived", status: "archive", updatedAt: "2026-05-01T00:00:00Z" }]);

  assert.equal(spotlight.available, false);
  assert.equal(spotlight.title, "No active notes yet");
  assert.equal(spotlight.buttonLabel, "Add note");
});

test("prefers the most recently updated pinned active note", () => {
  const spotlight = getNoteSpotlight([
    { title: "Newest plain", body: "Fresh but not pinned", status: "active", pinned: false, updatedAt: "2026-05-18T10:00:00Z" },
    { title: "Old pin", body: "Older pinned note", status: "active", pinned: true, updatedAt: "2026-05-16T10:00:00Z" },
    { title: "Fresh pin", body: "Important pinned note", status: "active", pinned: true, updatedAt: "2026-05-17T10:00:00Z" }
  ]);

  assert.equal(spotlight.available, true);
  assert.equal(spotlight.kicker, "Pinned note");
  assert.equal(spotlight.title, "Fresh pin");
  assert.equal(spotlight.buttonLabel, "Show pinned");
  assert.equal(spotlight.pinned, true);
  assert.equal(spotlight.query, "Fresh pin");
});

test("falls back to the most recent active note and normalizes summary text", () => {
  const spotlight = getNoteSpotlight([
    { title: "Earlier", body: "First note", status: "active", pinned: false, updatedAt: "2026-05-16T10:00:00Z" },
    { title: "Later", body: "Line one\n\nline two", status: "active", pinned: false, updatedAt: "2026-05-18T10:00:00Z" }
  ]);

  assert.equal(spotlight.kicker, "Recent note");
  assert.equal(spotlight.title, "Later");
  assert.equal(spotlight.summary, "Line one line two");
  assert.equal(spotlight.buttonLabel, "Show note");
});

test("truncates long note bodies for the mobile card", () => {
  const longBody = "A".repeat(140);
  const spotlight = getNoteSpotlight([{ title: "Long", body: longBody, status: "active", updatedAt: "2026-05-18T10:00:00Z" }]);

  assert.equal(spotlight.summary.length, 96);
  assert.ok(spotlight.summary.endsWith("…"));
});
