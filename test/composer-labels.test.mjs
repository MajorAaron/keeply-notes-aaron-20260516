import test from "node:test";
import assert from "node:assert/strict";

import { COMPOSER_LABEL_PRESETS, getComposerLabelPresetState, normalizeComposerLabel } from "../composer-labels.mjs";

test("normalizes composer labels with a safe fallback", () => {
  assert.equal(normalizeComposerLabel("work"), "work");
  assert.equal(normalizeComposerLabel("errands"), "ideas");
  assert.equal(normalizeComposerLabel("errands", "home"), "home");
  assert.equal(normalizeComposerLabel("errands", "unknown"), "ideas");
});

test("builds label chip state with one active label and accessible copy", () => {
  const labels = getComposerLabelPresetState("home");

  assert.deepEqual(labels.map((label) => label.key), COMPOSER_LABEL_PRESETS.map((label) => label.key));
  assert.equal(labels.filter((label) => label.active).length, 1);
  assert.deepEqual(
    labels.map(({ key, active, ariaLabel }) => ({ key, active, ariaLabel })),
    [
      { key: "ideas", active: false, ariaLabel: "Set Ideas label" },
      { key: "work", active: false, ariaLabel: "Set Work label" },
      { key: "home", active: true, ariaLabel: "Home label selected" },
      { key: "personal", active: false, ariaLabel: "Set Personal label" }
    ]
  );
});
