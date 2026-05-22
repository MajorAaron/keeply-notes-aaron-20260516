import test from "node:test";
import assert from "node:assert/strict";

import { getItemCodeMeta } from "../item-code-meta.mjs";

test("returns unavailable metadata when text has no code cues", () => {
  assert.deepEqual(getItemCodeMeta("Pick up coffee filters after lunch."), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects fenced or inline code references", () => {
  assert.deepEqual(getItemCodeMeta("Fix `const total = items.length` before shipping."), {
    available: true,
    label: "Code",
    ariaLabel: "Contains a code reference",
    tone: "code"
  });
});

test("detects code file references", () => {
  assert.deepEqual(getItemCodeMeta("Review app.js and release-updates.mjs changes."), {
    available: true,
    label: "Code",
    ariaLabel: "Contains a code reference",
    tone: "code"
  });
});

test("detects command-line references", () => {
  assert.deepEqual(getItemCodeMeta("Run npm test before deploy."), {
    available: true,
    label: "Cmd",
    ariaLabel: "Contains a command-line reference",
    tone: "command"
  });
});

test("summarizes mixed code and command cues", () => {
  assert.deepEqual(getItemCodeMeta("Update server.py then run python server.py locally."), {
    available: true,
    label: "2 code cues",
    ariaLabel: "Contains code and command references",
    tone: "mixed"
  });
});
