#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { handler as itemsHandler } from "../netlify/functions/items.mjs";
import sparkHandler from "../netlify/functions/spark.mjs";
import briefHandler from "../netlify/functions/brief.mjs";
import sweepHandler from "../netlify/functions/sweep.mjs";

const serverInfo = {
  name: "keeply-mcp",
  version: "1.0.0"
};

const labels = new Set(["work", "home", "ideas", "personal"]);
const colors = new Set(["sun", "mint", "sky", "rose", "ink"]);
const priorities = new Set(["low", "normal", "high"]);
const statuses = new Set(["active", "archive", "trash"]);
const sweepActions = new Set(["archive_note", "pin_note", "create_task", "raise_task", "snooze_task"]);
const dayMs = 86400000;

loadLocalEnv();
installNetlifyEnvShim();

const tools = [
  {
    name: "keeply_list_items",
    description: "List Keeply notes and tasks with optional filters.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["all", "note", "task"], default: "all" },
        status: { type: "string", enum: ["all", "active", "archive", "trash"], default: "active" },
        label: { type: "string", enum: ["all", "work", "home", "ideas", "personal"], default: "all" },
        query: { type: "string", description: "Case-insensitive search across title/body/details." },
        limit: { type: "number", minimum: 1, maximum: 100, default: 25 }
      }
    }
  },
  {
    name: "keeply_create_note",
    description: "Create a Keeply note.",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        body: { type: "string" },
        label: { type: "string", enum: ["work", "home", "ideas", "personal"], default: "ideas" },
        color: { type: "string", enum: ["sun", "mint", "sky", "rose", "ink"], default: "sun" },
        pinned: { type: "boolean", default: false }
      }
    }
  },
  {
    name: "keeply_update_note",
    description: "Patch a Keeply note by id.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        body: { type: "string" },
        label: { type: "string", enum: ["work", "home", "ideas", "personal"] },
        color: { type: "string", enum: ["sun", "mint", "sky", "rose", "ink"] },
        pinned: { type: "boolean" },
        status: { type: "string", enum: ["active", "archive", "trash"] }
      }
    }
  },
  {
    name: "keeply_create_task",
    description: "Create a Keeply task.",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        details: { type: "string" },
        label: { type: "string", enum: ["work", "home", "ideas", "personal"], default: "ideas" },
        priority: { type: "string", enum: ["low", "normal", "high"], default: "normal" },
        dueAt: { type: "string", description: "Date in YYYY-MM-DD format." },
        completed: { type: "boolean", default: false }
      }
    }
  },
  {
    name: "keeply_update_task",
    description: "Patch a Keeply task by id.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        details: { type: "string" },
        label: { type: "string", enum: ["work", "home", "ideas", "personal"] },
        priority: { type: "string", enum: ["low", "normal", "high"] },
        dueAt: { type: "string", description: "Date in YYYY-MM-DD format." },
        completed: { type: "boolean" },
        status: { type: "string", enum: ["active", "archive", "trash"] }
      }
    }
  },
  {
    name: "keeply_spark",
    description: "Ask Keeply Spark to suggest notes/tasks from a draft and recent Keeply context.",
    inputSchema: {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["note", "task"], default: "note" },
        title: { type: "string" },
        body: { type: "string" },
        label: { type: "string", enum: ["work", "home", "ideas", "personal"], default: "ideas" }
      }
    }
  },
  {
    name: "keeply_focus_brief",
    description: "Generate a Focus Brief from open tasks and active notes.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", minimum: 1, maximum: 12, default: 8 }
      }
    }
  },
  {
    name: "keeply_smart_sweep",
    description: "Generate Smart Sweep cleanup suggestions and optionally apply one safe action.",
    inputSchema: {
      type: "object",
      properties: {
        applyAction: { type: "boolean", default: false },
        action: { type: "string", enum: [...sweepActions] },
        targetId: { type: "string" },
        limit: { type: "number", minimum: 1, maximum: 12, default: 12 }
      }
    }
  }
];

let buffer = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  for (;;) {
    const newline = buffer.indexOf("\n");
    if (newline === -1) break;
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (line) handleLine(line);
  }
});

process.stdin.on("end", () => {
  const line = buffer.trim();
  if (line) handleLine(line);
});

