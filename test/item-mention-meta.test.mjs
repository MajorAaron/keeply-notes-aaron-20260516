import test from "node:test";
import assert from "node:assert/strict";

import { getItemMentionMeta } from "../item-mention-meta.mjs";

test("returns unavailable metadata when text has no mentions", () => {
  assert.deepEqual(getItemMentionMeta("Review the launch plan"), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects a single @mention in note or task text", () => {
  assert.deepEqual(getItemMentionMeta("Share recap with @Maya"), {
    available: true,
    label: "@Maya",
    ariaLabel: "Mentions @Maya",
    tone: "single"
  });
});

test("summarizes unique multiple mentions with the first visible mention", () => {
  assert.deepEqual(getItemMentionMeta("Loop in @ops-team and @Maya, then remind @ops_team"), {
    available: true,
    label: "@opsteam +1",
    ariaLabel: "Mentions 2 people or groups including @opsteam",
    tone: "multiple"
  });
});

test("ignores email addresses while keeping standalone mentions", () => {
  assert.deepEqual(getItemMentionMeta("Email alex@example.com and ask @Alex for notes"), {
    available: true,
    label: "@Alex",
    ariaLabel: "Mentions @Alex",
    tone: "single"
  });
});
