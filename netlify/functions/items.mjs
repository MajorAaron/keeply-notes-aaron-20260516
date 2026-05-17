import { createClient } from "@libsql/client/web";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

let db;
let ready;

function getClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("Missing TURSO_DATABASE_URL");
  }

  if (!authToken) {
    throw new Error("Missing TURSO_AUTH_TOKEN");
  }

  db ??= createClient({ url, authToken });
  return db;
}

async function ensureSchema() {
  ready ??= getClient().execute(`
    CREATE TABLE IF NOT EXISTS keeply_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('note', 'task')),
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `);

  return ready;
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

function parseBody(event) {
  if (!event.body) return {};
  return JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body);
}

function normalizeItem(type, item) {
  return {
    ...item,
    id: String(item.id),
    status: item.status || "active",
    updatedAt: item.updatedAt || new Date().toISOString(),
    type
  };
}

async function listItems() {
  const result = await getClient().execute("SELECT type, payload FROM keeply_items ORDER BY updated_at DESC");
  const notes = [];
  const tasks = [];

  for (const row of result.rows) {
    const item = JSON.parse(String(row.payload));
    if (row.type === "note") notes.push(item);
    if (row.type === "task") tasks.push(item);
  }

  return { notes, tasks };
}

export function newerItem(first, second) {
  if (!first) return second;
  if (!second) return first;
  const firstDate = new Date(first.updatedAt || first.createdAt || 0);
  const secondDate = new Date(second.updatedAt || second.createdAt || 0);
  return firstDate >= secondDate ? first : second;
}

export function mergeItemsForSync(current = {}, incoming = {}) {
  const deleted = new Set((incoming.deletedIds || []).map((id) => String(id)));
  const noteMap = new Map((current.notes || []).filter((item) => !deleted.has(item.id)).map((item) => [item.id, item]));
  const taskMap = new Map((current.tasks || []).filter((item) => !deleted.has(item.id)).map((item) => [item.id, item]));

  for (const item of (incoming.notes || []).map((note) => normalizeItem("note", note))) {
    if (!deleted.has(item.id)) noteMap.set(item.id, newerItem(item, noteMap.get(item.id)));
  }

  for (const item of (incoming.tasks || []).map((task) => normalizeItem("task", task))) {
    if (!deleted.has(item.id)) taskMap.set(item.id, newerItem(item, taskMap.get(item.id)));
  }

  return {
    notes: [...noteMap.values()],
    tasks: [...taskMap.values()]
  };
}

async function replaceItems({ notes = [], tasks = [], deletedIds = [] }) {
  const client = getClient();
  const now = new Date().toISOString();
  const current = await listItems();
  const { notes: normalizedNotes, tasks: normalizedTasks } = mergeItemsForSync(current, { notes, tasks, deletedIds });
  const items = [...normalizedNotes, ...normalizedTasks];

  const statements = [
    "DELETE FROM keeply_items",
    ...items.map((item) => ({
      sql: "INSERT INTO keeply_items (id, type, payload, updated_at) VALUES (?, ?, ?, ?)",
      args: [item.id, item.type, JSON.stringify(item), item.updatedAt || now]
    }))
  ];

  await client.batch(statements, "write");
  return { notes: normalizedNotes, tasks: normalizedTasks };
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: jsonHeaders };
  }

  try {
    await ensureSchema();

    if (event.httpMethod === "GET") {
      return response(200, await listItems());
    }

    if (event.httpMethod === "PUT") {
      return response(200, await replaceItems(parseBody(event)));
    }

    return response(405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return response(500, { error: error.message || "Keeply sync failed" });
  }
}
