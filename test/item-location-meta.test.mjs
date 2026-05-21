import test from "node:test";
import assert from "node:assert/strict";

import { getItemLocationMeta } from "../item-location-meta.mjs";

test("detects map links before generic location text", () => {
  assert.deepEqual(getItemLocationMeta("Directions: https://maps.google.com/?q=coffee"), {
    available: true,
    label: "Maps",
    ariaLabel: "Contains a map link cue",
    tone: "maps"
  });

  assert.equal(getItemLocationMeta("Open maps.apple.com for the venue").label, "Maps");
  assert.equal(getItemLocationMeta("Share https://openstreetmap.org/node/123").label, "Maps");
});

test("detects street address cues", () => {
  assert.deepEqual(getItemLocationMeta("Meet at 123 Market Street after lunch"), {
    available: true,
    label: "Address",
    ariaLabel: "Contains a street address cue",
    tone: "address"
  });

  assert.equal(getItemLocationMeta("Drop package at 42 W 11th Ave.").label, "Address");
});

test("detects room and floor cues without matching unrelated text", () => {
  assert.deepEqual(getItemLocationMeta("Design review in conference room Birch"), {
    available: true,
    label: "Room",
    ariaLabel: "Contains a room or floor location cue",
    tone: "room"
  });

  assert.equal(getItemLocationMeta("Suite 400 kickoff notes").label, "Room");
  assert.deepEqual(getItemLocationMeta("Review product roadmap and owner list"), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});
