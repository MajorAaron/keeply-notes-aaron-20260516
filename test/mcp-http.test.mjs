import test from "node:test";
import assert from "node:assert/strict";
import mcpHandler from "../netlify/functions/mcp.mjs";

test("remote MCP endpoint returns tool discovery over HTTP POST", async () => {
  const response = await mcpHandler(
    new Request("https://keeply.example/mcp", {
      method: "POST",
      headers: { accept: "application/json, text/event-stream" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {}
      })
    })
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/json/);

  const body = await response.json();
  assert.equal(body.jsonrpc, "2.0");
  assert.equal(body.id, 1);
  assert.ok(body.result.tools.some((tool) => tool.name === "keeply_create_note"));
});

test("remote MCP endpoint enforces bearer token when configured", async (t) => {
  const oldToken = process.env.KEEPLY_MCP_TOKEN;
  process.env.KEEPLY_MCP_TOKEN = "test-token";

  t.after(() => {
    if (oldToken === undefined) delete process.env.KEEPLY_MCP_TOKEN;
    else process.env.KEEPLY_MCP_TOKEN = oldToken;
  });

  const unauthorized = await mcpHandler(
    new Request("https://keeply.example/mcp", {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} })
    })
  );

  assert.equal(unauthorized.status, 401);

  const authorized = await mcpHandler(
    new Request("https://keeply.example/mcp", {
      method: "POST",
      headers: { authorization: "Bearer test-token" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} })
    })
  );

  assert.equal(authorized.status, 200);
});

test("remote MCP endpoint accepts notifications with 202", async () => {
  const response = await mcpHandler(
    new Request("https://keeply.example/mcp", {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized", params: {} })
    })
  );

  assert.equal(response.status, 202);
  assert.equal(await response.text(), "");
});
