import test from "node:test";
import assert from "node:assert/strict";

import { getTaskBlockerMeta } from "../task-blocker-meta.mjs";

test("task blocker meta highlights blocked task copy", () => {
  const meta = getTaskBlockerMeta({ title: "Launch migration", details: "Blocked by API review", completed: false });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Blocked");
  assert.equal(meta.tone, "blocked");
  assert.equal(meta.ariaLabel, "Task is marked blocked");
});

test("task blocker meta highlights waiting task copy", () => {
  const meta = getTaskBlockerMeta({ title: "Vendor form", details: "Waiting on legal", completed: false });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Waiting");
  assert.equal(meta.tone, "waiting");
});

test("task blocker meta highlights dependency copy", () => {
  const meta = getTaskBlockerMeta({ title: "Ship report", details: "Depends on finance numbers", completed: false });

  assert.equal(meta.available, true);
  assert.equal(meta.label, "Depends");
  assert.equal(meta.tone, "waiting");
});

test("task blocker meta stays hidden for completed or ordinary tasks", () => {
  assert.equal(getTaskBlockerMeta({ title: "Blocked but done", completed: true }).available, false);
  assert.equal(getTaskBlockerMeta({ title: "Write recap", details: "Send notes", completed: false }).available, false);
});
