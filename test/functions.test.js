const test = require('node:test');
const assert = require('node:assert/strict');

const { handler: itemsHandler } = require('../netlify/functions/items');
const { handler: sparkHandler } = require('../netlify/functions/spark');

test('items function returns empty notes and tasks on GET', async () => {
  const response = await itemsHandler({ httpMethod: 'GET' });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), { notes: [], tasks: [] });
});

test('items function acknowledges saved note/task counts on PUT', async () => {
  const response = await itemsHandler({
    httpMethod: 'PUT',
    body: JSON.stringify({ notes: [{ id: 'n1' }], tasks: [{ id: 't1' }, { id: 't2' }] })
  });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), { ok: true, notes: 1, tasks: 2 });
});

test('spark function calls a currently supported Haiku model and returns suggestions', async (t) => {
  const oldKey = process.env.ANTHROPIC_API_KEY;
  const oldFetch = global.fetch;
  let requestBody;
  process.env.ANTHROPIC_API_KEY = 'test-key';
  global.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      async json() {
        return {
          content: [
            {
              text: JSON.stringify({
                summary: 'Ready',
                suggestions: [
                  { type: 'task', title: 'Ship launch checklist', body: 'Create a short launch checklist.', label: 'work', priority: 'high', dueOffsetDays: 1 },
                  { type: 'note', title: 'Launch risks', body: 'Capture launch risks.', label: 'work', color: 'sky' },
                  { type: 'task', title: 'Schedule review', body: 'Pick a review date.', label: 'work', priority: 'normal', dueOffsetDays: 7 }
                ]
              })
            }
          ]
        };
      }
    };
  };

  t.after(() => {
    if (oldKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = oldKey;
    global.fetch = oldFetch;
  });

  const response = await sparkHandler({
    httpMethod: 'POST',
    body: JSON.stringify({ draft: { title: 'Launch plan', label: 'work' }, items: [] })
  });

  assert.equal(requestBody.model, 'claude-haiku-4-5');
  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.equal(body.summary, 'Ready');
  assert.equal(body.suggestions.length, 3);
  assert.equal(body.suggestions[0].label, 'work');
});

test('spark function falls back to useful suggestions if Anthropic request fails', async (t) => {
  const oldKey = process.env.ANTHROPIC_API_KEY;
  const oldFetch = global.fetch;
  process.env.ANTHROPIC_API_KEY = 'test-key';
  global.fetch = async () => ({
    ok: false,
    status: 401,
    async json() {
      return { error: { message: 'bad key' } };
    }
  });

  t.after(() => {
    if (oldKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = oldKey;
    global.fetch = oldFetch;
  });

  const response = await sparkHandler({
    httpMethod: 'POST',
    body: JSON.stringify({ draft: { title: 'Launch plan', label: 'work' }, items: [] })
  });

  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.equal(body.suggestions.length, 3);
  assert.equal(body.suggestions[0].label, 'work');
});