async function handleLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch (error) {
    sendError(null, -32700, "Parse error", error.message);
    return;
  }

  if (!message.id && message.id !== 0) {
    return;
  }

  try {
    const result = await route(message.method, message.params || {});
    send({ jsonrpc: "2.0", id: message.id, result });
  } catch (error) {
    sendError(message.id, error.code || -32000, error.message || "Server error", error.details);
  }
}

async function route(method, params) {
  if (method === "initialize") {
    return {
      protocolVersion: params.protocolVersion || "2024-11-05",
      capabilities: { tools: {} },
      serverInfo
    };
  }

  if (method === "ping") return {};
  if (method === "tools/list") return { tools };

  if (method === "tools/call") {
    const name = params.name;
    const args = params.arguments || {};
    const result = await callTool(name, args);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  throw rpcError(-32601, `Unsupported method: ${method}`);
}

async function callTool(name, args) {
  if (name === "keeply_list_items") return listItems(args);
  if (name === "keeply_create_note") return createNote(args);
  if (name === "keeply_update_note") return updateNote(args);
  if (name === "keeply_create_task") return createTask(args);
  if (name === "keeply_update_task") return updateTask(args);
  if (name === "keeply_spark") return spark(args);
  if (name === "keeply_focus_brief") return focusBrief(args);
  if (name === "keeply_smart_sweep") return smartSweep(args);
  throw rpcError(-32602, `Unknown tool: ${name}`);
}

async function listItems(args = {}) {
  const data = await readData();
  const type = args.type || "all";
  const status = args.status || "active";
  const label = args.label || "all";
  const query = clean(args.query, 120).toLowerCase();
  const limit = clampNumber(args.limit, 1, 100, 25);
  const notes = type === "task" ? [] : data.notes.map((item) => ({ ...item, type: "note" }));
  const tasks = type === "note" ? [] : data.tasks.map((item) => ({ ...item, type: "task" }));

  const items = [...notes, ...tasks]
    .filter((item) => status === "all" || item.status === status)
    .filter((item) => label === "all" || item.label === label)
    .filter((item) => {
      if (!query) return true;
      return `${item.title} ${item.body || ""} ${item.details || ""} ${item.label}`.toLowerCase().includes(query);
    })
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, limit);

  return { count: items.length, items };
}

async function createNote(args) {
  const data = await readData();
  const now = new Date().toISOString();
  const note = {
    id: crypto.randomUUID(),
    title: requiredText(args.title, "title", 90),
    body: clean(args.body, 2000),
    label: labels.has(args.label) ? args.label : "ideas",
    color: colors.has(args.color) ? args.color : "sun",
    pinned: Boolean(args.pinned),
    status: "active",
    createdAt: now,
    updatedAt: now
  };
  data.notes.unshift(note);
  await writeData(data);
  return { note };
}

async function updateNote(args) {
  const data = await readData();
  const note = data.notes.find((item) => item.id === args.id);
  if (!note) throw rpcError(-32602, `Note not found: ${args.id}`);

  if (args.title !== undefined) note.title = requiredText(args.title, "title", 90);
  if (args.body !== undefined) note.body = clean(args.body, 2000);
  if (args.label !== undefined) note.label = enumValue(args.label, labels, "label");
  if (args.color !== undefined) note.color = enumValue(args.color, colors, "color");
  if (args.pinned !== undefined) note.pinned = Boolean(args.pinned);
  if (args.status !== undefined) note.status = enumValue(args.status, statuses, "status");
  note.updatedAt = new Date().toISOString();

  await writeData(data);
  return { note };
}

async function createTask(args) {
  const data = await readData();
  const now = new Date().toISOString();
  const task = {
    id: crypto.randomUUID(),
    title: requiredText(args.title, "title", 90),
    details: clean(args.details, 2000),
    label: labels.has(args.label) ? args.label : "ideas",
    priority: priorities.has(args.priority) ? args.priority : "normal",
    dueAt: clean(args.dueAt, 20),
    completed: Boolean(args.completed),
    status: "active",
    createdAt: now,
    updatedAt: now
  };
  data.tasks.unshift(task);
  await writeData(data);
  return { task };
}

