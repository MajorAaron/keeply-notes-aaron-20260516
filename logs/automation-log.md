## 2026-05-16 17:06:39 MDT

- Added Smart Sweep to Keeply.
- Smart Sweep appears below Focus Brief and asks Claude to suggest safe cleanup actions for active notes and tasks.
- Supported sweep actions: archive an unpinned note, pin an important note, create a task from a note, raise a task priority, or snooze an overdue task to tomorrow.
- Added `netlify/functions/sweep.mjs` for `/api/sweep` using `ANTHROPIC_API_KEY` from Netlify env.
- Added a local fallback sweep in `app.js` so the panel still works when the AI endpoint is unavailable.
- Updated CSS for the new mobile-friendly sweep panel and action cards.
- Updated `npm test` to syntax-check the new sweep function.
- Verification: `npm test` passed; mocked `/api/sweep` function smoke test returned status 200 with normalized suggestions.
- Deployed to Netlify production. Deploy `6a08f82c644ec1b813a3cb67` is ready at `https://keeply-notes-aaron-20260516.netlify.app`.
- Netlify deploy readback confirmed 4 deployed functions: `items`, `spark`, `brief`, and `sweep`.
- Shell DNS still cannot resolve the Netlify hostname from this sandbox, so live `curl` verification was blocked by the environment.

## 2026-05-16 18:05:59 MDT

- Added Keeply Shape to the composer.
- The new `Shape` button takes a rough capture and asks Claude to choose note vs task, clean the title/body, set the label, choose note color, and set task priority/due timing.
- Added a local heuristic fallback in `app.js` so shaping still works when the AI endpoint is unavailable.
- Added `netlify/functions/shape.mjs` for `/api/shape` using `ANTHROPIC_API_KEY` from Netlify env.
- Added local `server.js` support for `/api/shape` so the feature works in local development with the existing env loader.
- Updated `netlify.toml` routing and `npm test` syntax checks for the new function.
- Verification: `npm test` passed; mocked `/api/shape` function smoke test returned status 200 with a normalized task shape.
- Deployed to Netlify production. Deploy `6a090626fa138801d148405f` is ready at `https://keeply-notes-aaron-20260516.netlify.app`.
- Netlify deploy readback confirmed 5 deployed functions: `items`, `spark`, `brief`, `sweep`, and `shape`; 4 redirect rules processed; no secret-scan matches.
- Shell DNS still cannot resolve the Netlify hostname from this sandbox, so live `curl` verification was blocked by the environment.

## 2026-05-16 19:08:40 MDT

- Added Ask Keeply, a new question-answer panel below Smart Sweep.
- The panel lets the user ask a natural-language question against active notes and tasks, then shows a concise answer, one next step, and clickable source chips that jump back to matching items.
- Added `netlify/functions/ask.mjs` for `/api/ask`; it calls Anthropic using `ANTHROPIC_API_KEY` from Netlify env and only answers from supplied Keeply items.
- Added a local lexical fallback in `app.js` so Ask Keeply still returns a useful match if the AI endpoint is unavailable.
- Added local `server.js` support for `/api/ask`, updated `netlify.toml` routing, and added the ask function to `npm test`.
- Verification: `npm test` passed; mocked `/api/ask` function smoke test returned status 200 with a normalized answer and source.
- Local browser/server verification remains blocked by sandbox port binding: `listen EPERM` on `127.0.0.1:4174`.
- Deployed to Netlify production. Deploy `6a0914e16284e1fd14d2fc19` is ready at `https://keeply-notes-aaron-20260516.netlify.app`.
- Netlify deploy readback confirmed 6 deployed functions: `ask`, `items`, `spark`, `brief`, `sweep`, and `shape`; 5 redirect rules processed; no secret-scan matches.
- Shell DNS still cannot resolve the Netlify hostname from this sandbox, so live `curl` verification was blocked by the environment.

## 2026-05-16 19:23:06 MDT

- Added the required lightweight What's New popup for user-visible Keeply updates.
- Added `release-updates.mjs` with latest update metadata id `2026-05-17-whats-new`, title, and 3 concise bullets.
- The app now compares latest update metadata to `localStorage` key `keeply-last-seen-update` on load, shows the popup only when unseen, and marks it seen when dismissed.
- Added mobile-friendly popup styling with a fixed backdrop, accessible dialog semantics, Escape/backdrop dismissal, and safe-area spacing above the bottom rail.
- Added `scripts/check-release-updates.mjs` and wired it into `npm test` so release metadata must keep a valid id, title, and 2-4 bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; secret scan of changed app/check files found no committed secrets.
- Mobile/browser verification limit: `npm start` remains blocked in this sandbox with `listen EPERM: operation not permitted 127.0.0.1:4174`.
- Netlify deployment limit: `npx netlify deploy --prod --dir . --json` failed because DNS could not resolve `registry.npmjs.org`; retrying the cached Netlify CLI with temp config/cache paths and `NETLIFY_AUTH_TOKEN` failed because DNS could not resolve `api.netlify.com`.
- Git status: committed locally with message `Add Keeply what's new updates`. Push is blocked: first attempt was rejected because `origin/main` contains work not present locally, and follow-up `git fetch origin main` failed because DNS could not resolve `github.com`.
