import assert from "node:assert/strict";
import test from "node:test";

import { getNoteActivityMeta } from "../note-activity-meta.mjs";

const now = "2026-05-20T12:00:00.000Z";

test("getNoteActivityMeta returns unavailable without timestamps", () => {
  assert.deepEqual(getNoteActivityMeta({}, { now }), {
    available: false,
    label: "",
    ariaLabel: "",
    tone: "fresh"
  });
});

test("getNoteActivityMeta labels created-only notes", () => {
  const meta = getNoteActivityMeta(
    {
      createdAt: "2026-05-19T08:00:00.000Z",
      updatedAt: "2026-05-19T08:00:00.000Z"
    },
    { now }
  );

  assert.equal(meta.label, "Created yesterday");
  assert.equal(meta.ariaLabel, "Note created yesterday");
  assert.equal(meta.tone, "recent");
});

test("getNoteActivityMeta labels edited notes", () => {
  const meta = getNoteActivityMeta(
    {
      createdAt: "2026-05-10T08:00:00.000Z",
      updatedAt: "2026-05-20T08:00:00.000Z"
    },
    { now }
  );

  assert.equal(meta.label, "Edited today");
  assert.equal(meta.ariaLabel, "Note edited today");
  assert.equal(meta.tone, "fresh");
});

test("getNoteActivityMeta calls out stale unpinned edited notes", () => {
  const meta = getNoteActivityMeta(
    {
      createdAt: "2026-04-28T08:00:00.000Z",
      updatedAt: "2026-05-01T08:00:00.000Z",
      pinned: false
    },
    { now }
  );

  assert.equal(meta.label, "Stale 19d");
  assert.equal(meta.ariaLabel, "Note last edited 19 days ago");
  assert.equal(meta.tone, "stale");
});

test("getNoteActivityMeta highlights pinned notes instead of stale status", () => {
  const meta = getNoteActivityMeta(
    {
      createdAt: "2026-04-28T08:00:00.000Z",
      updatedAt: "2026-05-01T08:00:00.000Z",
      pinned: true
    },
    { now }
  );

  assert.equal(meta.label, "Pinned 19d ago");
  assert.equal(meta.ariaLabel, "Pinned note updated 19 days ago");
  assert.equal(meta.tone, "pinned");
});
