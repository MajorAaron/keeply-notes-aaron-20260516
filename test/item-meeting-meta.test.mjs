import test from "node:test";
import assert from "node:assert/strict";

import { getItemMeetingMeta } from "../item-meeting-meta.mjs";

test("detects video meeting providers before generic meeting text", () => {
  assert.deepEqual(getItemMeetingMeta("Prep for design review on Zoom at 3pm"), {
    available: true,
    label: "Zoom",
    ariaLabel: "Contains a Zoom meeting cue",
    tone: "video"
  });

  assert.equal(getItemMeetingMeta("Join https://meet.google.com/abc-defg-hij").label, "Meet");
  assert.equal(getItemMeetingMeta("Send notes from Teams sync").label, "Teams");
});

test("detects call and in-person meeting cues", () => {
  assert.deepEqual(getItemMeetingMeta("Call with Sam about launch"), {
    available: true,
    label: "Call",
    ariaLabel: "Contains a phone call cue",
    tone: "call"
  });

  assert.deepEqual(getItemMeetingMeta("Coffee chat in person with Alex"), {
    available: true,
    label: "In person",
    ariaLabel: "Contains an in-person meeting cue",
    tone: "in-person"
  });
});

test("detects generic meeting language without matching unrelated text", () => {
  assert.deepEqual(getItemMeetingMeta("Weekly standup agenda"), {
    available: true,
    label: "Meeting",
    ariaLabel: "Contains a meeting cue",
    tone: "meeting"
  });

  assert.deepEqual(getItemMeetingMeta("Read product strategy notes"), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});
