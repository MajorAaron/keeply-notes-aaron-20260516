import assert from "node:assert/strict";
import { test } from "node:test";
import { getTaskChecklistMeta } from "../task-checklist-meta.mjs";

test("returns unavailable metadata when details have no checklist rows", () => {
  assert.deepEqual(getTaskChecklistMeta("Call the vet\nBring paperwork"), {
    available: false,
    checked: 0,
    total: 0,
    label: "",
    ariaLabel: "No checklist items"
  });
});

test("counts checked and unchecked markdown checklist rows", () => {
  assert.deepEqual(getTaskChecklistMeta("- [x] Draft\n- [ ] Review\n- [X] Send"), {
    available: true,
    checked: 2,
    total: 3,
    label: "2/3 checked",
    ariaLabel: "2 of 3 checklist items checked"
  });
});

test("accepts compact checklist rows without list bullets", () => {
  assert.deepEqual(getTaskChecklistMeta("[ ] Pack charger\n[x] Pack cable"), {
    available: true,
    checked: 1,
    total: 2,
    label: "1/2 checked",
    ariaLabel: "1 of 2 checklist items checked"
  });
});

test("uses singular aria copy for one checklist item", () => {
  assert.deepEqual(getTaskChecklistMeta("* [ ] Buy lemons"), {
    available: true,
    checked: 0,
    total: 1,
    label: "0/1 checked",
    ariaLabel: "0 of 1 checklist item checked"
  });
});
