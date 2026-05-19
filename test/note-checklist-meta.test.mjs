import assert from "node:assert/strict";
import { test } from "node:test";
import { getNoteChecklistMeta } from "../note-checklist-meta.mjs";

test("returns unavailable metadata when a note has no checklist rows", () => {
  assert.deepEqual(getNoteChecklistMeta("Meeting notes\nBring slides"), {
    available: false,
    checked: 0,
    total: 0,
    label: "",
    ariaLabel: "No note checklist items"
  });
});

test("counts checked and unchecked markdown checklist rows in note bodies", () => {
  assert.deepEqual(getNoteChecklistMeta("- [x] Draft intro\n- [ ] Add screenshot\n- [X] Send"), {
    available: true,
    checked: 2,
    total: 3,
    label: "2/3 checked",
    ariaLabel: "2 of 3 note checklist items checked"
  });
});

test("accepts compact checklist rows without bullets", () => {
  assert.deepEqual(getNoteChecklistMeta("[ ] Passport\n[x] Charger"), {
    available: true,
    checked: 1,
    total: 2,
    label: "1/2 checked",
    ariaLabel: "1 of 2 note checklist items checked"
  });
});

test("uses singular aria copy for one note checklist item", () => {
  assert.deepEqual(getNoteChecklistMeta("* [ ] Book table"), {
    available: true,
    checked: 0,
    total: 1,
    label: "0/1 checked",
    ariaLabel: "0 of 1 note checklist item checked"
  });
});