async function updateTask(args) {
  const data = await readData();
  const task = data.tasks.find((item) => item.id === args.id);
  if (!task) throw rpcError(-32602, `Task not found: ${args.id}`);

  if (args.title !== undefined) task.title = requiredText(args.title, "title", 90);
  if (args.details !== undefined) task.details = clean(args.details, 2000);
  if (args.label !== undefined) task.label = enumValue(args.label, labels, "label");
  if (args.priority !== undefined) task.priority = enumValue(args.priority, priorities, "priority");
  if (args.dueAt !== undefined) task.dueAt = clean(args.dueAt, 20);
  if (args.completed !== undefined) task.completed = Boolean(args.completed);
  if (args.status !== undefined) task.status = enumValue(args.status, statuses, "status");
  task.updatedAt = new Date().toISOString();

  await writeData(data);
  return { task };
}

async function spark(args) {
  const data = await readData();
  const request = jsonRequest("http://keeply.local/api/spark", {
    draft: {
      mode: args.mode === "task" ? "task" : "note",
      title: clean(args.title, 120),
      body: clean(args.body, 1200),
      label: labels.has(args.label) ? args.label : "ideas"
    },
    items: getSparkContext(data)
  });
  return callFeatureHandler(sparkHandler, request, "Spark failed");
}

async function focusBrief(args = {}) {
  const data = await readData();
  const limit = clampNumber(args.limit, 1, 12, 8);
  const request = jsonRequest("http://keeply.local/api/brief", getFocusContext(data, limit));
  return callFeatureHandler(briefHandler, request, "Focus brief failed");
}

async function smartSweep(args = {}) {
  const data = await readData();
  const limit = clampNumber(args.limit, 1, 12, 12);

  if (args.applyAction) {
    return applySweepAction(data, args);
  }

  const request = jsonRequest("http://keeply.local/api/sweep", getSweepContext(data, limit));
  return callFeatureHandler(sweepHandler, request, "Smart sweep failed");
}

async function applySweepAction(data, args) {
  const action = enumValue(args.action, sweepActions, "action");
  const targetId = requiredText(args.targetId, "targetId", 80);
  const now = new Date().toISOString();

  if (action === "archive_note") {
    const note = findNote(data, targetId);
    Object.assign(note, { status: "archive", pinned: false, updatedAt: now });
    await writeData(data);
    return { applied: true, action, note };
  }

  if (action === "pin_note") {
    const note = findNote(data, targetId);
    Object.assign(note, { pinned: true, updatedAt: now });
    await writeData(data);
    return { applied: true, action, note };
  }

  if (action === "raise_task") {
    const task = findTask(data, targetId);
    Object.assign(task, { priority: "high", updatedAt: now });
    await writeData(data);
    return { applied: true, action, task };
  }

  if (action === "snooze_task") {
    const task = findTask(data, targetId);
    Object.assign(task, { dueAt: toDateInput(new Date(Date.now() + dayMs)), updatedAt: now });
    await writeData(data);
    return { applied: true, action, task };
  }

  if (action === "create_task") {
    const note = findNote(data, targetId);
    const task = {
      id: crypto.randomUUID(),
      title: `Follow up: ${note.title}`.slice(0, 90),
      details: note.body || "",
      label: note.label || "ideas",
      priority: "normal",
      dueAt: toDateInput(new Date(Date.now() + dayMs)),
      completed: false,
      status: "active",
      createdAt: now,
      updatedAt: now
    };
    data.tasks.unshift(task);
    await writeData(data);
    return { applied: true, action, task, sourceNote: note };
  }

  throw rpcError(-32602, `Unsupported sweep action: ${action}`);
}

function getSparkContext(data) {
  const notes = data.notes
    .filter((note) => note.status === "active")
    .slice(0, 8)
    .map((note) => ({
      type: "note",
      title: note.title,
      body: note.body,
      label: note.label
    }));
  const tasks = data.tasks
    .filter((task) => task.status === "active")
    .slice(0, 8)
    .map((task) => ({
      type: "task",
      title: task.title,
      body: task.details,
      label: task.label,
      priority: task.priority,
      dueAt: task.dueAt
    }));

  return [...notes, ...tasks].sort((a, b) => (a.title > b.title ? 1 : -1)).slice(0, 12);
}

