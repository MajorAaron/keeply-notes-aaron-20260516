import assert from "node:assert/strict";
import { test } from "node:test";
import { getComposerBodyMeta } from "../composer-body-meta.mjs";

test("hides empty composer body metadata with mode-specific copy", () => {
  assert.deepEqual(getComposerBodyMeta("   ", { mode: "task" }), {
    visible: false,
    label: "Task details are empty",
    title: "Start typing to see a quick draft summary"
  });
});

test("summarizes short note drafts with word and line counts", () => {
  assert.deepEqual(getComposerBodyMeta("Bring coffee\nWrite recap"), {
    visible: true,
    label: "4 words • 2 lines",
    title: "Note draft summary: 4 words • 2 lines"
  });
});

test("counts markdown checklist rows in task details", () => {
  assert.deepEqual(getComposerBodyMeta("- [ ] Draft slides\n- [x] Send agenda\nOwner: me", { mode: "task" }), {
    visible: true,
    label: "7 words • 3 lines • 2 checks",
    title: "Task detail summary: 7 words • 3 lines • 2 checks"
  });
});

test("adds reading time for longer note drafts", () => {
  const text = Array.from({ length: 221 }, (_, index) => `word${index}`).join(" ");
  const meta = getComposerBodyMeta(text, { mode: "note" });
  assert.equal(meta.visible, true);
  assert.equal(meta.label, "221 words • 2 min read");
  assert.equal(meta.title, "Note draft summary: 221 words • 2 min read");
});
