import test from "node:test";
import assert from "node:assert/strict";
import { getNavigationBadges } from "../navigation-badges.mjs";

test("counts rail badge items by view", () => {
  const badges = getNavigationBadges({
    notes: [
      { id: "active-note", status: "active" },
      { id: "archived-note", status: "archive" },
      { id: "trashed-note", status: "trash" }
    ],
    tasks: [
      { id: "open-task", status: "active", completed: false },
      { id: "done-task", status: "active", completed: true },
      { id: "archived-task", status: "archive", completed: true },
      { id: "trashed-task", status: "trash", completed: false }
    ]
  });

  assert.equal(badges.active.count, 1);
  assert.equal(badges.tasks.count, 1);
  assert.equal(badges.archive.count, 2);
  assert.equal(badges.trash.count, 2);
  assert.equal(badges.tasks.ariaLabel, "1 open task");
  assert.equal(badges.archive.ariaLabel, "2 archived items");
});

test("hides zero-count badges and caps long counts", () => {
  const notes = Array.from({ length: 105 }, (_, index) => ({ id: `note-${index}`, status: "active" }));
  const badges = getNavigationBadges({ notes, tasks: [] });

  assert.equal(badges.active.visible, true);
  assert.equal(badges.active.label, "99+");
  assert.equal(badges.tasks.visible, false);
  assert.equal(badges.tasks.label, "0");
});