function getFocusContext(data, limit) {
  const tasks = data.tasks
    .filter((task) => task.status === "active" && !task.completed)
    .sort(compareTasks)
    .slice(0, limit)
    .map((task) => ({
      title: task.title,
      body: task.details,
      label: task.label,
      priority: task.priority,
      dueAt: task.dueAt
    }));

  const notes = data.notes
    .filter((note) => note.status === "active")
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, limit)
    .map((note) => ({
      title: note.title,
      body: note.body,
      label: note.label,
      pinned: note.pinned
    }));

  return { tasks, notes };
}

function getSweepContext(data, limit) {
  const notes = data.notes
    .filter((note) => note.status === "active")
    .sort((a, b) => new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt))
    .slice(0, limit)
    .map((note) => ({
      id: note.id,
      type: "note",
      title: note.title,
      body: note.body,
      label: note.label,
      pinned: note.pinned,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    }));

  const tasks = data.tasks
    .filter((task) => task.status === "active")
    .sort(compareTasks)
    .slice(0, limit)
    .map((task) => ({
      id: task.id,
      type: "task",
      title: task.title,
      body: task.details,
      label: task.label,
      priority: task.priority,
      dueAt: task.dueAt,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));

  return { notes, tasks };
}

async function callFeatureHandler(handler, request, fallbackMessage) {
  const response = await handler(request);
  const body = await response.json();
  if (!response.ok) {
    throw rpcError(-32000, body.error || fallbackMessage);
  }
  return body;
}

function jsonRequest(url, body) {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}

async function readData() {
  const result = await itemsHandler({
    httpMethod: "GET",
    path: "/api/items",
    headers: {},
    body: "",
    isBase64Encoded: false
  });
  assertOk(result, "Unable to read Keeply items");
  const parsed = JSON.parse(result.body || "{}");
  return {
    notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    tasks: Array.isArray(parsed.tasks) ? parsed.tasks : []
  };
}

async function writeData(data) {
  const result = await itemsHandler({
    httpMethod: "PUT",
    path: "/api/items",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ notes: data.notes, tasks: data.tasks }),
    isBase64Encoded: false
  });
  assertOk(result, "Unable to write Keeply items");
  return JSON.parse(result.body || "{}");
}

function assertOk(result, message) {
  if (result.statusCode >= 200 && result.statusCode < 300) return;
  let detail = result.body;
  try {
    detail = JSON.parse(result.body).error;
  } catch {
    // Keep the raw body.
  }
  if (detail === "fetch failed") {
    detail = "fetch failed; check TURSO_DATABASE_URL/TURSO_AUTH_TOKEN and network/DNS access to Turso";
  }
  throw rpcError(-32000, `${message}: ${detail}`);
}

function findNote(data, id) {
  const note = data.notes.find((item) => item.id === id);
  if (!note) throw rpcError(-32602, `Note not found: ${id}`);
  return note;
}

function findTask(data, id) {
  const task = data.tasks.find((item) => item.id === id);
  if (!task) throw rpcError(-32602, `Task not found: ${id}`);
  return task;
}

function compareTasks(a, b) {
  if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
  if (a.dueAt && b.dueAt && a.dueAt !== b.dueAt) return a.dueAt.localeCompare(b.dueAt);
  if (a.dueAt !== b.dueAt) return a.dueAt ? -1 : 1;
  return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
}

function loadLocalEnv() {
  const envPaths = [join(process.cwd(), ".env"), join(homedir(), ".claude", "skills", "env.txt")];

  for (const envPath of envPaths) {
    if (!existsSync(envPath)) continue;

    const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }

  process.env.TURSO_DATABASE_URL ||= process.env.TURSO_DB_URL;
  process.env.TURSO_AUTH_TOKEN ||= process.env.TURSO_DB_TOKEN;
}

function installNetlifyEnvShim() {
  globalThis.Netlify ??= {};
  globalThis.Netlify.env ??= {};
  globalThis.Netlify.env.get ??= (name) => process.env[name];
}

function requiredText(value, name, maxLength) {
  const text = clean(value, maxLength);
  if (!text) throw rpcError(-32602, `Missing required field: ${name}`);
  return text;
}

function enumValue(value, allowed, name) {
  if (allowed.has(value)) return value;
  throw rpcError(-32602, `Invalid ${name}: ${value}`);
}

function clean(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function rpcError(code, message, details) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  return error;
}

function sendError(id, code, message, data) {
  send({
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      ...(data ? { data } : {})
    }
  });
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}
