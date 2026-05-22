import test from "node:test";
import assert from "node:assert/strict";

import { getItemTagMeta } from "../item-tag-meta.mjs";

test("returns unavailable metadata when text has no hashtags", () => {
  assert.deepEqual(getItemTagMeta("Review the launch plan"), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects a single hashtag in note or task text", () => {
  assert.deepEqual(getItemTagMeta("Draft agenda for #Launch"), {
    available: true,
    label: "#Launch",
    ariaLabel: "Contains tag #Launch",
    tone: "single"
  });
});

test("summarizes unique multiple hashtags with the first visible tag", () => {
  assert.deepEqual(getItemTagMeta("#client prep for #Launch and #client recap"), {
    available: true,
    label: "#client +1",
    ariaLabel: "Contains 2 tags including #client",
    tone: "multiple"
  });
});

test("supports underscore and dash tags while ignoring URL fragments", () => {
  assert.deepEqual(getItemTagMeta("See https://example.com/page#section then file under #follow_up and #next-week"), {
    available: true,
    label: "#followup +1",
    ariaLabel: "Contains 2 tags including #followup",
    tone: "multiple"
  });
});
