import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getCleanupSpotlight } from "../cleanup-spotlight.mjs";

const baseNote = {
  id: "note-1",
  title: "Archived roadmap",
  body: "Keep for later",
  label: "work",
  color: "sun",
  pinned: false,
  status: "archive",
  createdAt: "2026-05-10T10:00:00.000Z",
  updatedAt: "2026-05-12T10:00:00.000Z"
};

const baseTask = {
  id: "task-1",
  title: "Trash old receipt",
  details: "No longer needed",
  label: "home",
  priority: "low",
  dueAt: "2026-05-20",
  completed: true,
  status: "trash",
  createdAt: "2026-05-11T10:00:00.000Z",
  updatedAt: "2026-05-13T10:00:00.000Z"
};

describe("getCleanupSpotlight", () => {
  it("stays hidden outside archive and trash", () => {
    const spotlight = getCleanupSpotlight({ view: "active", notes: [baseNote], tasks: [baseTask] });

    assert.equal(spotlight.visible, false);
    assert.equal(spotlight.available, false);
  });

  it("highlights the most recently updated archived item with counts", () => {
    const spotlight = getCleanupSpotlight({
      view: "archive",
      notes: [baseNote, { ...baseNote, id: "note-2", title: "Older note", updatedAt: "2026-05-09T10:00:00.000Z" }],
      tasks: [{ ...baseTask, id: "task-2", title: "Archived task", status: "archive", updatedAt: "2026-05-14T10:00:00.000Z" }]
    });

    assert.equal(spotlight.visible, true);
    assert.equal(spotlight.available, true);
    assert.equal(spotlight.id, "task-2");
    assert.equal(spotlight.type, "task");
    assert.equal(spotlight.title, "Archived task");
    assert.equal(spotlight.buttonLabel, "Review task");
    assert.match(spotlight.kicker, /Latest archived task/);
    assert.match(spotlight.summary, /2 notes · 1 task in archive/);
  });

  it("uses trash-specific empty and item copy", () => {
    const empty = getCleanupSpotlight({ view: "trash", notes: [], tasks: [] });
    assert.equal(empty.visible, true);
    assert.equal(empty.available, false);
    assert.equal(empty.title, "Trash is empty");

    const spotlight = getCleanupSpotlight({ view: "trash", notes: [], tasks: [baseTask] });
    assert.equal(spotlight.kicker, "Latest deleted task");
    assert.equal(spotlight.title, "Trash old receipt");
    assert.match(spotlight.summary, /Home · done · low priority · due 2026-05-20/);
    assert.match(spotlight.summary, /0 notes · 1 task in trash/);
  });
});
