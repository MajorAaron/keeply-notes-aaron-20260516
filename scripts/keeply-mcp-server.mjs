#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { handleJsonRpc, jsonRpcError } from "../lib/keeply-mcp-core.mjs";

loadLocalEnv();
installNetlifyEnvShim();

let buffer = "";
let pending = Promise.resolve();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  for (;;) {
    const newline = buffer.indexOf("\n");
    if (newline === -1) break;
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (line) enqueueLine(line);
  }
});

process.stdin.on("end", () => {
  const line = buffer.trim();
  if (line) enqueueLine(line);
});

function enqueueLine(line) {
  pending = pending.then(() => handleLine(line)).catch((error) => {
    send(jsonRpcError(null, -32000, error.message || "Server error", error.details));
  });
}

async function handleLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch (error) {
    send(jsonRpcError(null, -32700, "Parse error", error.message));
    return;
  }

  const response = await handleJsonRpc(message);
  if (response) send(response);
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

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}
