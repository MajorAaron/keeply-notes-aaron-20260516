import test from "node:test";
import assert from "node:assert/strict";

import { getItemSectionMeta, getMarkdownSectionHeadings } from "../item-section-meta.mjs";

test("returns unavailable metadata when text has no markdown headings", () => {
  assert.deepEqual(getItemSectionMeta("Review #Launch notes and send the recap."), {
    available: false,
    label: "",
    ariaLabel: ""
  });
});

test("detects a single markdown section heading", () => {
  assert.deepEqual(getItemSectionMeta("# Agenda\n- Budget\n- Risks"), {
    available: true,
    label: "Section",
    ariaLabel: "Contains 1 markdown section heading",
    tone: "single"
  });
});

test("summarizes multiple markdown sections compactly", () => {
  assert.deepEqual(getItemSectionMeta("## Context\nNotes\n### Next steps\n- Follow up"), {
    available: true,
    label: "2 sections",
    ariaLabel: "Contains 2 markdown section headings",
    tone: "multiple"
  });
});

test("returns heading levels and cleaned titles", () => {
  assert.deepEqual(getMarkdownSectionHeadings("#  Launch plan  \n#### Decisions ###"), [
    { level: 1, title: "Launch plan" },
    { level: 4, title: "Decisions" }
  ]);
});
