import { appUpdates, latestUpdate } from "../release-updates.mjs";

const seenIds = new Set();

if (!Array.isArray(appUpdates) || appUpdates.length === 0) {
  throw new Error("appUpdates must include at least one update");
}

if (latestUpdate !== appUpdates[0]) {
  throw new Error("latestUpdate must point to the first appUpdates entry");
}

for (const update of appUpdates) {
  if (!update || typeof update !== "object") throw new Error("Each update must be an object");
  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(update.id || "")) {
    throw new Error(`Invalid update id: ${update.id || "(missing)"}`);
  }
  if (seenIds.has(update.id)) throw new Error(`Duplicate update id: ${update.id}`);
  seenIds.add(update.id);
  if (!update.title || update.title.length > 80) throw new Error(`Invalid title for ${update.id}`);
  if (!Array.isArray(update.bullets) || update.bullets.length < 2 || update.bullets.length > 4) {
    throw new Error(`${update.id} must have 2-4 bullets`);
  }
  for (const bullet of update.bullets) {
    if (!bullet || bullet.length > 120) throw new Error(`${update.id} has an invalid bullet`);
  }
}
