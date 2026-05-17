import { handleJsonRpc, jsonRpcError } from "../../lib/keeply-mcp-core.mjs";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

export default async function handler(request) {
  if (!isOriginAllowed(request)) {
    return jsonResponse(403, jsonRpcError(null, -32000, "Forbidden origin"));
  }

  if (!isAuthorized(request)) {
    return jsonResponse(401, jsonRpcError(null, -32000, "Unauthorized"));
  }

  if (request.method === "GET" || request.method === "DELETE") {
    return jsonResponse(405, jsonRpcError(null, -32000, "Method not allowed"), { allow: "POST" });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, jsonRpcError(null, -32000, "Method not allowed"), { allow: "POST" });
  }

  let message;
  try {
    message = await request.json();
  } catch (error) {
    return jsonResponse(400, jsonRpcError(null, -32700, "Parse error", error.message));
  }

  const response = await handleJsonRpc(message);
  if (!response) return new Response(null, { status: 202 });

  return jsonResponse(200, response);
}

export const config = {
  path: "/mcp"
};

function isAuthorized(request) {
  const token = env("KEEPLY_MCP_TOKEN");
  if (!token) return true;
  const authorization = request.headers.get("authorization") || "";
  return authorization === `Bearer ${token}`;
}

function isOriginAllowed(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowed = (env("KEEPLY_MCP_ALLOWED_ORIGINS") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  try {
    const requestHost = new URL(request.url).host;
    const originHost = new URL(origin).host;
    return originHost === requestHost || allowed.includes(origin);
  } catch {
    return false;
  }
}

function env(name) {
  return globalThis.Netlify?.env?.get?.(name) || process.env[name];
}

function jsonResponse(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...jsonHeaders,
      ...headers
    }
  });
}
