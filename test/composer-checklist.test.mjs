import test from "node:test";
import assert from "node:assert/strict";

import { insertChecklistMarker } from "../composer-checklist.mjs";

test("inserts a checklist marker into an empty draft", () => {
  assert.deepEqual(insertChecklistMarker("", 0, 0), {
    value: "- [ ] ",
    selectionStart: 6,
    selectionEnd: 6
  });
});

test("starts a new checklist line when the cursor is after existing text", () => {
  assert.deepEqual(insertChecklistMarker("Call Sam", 8, 8), {
    value: "Call Sam\n- [ ] ",
    selectionStart: 15,
    selectionEnd: 15
  });
});

test("splits an existing line without swallowing surrounding text", () => {
  assert.deepEqual(insertChecklistMarker("Before after", 7, 7), {
    value: "Before \n- [ ] \nafter",
    selectionStart: 14,
    selectionEnd: 14
  });
});

test("turns selected lines into checklist items", () => {
  assert.deepEqual(insertChecklistMarker("milk\nbread", 0, 10), {
    value: "- [ ] milk\n- [ ] bread",
    selectionStart: 0,
    selectionEnd: 22
  });
});

test("preserves indentation and existing checkbox lines", () => {
  assert.deepEqual(insertChecklistMarker("  milk\n- [x] paid\n* bread", 0, 25), {
    value: "  - [ ] milk\n- [x] paid\n- [ ] bread",
    selectionStart: 0,
    selectionEnd: 35
  });
});
