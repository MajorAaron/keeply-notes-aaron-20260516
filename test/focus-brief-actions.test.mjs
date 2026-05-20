import test from "node:test";
import assert from "node:assert/strict";

import { getFocusBriefItemAction, hydrateFocusBriefActions } from "../focus-brief-actions.mjs";

const context = {
  tasks: [
    { id: "task-1", title: "Send check-in recap", label: "work" },
    { id: "task-2", title: "Buy coffee filters", label: "home" }
  ],
  notes: [{ id: "note-1", title: "Quarterly check-in", label: "work" }]
};

test("matches focus brief items to task sources by title", () => {
  const action = getFocusBriefItemAction({ title: "Send check-in recap", action: "Do it before standup." }, context);

  assert.deepEqual(action, {
    available: true,
    source: { id: "task-1", type: "task", title: "Send check-in recap", label: "work" },
    label: "Open task",
    ariaLabel: "Open task: Send check-in recap"
  });
});

test("matches focus brief items to note sources from action copy", () => {
  const action = getFocusBriefItemAction({ title: "Review pinned context", action: "Use Quarterly check-in to prep decisions." }, context);

  assert.equal(action.available, true);
  assert.equal(action.label, "Open note");
  assert.deepEqual(action.source, { id: "note-1", type: "note", title: "Quarterly check-in", label: "work" });
});

test("uses explicit focus source ids when available", () => {
  const action = getFocusBriefItemAction({ title: "Coffee", sourceId: "task-2", sourceType: "task", sourceTitle: "Buy coffee filters" }, context);

  assert.equal(action.available, true);
  assert.equal(action.ariaLabel, "Open task: Buy coffee filters");
  assert.deepEqual(action.source, { id: "task-2", type: "task", title: "Buy coffee filters" });
});

test("does not match an empty focus item to the first source", () => {
  const action = getFocusBriefItemAction({ title: "", action: "Pick a small next step." }, context);

  assert.equal(action.available, false);
});

test("hydrates brief items with source actions without mutating unmatched items", () => {
  const brief = hydrateFocusBriefActions(
    {
      title: "Start here",
      items: [
        { title: "Send check-in recap", action: "First." },
        { title: "Loose idea", action: "No matching item." }
      ]
    },
    context
  );

  assert.equal(brief.items[0].sourceAction.label, "Open task");
  assert.deepEqual(brief.items[0].source, { id: "task-1", type: "task", title: "Send check-in recap", label: "work" });
  assert.equal(brief.items[1].source, undefined);
  assert.equal(brief.items[1].sourceAction, undefined);
});
