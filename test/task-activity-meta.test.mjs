import test from "node:test";
import assert from "node:assert/strict";

import { getTaskActivityMeta } from "../task-activity-meta.mjs";

const NOW = "2026-05-20T15:30:00.000Z";

test("task activity meta labels tasks updated today", () => {
  const meta = getTaskActivityMeta({ updatedAt: "2026-05-20T08:15:00.000Z", completed: false }, { now: NOW });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Updated today");
  assert.equal(meta.ariaLabel, "Task updated today");
  assert.equal(meta.tone, "fresh");
});

test("task activity meta calls out stale open tasks", () => {
  const meta = getTaskActivityMeta({ updatedAt: "2026-05-10T20:00:00.000Z", completed: false }, { now: NOW });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Stale 10d");
  assert.equal(meta.ariaLabel, "Task last updated 10 days ago");
  assert.equal(meta.tone, "stale");
});

test("task activity meta uses completed copy for finished tasks", () => {
  const meta = getTaskActivityMeta({ updatedAt: "2026-05-19T20:00:00.000Z", completed: true }, { now: NOW });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Done yesterday");
  assert.equal(meta.ariaLabel, "Task completed yesterday");
  assert.equal(meta.tone, "done");
});

test("task activity meta falls back to created date and hides invalid dates", () => {
  const fallback = getTaskActivityMeta({ createdAt: "2026-05-18T10:00:00.000Z" }, { now: NOW });
  const missing = getTaskActivityMeta({ updatedAt: "not-a-date" }, { now: NOW });

  assert.equal(fallback.label, "Updated 2d ago");
  assert.equal(fallback.tone, "recent");
  assert.equal(missing.available, false);
});
