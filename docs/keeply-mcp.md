# Keeply MCP Server

Keeply includes a local stdio MCP server at `scripts/keeply-mcp-server.mjs`.

## Run

```bash
npm run mcp
```

The server reads environment variables from `.env` and `/Users/aaronmajor/.claude/skills/env.txt`. It maps `TURSO_DB_URL` and `TURSO_DB_TOKEN` to the names used by the app when needed.

Live note/task tools require network/DNS access to the configured Turso database. AI tools also require `ANTHROPIC_API_KEY`.

## Codex or Claude Desktop Config

```json
{
  "mcpServers": {
    "keeply": {
      "command": "node",
      "args": [
        "/Users/aaronmajor/Documents/Codex/2026-05-16-keep-working-on-keeply-add-a/scripts/keeply-mcp-server.mjs"
      ],
      "cwd": "/Users/aaronmajor/Documents/Codex/2026-05-16-keep-working-on-keeply-add-a"
    }
  }
}
```

## Tools

- `keeply_list_items`: list notes and tasks with type/status/label/query filters.
- `keeply_create_note`: create a note.
- `keeply_update_note`: patch note fields, pin/unpin, archive, or trash.
- `keeply_create_task`: create a task.
- `keeply_update_task`: patch task fields, completion, priority, archive, or trash.
- `keeply_spark`: call Keeply Spark for generated note/task suggestions.
- `keeply_focus_brief`: call Focus Brief for a short agenda.
- `keeply_smart_sweep`: call Smart Sweep for cleanup suggestions, or apply one safe sweep action.

The MCP server uses the same Turso-backed item store and Anthropic-backed feature functions as the Netlify app.
