import assert from "node:assert/strict";
import { extractLinks, getItemLinkMeta } from "../item-link-meta.mjs";

assert.deepEqual(extractLinks("Read https://example.com/report. Then https://www.keeply.app/path?x=1!"), [
  "https://example.com/report",
  "https://www.keeply.app/path?x=1"
]);

assert.deepEqual(extractLinks("Duplicate https://example.com and https://example.com"), ["https://example.com"]);

assert.deepEqual(getItemLinkMeta("No urls here"), {
  available: false,
  count: 0,
  label: "",
  ariaLabel: "No links",
  firstUrl: ""
});

assert.deepEqual(getItemLinkMeta("Spec: https://www.example.com/spec"), {
  available: true,
  count: 1,
  label: "1 link",
  ariaLabel: "1 link, first link to example.com",
  firstUrl: "https://www.example.com/spec"
});

assert.deepEqual(getItemLinkMeta("A https://a.test B https://b.test"), {
  available: true,
  count: 2,
  label: "2 links",
  ariaLabel: "2 links, first link to a.test",
  firstUrl: "https://a.test"
});
