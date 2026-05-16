const headers = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return { statusCode: 200, headers, body: JSON.stringify({ notes: [], tasks: [] }) };
  }

  if (event.httpMethod === "PUT") {
    try {
      const data = JSON.parse(event.body || "{}");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ok: true,
          notes: Array.isArray(data.notes) ? data.notes.length : 0,
          tasks: Array.isArray(data.tasks) ? data.tasks.length : 0
        })
      };
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
  }

  return { statusCode: 405, headers: { ...headers, allow: "GET, PUT" }, body: JSON.stringify({ error: "Method not allowed" }) };
};
