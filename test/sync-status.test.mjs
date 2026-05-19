import test from "node:test";
import assert from "node:assert/strict";
import { getSyncStatusView } from "../sync-status.mjs";

test("returns synced status copy", () => {
  assert.deepEqual(getSyncStatusView("synced"), {
    label: "Synced",
    title: "Your Keeply data is synced.",
    tone: "synced",
    ariaLabel: "Synced: Your Keeply data is synced."
  });
});

test("returns offline and local save status copy", () => {
  assert.equal(getSyncStatusView("offline").label, "Offline");
  assert.equal(getSyncStatusView("local").label, "Saved locally");
  assert.equal(getSyncStatusView("pending").tone, "local");
});

test("falls back to syncing for unknown status", () => {
  const view = getSyncStatusView("mystery");
  assert.equal(view.label, "Syncing");
  assert.equal(view.tone, "syncing");
});

test("mentions pending deletes when present", () => {
  const one = getSyncStatusView("local", { pendingDeletes: 1 });
  const many = getSyncStatusView("local", { pendingDeletes: 3 });

  assert.match(one.title, /1 delete pending\.$/);
  assert.match(many.ariaLabel, /3 deletes pending\.$/);
});
