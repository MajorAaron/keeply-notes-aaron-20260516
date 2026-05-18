## 2026-05-18 04:07:26 MDT

- Added empty filter recovery for faster mobile recovery from zero-result views.
- Empty filtered Notes/Tasks/Archive/Trash views now explain that filters are hiding cards and show an in-card `Clear filters` action; true-empty Archive and Trash states have clearer copy.
- Added `empty-state.mjs` and `test/empty-state.test.mjs`; wired both into `npm test` syntax checks and the full `node --test` suite.
- Updated What's New metadata with latest id `2026-05-18-empty-filter-recovery`, title `Empty Filter Recovery`, and 3 user-facing bullets.
- UI areas touched: empty-state markup in `index.html`, empty-state rendering/listener wiring in `app.js`, mobile-friendly empty-state action styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 110 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Empty Filter Recovery` What's New popup, a zero-result note filter showed `No matching notes` plus the empty-state `Clear filters` button, console-clicking the empty-state action cleared filters, and browser console reported no errors.
- Mobile/layout verification: browser screenshot review found the empty-state message and Clear filters button readable with no obvious overlap or clipping at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded in browser, showed the `Empty Filter Recovery` What's New popup, and selecting a zero-count Rose note color filter showed `No matching notes` with an in-card `Clear filters` button and no browser console errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, or token assignments.
- Git status: feature commit `fb98252` (`Add empty filter recovery`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Deploy `6a0ae4c12a16843081a63572` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0ae4c12a16843081a63572--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 03:07:23 MDT

- Added a Today task progress card for faster mobile task triage.
- Tasks view now shows a compact Today card with done/open/high-priority counts, tomorrow context, an accessible progressbar, and a percent badge above the composer.
- Added `task-today-progress.mjs` and `test/task-today-progress.test.mjs`; wired both into `npm test` syntax checks and the full `node --test` suite.
- Updated What's New metadata with latest id `2026-05-18-today-task-progress`, title `Today Task Progress`, and 3 user-facing bullets.
- UI areas touched: task dashboard markup in `index.html`, task progress rendering in `app.js`, mobile card/progress styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 106 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Today Task Progress` What's New popup, the Tasks view Today progress card, accessible progressbar/counts, and no browser console errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or unreadable text around the Today progress card; exact narrow-phone viewport resizing was not available in the browser tool, so verification was limited to the visible responsive browser width.
- Production verification: deploy permalink loaded in browser, showed the `Today Task Progress` What's New popup, and the Tasks view showed the Today progress card with no browser console errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, or token assignments.
- Git status: feature commit `0c6eca8` (`Add today task progress card`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0ad6ade100a608aa29222b` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0ad6ade100a608aa29222b--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 02:07:47 MDT

- Added collapsible task details for a cleaner mobile task list.
- Long task detail text now renders as a compact preview with a `Show details` / `Hide details` toggle that expands in place.
- Search highlighting continues to work in collapsed previews and expanded task details.
- Added `task-detail-preview.mjs` and `test/task-detail-preview.test.mjs`; wired both into `npm test` syntax checks and the full `node --test` suite.
- Updated What's New metadata with latest id `2026-05-18-collapsible-task-details`, title `Collapsible Task Details`, and 3 user-facing bullets.
- UI areas touched: task card template in `index.html`, task rendering in `app.js`, toggle styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 103 tests after fixing one expected-preview assertion; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Collapsible Task Details` What's New popup, a long local task showed `Show details`, console-click expansion changed it to `Hide details` and revealed the full detail text, and browser console reported no errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap or clipping around the task detail toggle; exact narrow-phone viewport resizing was not available in the browser tool, so verification was limited to the visible responsive browser width.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, or token assignments.
- Git status: feature commit `a5ed326` (`Add collapsible task details`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0ac8bf50df13ed7aa8de92`, post-log deploy `6a0ac8ffeb0a6f220a392370`, and final production deploy `6a0ac9185ab03e21b19a7258` are live at `https://keeply-notes-aaron-20260516.netlify.app`; final deploy permalink is `https://6a0ac9185ab03e21b19a7258--keeply-notes-aaron-20260516.netlify.app`.
- Production verification: feature deploy permalink loaded in browser, showed the `Collapsible Task Details` What's New popup, and browser console reported no errors.

## 2026-05-18 01:05:19 MDT

- Added priority-aware task ordering for faster mobile task triage.
- Tasks due on the same day now sort High before Normal and Low while preserving existing open-before-completed, dated-before-undated, due-date, and newest-created ordering rules.
- Added `task-sort.mjs` and `test/task-sort.test.mjs`; wired both into `npm test`, and updated `app.js` to use the shared comparator.
- Updated What's New metadata with latest id `2026-05-18-priority-task-order`, title `Priority Task Ordering`, and 3 user-facing bullets.
- UI areas touched: task list ordering in `app.js`, release metadata, package test wiring, and the new helper/test files. No visual style changes were needed.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 99 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Priority Task Ordering` What's New popup, the Tasks view loaded, and no browser console errors; screenshot review found no obvious layout overlap or clipping.
- Production verification: deployed permalink loaded in browser and showed the `Priority Task Ordering` What's New popup with no browser console errors.
- Secret scan of changed files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, or token assignments.
- Git status: feature commit `64a5210` (`Sort same-day tasks by priority`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0aba1ddd96f7ec4edbaf27` and final post-log deploy `6a0aba6050df13c09fa8df72` are live at `https://keeply-notes-aaron-20260516.netlify.app`; final deploy permalink is `https://6a0aba6050df13c09fa8df72--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 00:08:09 MDT

- Added mobile note color filters for faster visual note triage.
- Notes view now has a horizontal color filter row for All colors, Sun, Mint, Sky, Rose, and Ink, with counts that respect the selected label.
- The selected note color filters visible notes, label counts, the active-filter summary, Clear filters, and saved view preferences.
- Added `note-color-filters.mjs` and `test/note-color-filters.test.mjs`; updated active-filter and view-preference helpers/tests plus `npm test` wiring.
- Updated What's New metadata with latest id `2026-05-18-note-color-filters`, title `Note Color Filters`, and 3 user-facing bullets.
- UI areas touched: note filter markup in `index.html`, note filtering/rendering in `app.js`, mobile filter styling in `styles.css`, release metadata, package test wiring, and helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 95 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Note Color Filters` What's New popup, visible color filter row/counts, Sky-note filtering, active-filter chip, and no browser console errors.
- Production verification: deployed permalink loaded in browser, showed the `Note Color Filters` What's New popup, and the Notes view showed the new color filter row; clicking Sky filtered notes and showed the active-filter chip with no browser console errors.
- Secret scan of changed files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, or token assignments.
- Git status: feature commit `956652e` (`Add note color filters`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0aacae547906d5b2ead90b` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0aacae547906d5b2ead90b--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-17 23:10:33 MDT

- Added mobile task priority filters for faster task triage.
- Tasks view now has a second horizontal filter row for All priorities, High, Normal, and Low, with counts that respect the selected date window and label.
- The selected priority filter participates in visible task filtering, label counts, the active-filter summary, Clear filters, and saved view preferences.
- Added `task-priority-filters.mjs` and `test/task-priority-filters.test.mjs`; updated active-filter and view-preference helpers/tests plus `npm test` wiring.
- Updated What's New metadata with latest id `2026-05-17-task-priority-filters`, title `Task Priority Filters`, and 3 user-facing bullets.
- UI areas touched: task filter markup in `index.html`, task filtering/rendering in `app.js`, mobile filter styling in `styles.css`, release metadata, package test wiring, and helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 92 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Task Priority Filters` What's New popup, visible priority filter chips/counts, High-priority filtering, active-filter chip, and no browser console errors.
- Production verification: deployed permalink loaded in browser, showed the `Task Priority Filters` What's New popup, and the Tasks view showed the new priority filter row/counts with no browser console errors.
- Secret scan of changed files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, or secret/token values; only pre-existing `tokenize` function-name false positives appeared in `app.js`.
- Git status: feature commit `63c8d8f` (`Add task priority filters`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0a9f2bfbbca071671a1e8c` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0a9f2bfbbca071671a1e8c--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-17 22:04:13 MDT

- Added compact note reading metadata for faster mobile note triage.
- Note cards now show a word-count and estimated reading-time pill in the footer; empty or title-only notes display a quiet `Quick note` label.
- Added `note-reading-meta.mjs` and `test/note-reading-meta.test.mjs`; wired both into `npm test` syntax checks and the full `node --test` suite.
- Updated What's New metadata with latest id `2026-05-17-note-reading-metadata`, title `Note Reading Details`, and 3 user-facing bullets.
- UI areas touched: note rendering in `app.js`, note template footer in `index.html`, footer pill styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: watched the new note-reading-meta test fail before implementation, then pass; full `npm test` passed with 89 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Note Reading Details` What's New popup and visible reading-time pills; screenshot review found no obvious layout overlap or clipping.
- Production verification: deployed permalink loaded in browser, showed the `Note Reading Details` What's New popup, visible note reading metadata, and no browser console errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, secret, token, or long `sk-` key patterns.
- Git status: feature commit `2ce58b4` (`Add note reading metadata`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Initial feature deploy `6a0a8fac65506c5221466796` verified the user-facing change; final post-log production deploy `6a0a8fe60640df578dd2e2f6` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0a8fe60640df578dd2e2f6--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-17 21:06:21 MDT

- Added color-coded task due badges for faster mobile task scanning.
- Task cards now show due timing as compact badges: Overdue with date, Today, Tomorrow, future date, No date, or a quiet Done badge for completed tasks.
- Added `task-due-badge.mjs` and `test/task-due-badge.test.mjs`; wired both into `npm test` syntax checks and the full `node --test` suite.
- Updated What's New metadata with latest id `2026-05-17-task-due-badges`, title `Task Due Badges`, and 3 user-facing bullets.
- UI areas touched: task rendering in `app.js`, badge styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: watched the new task-due-badge test fail before implementation, then pass; full `npm test` passed with 85 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Task Due Badges` What's New popup, visible task due badges, and no obvious mobile layout overlap in screenshot review.
- Production verification: deployed permalink loaded in browser, showed the `Task Due Badges` What's New popup, and the Tasks view showed a `Due today` badge without mutating production data.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, secret, token, or long `sk-` key patterns.
- Git status: feature commit `54c8412` (`Add task due badges`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded after the first `npx netlify deploy --prod --dir .. --json` attempt failed with `Error while running build`; retrying `npx netlify deploy --prod --dir . --no-build --json` succeeded. Deploy `6a0a8210a79a2d762ff259e4` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0a8210a79a2d762ff259e4--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-17 20:07:15 MDT

- Added collapsible note previews for mobile-friendly reading.
- Long note bodies now render as compact, word-boundary previews with a `Read more` / `Show less` toggle that expands the full body in place.
- Search highlighting continues to run through both collapsed previews and expanded note text.
- Added `note-preview.mjs` and `test/note-preview.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-collapsible-note-previews`, title `Collapsible Note Previews`, and 3 user-facing bullets.
- UI areas touched: note card template in `index.html`, note rendering in `app.js`, preview toggle styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: watched the new note-preview test fail before implementation, then pass; full `npm test` passed with 79 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the What's New popup for `Collapsible Note Previews`; a long local note showed `Read more`, expanded to full text with `Show less`, and had no obvious desktop layout overlap in screenshot review.
- Secret scan of changed app/test/metadata/style/package/helper files found no committed `ANTHROPIC_API_KEY`, secret, token, or long `sk-` key patterns; only false-positive `tokenize` function names appeared.
- Git status: feature commit `82365d8` (`Add collapsible note previews`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded. Final deploy `6a0a747865506c1ac84665b9` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0a747865506c1ac84665b9--keeply-notes-aaron-20260516.netlify.app`. Earlier feature deploy `6a0a743eca12654c2bdfcef2` also reached ready state.
- Production browser verification loaded the feature deploy permalink and confirmed the `Collapsible Note Previews` What's New popup. Live production note-toggle verification was not performed to avoid mutating production note data.

## 2026-05-17 19:06:02 MDT

- Added mobile task swipe triage.
- Task cards now accept horizontal swipes: right swipe in Tasks completes or reopens with the existing Undo toast, left swipe archives, and right swipe from Archive or Trash restores without adding any destructive swipe-delete path.
- Added `task-swipe-actions.mjs` and `test/task-swipe-actions.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-task-swipe-triage`, title `Swipe Task Triage`, and 3 user-facing bullets.
- UI areas touched: `app.js` task rendering/swipe handling, `styles.css` task-card mobile drag behavior, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: watched the new task-swipe test fail before implementation, then pass; full `npm test` passed with 75 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the What's New popup for `Swipe Task Triage`; a simulated mobile right-swipe on an open task produced `Completed` with `Undo`, and Undo restored the task.
- Secret scan of changed app/test/metadata/style/package/helper files found no committed `ANTHROPIC_API_KEY`, secret, token, or long `sk-` key patterns.
- Git status: feature commit `7e9b0ea` (`Add task swipe triage`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded. Deploy `6a0a65d9dd96f7327ddbafb7` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0a65d9dd96f7327ddbafb7--keeply-notes-aaron-20260516.netlify.app`.
- Production browser verification loaded the deploy permalink and confirmed the `Swipe Task Triage` What's New popup. Shell `curl` verification of the `.app` hostname was blocked by the command security scanner's lookalike-TLD approval gate, so live verification used the browser instead.

## 2026-05-17 17:05:21 MDT

- Added undo for note pinning.
- Pinning or unpinning a note from the pin button now shows a toast with an `Undo` action that restores the previous pinned state.
- The existing mobile swipe-to-pin gesture now uses the same undoable flow, so accidental swipe pin changes are reversible.
- Added `note-pin.mjs` and `test/note-pin.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-undo-note-pinning`, title `Undo Note Pinning`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 67 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the What's New popup appeared for `Undo Note Pinning`; after dismissing it, invoking a note pin action showed `Pinned` with `Undo`, and pressing Undo restored the pinned count and showed `Note unpinned`.
- Secret scan of changed app/test/metadata/package/helper files found no committed API key or token patterns.
- Git status: feature commit `dc814ac` (`Add undo for note pinning`) and log commits were pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded from a clean temporary worktree to avoid untracked local files. Final deploy `6a0a499d5f02e4fe9829b900` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0a499d5f02e4fe9829b900--keeply-notes-aaron-20260516.netlify.app`. Earlier connector deploy `6a0a498edb360d05ba0c0126` also reached ready state.
- Live shell verification limit: direct live-site `curl` was not run because previous runs in this sandbox were blocked by the command security scanner for the `.app` production hostname; local browser verification covered the shipped UI behavior before deploy.

## 2026-05-17 16:08:54 MDT

- Added undo for note follow-up task creation.
- Creating a task from a note now shows a toast with an `Undo` action that removes the fresh follow-up task.
- Undo uses `removeFollowUpTask()` to remove only the matching source-note task and queues the task id in `deletedIds` so an already-synced follow-up is removed on the next save.
- Added `removeFollowUpTask()` coverage in `test/note-followups.test.mjs`.
- Updated What's New metadata with latest id `2026-05-17-undo-follow-up-tasks`, title `Undo Follow-Up Tasks`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 63 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser console smoke test confirmed a note follow-up showed `Task added for today` with `Undo`, and pressing Undo reduced task count by one and showed `Follow-up removed`.
- Secret scan of changed app/test/metadata/helper files found no committed API key or token patterns.
- Git status: feature commit `08d10b6` (`Add undo for follow-up tasks`) and log commits were pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded from a clean temporary worktree to avoid untracked local files. Final deploy `6a0a3c50db360de6c90c00e6` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0a3c50db360de6c90c00e6--keeply-notes-aaron-20260516.netlify.app`.
- Netlify note: the first plain `npx netlify deploy --prod --dir . --json` attempt failed with `Error while running build`; retrying with `--no-build` succeeded, then the clean-worktree deploy above replaced it.
- Live shell verification limit: direct `curl -I https://keeply-notes-aaron-20260516.netlify.app` was blocked by the command security scanner for `.app` lookalike-TLD approval, so the live URL was not fetched from this sandbox after deploy.

## 2026-05-17 15:10:29 MDT

- Added undo for copied Keeply notes and tasks.
- Copying a note or task now shows a toast with an `Undo` action that removes the freshly created copy.
- Undo also queues the copied item id in the local deleted-id sync list so an already-synced copy is removed on the next save.
- Added `duplicate-undo.mjs` and `test/duplicate-undo.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-undo-duplicate-cards`, title `Undo Copied Cards`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 61 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser console smoke test confirmed Copy showed `Note duplicated` with `Undo`, and pressing Undo reduced the note count by one and showed `Copy removed`.
- Secret scan of changed app/test/metadata/package files found no committed API key or token patterns.
- Git status: feature commit `6b26073` (`Add undo for copied cards`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded via direct CLI deploy. Final production deploy `6a0a2f0f525c20cb7e9d2e70` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; deploy preview URL is `https://6a0a2f0f525c20cb7e9d2e70--keeply-notes-aaron-20260516.netlify.app`. Earlier deploys this run were `6a0a2eb55f02e4c2ef29b6ec` and `6a0a2eea28a44ba74d0cca9d`.
- Live shell verification limit: direct `curl -I https://keeply-notes-aaron-20260516.netlify.app` was blocked by the command security scanner for `.app` lookalike-TLD approval, so the live URL was not fetched from this sandbox after deploy.

## 2026-05-17 15:06:30 MDT

- Added card editing for saved Keeply notes and tasks.
- Note and task cards now include an `Edit` action that loads the item into the composer.
- The composer switches into a clear editing state with `Save note` or `Save task` plus a `Cancel` action.
- Edited notes can update title, body, label, color, and attached/generated image; edited tasks can update title, details, label, priority, and due date.
- Added `edit-items.mjs` and `test/edit-items.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-edit-cards`, title `Edit Saved Cards`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 60 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed API key or token patterns.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Git status: feature commit `4fbd600` (`Add card editing flow`) and log commit `4fe078a` (`Log card editing automation`) were pushed to `origin main`; unrelated untracked `backups/` and `duplicate-undo.mjs` were left untouched.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify production deploy succeeded via the generated MCP deploy command after one failed connector-command attempt. Deploy `6a0a2da4fd2fdbbc0182c737` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches across 83 scanned files.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.

## 2026-05-17 14:06:18 MDT

- Added card duplication actions for Keeply notes and tasks.
- Note and task cards now include a `Copy` action that creates a fresh active duplicate.
- Copied notes keep their label, color, body, and image while reopening as unpinned active notes.
- Copied tasks keep their label, priority, due date, and details while reopening as unchecked active tasks.
- Added `duplicate-items.mjs` and `test/duplicate-items.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-duplicate-cards`, title `Duplicate Cards`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 59 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secret assignments or tokens; local matches were only localStorage key constants.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Git status: feature commit `149101c` (`Add card duplication actions`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify production deploy succeeded via the generated MCP deploy command. Deploy `6a0a1f95b332df6d49ba8b1a` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches across 81 scanned files.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.

## 2026-05-17 13:05:21 MDT

- Added mobile-friendly card share actions for Keeply notes and tasks.
- Note and task cards now include a `Share` action that uses the native Web Share sheet when available, then falls back to copying clean share text to the clipboard.
- Added `item-share.mjs` and `test/item-share.test.mjs` for formatting note/task share payloads without embedding image data URLs.
- Updated card templates and styles in `index.html` and `styles.css`, with thin wiring in `app.js`.
- Updated What's New metadata with latest id `2026-05-17-share-cards`, title `Share Notes and Tasks`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 56 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secret assignments or tokens.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Git status: feature commit `a091520` (`Add card share actions`) was pushed to `origin main`.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`; the connector-generated `@netlify/mcp` command failed because DNS cannot resolve `registry.npmjs.org`.
- Netlify production deploy succeeded from the pushed commit. Deploy `6a0a113430808e0008a0f648` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, commit `a0915200f2170602f3e961cd8b10157500a1768f`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches across 78 scanned files.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.

## 2026-05-17 12:56:44 MDT

- Added an active filter reset row for Keeply.
- When search, a non-All label, or a task date filter is active, Keeply now shows a compact summary of the active filters.
- The new `Clear filters` action resets search, label, and task date filters in one tap so empty mobile views are easier to recover from.
- Added `active-filters.mjs` and `test/active-filters.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-clear-active-filters`, title `Clear Active Filters`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 44 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secret assignments or tokens; local matches were false-positive task/search text.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Git status: feature commit `b96890d` (`Add active filter reset`) was pushed to `origin main`; unrelated uncommitted `view-preferences` and `search-highlights` work was left untouched.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify production deploy succeeded from the pushed commit. Deploy `6a0a0f36ca989f0008a5849b` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, commit `b96890dc03cb4abe4befcf7380c085541e439f56`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches across 72 scanned files.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.

## 2026-05-17 13:00:04 MDT

- Added remembered workspace preferences for Keeply.
- Keeply now stores the last section, selected label, task date filter, compact layout setting, and morning/evening paper theme in localStorage and restores them on load.
- Added `view-preferences.mjs` and `test/view-preferences.test.mjs` for preference normalization, safe parsing, and app-state serialization.
- Preserved and completed the already-wired search-highlight strand by including `search-highlights.mjs`, `test/search-highlights.test.mjs`, and the package test coverage needed by the existing app imports.
- Updated What's New metadata with latest id `2026-05-17-remember-workspace`, title `Remembered Workspace`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 52 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secret assignments or tokens.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Git status: amended feature commit `ac5b46d` (`Remember Keeply workspace`) was pushed to `origin main`.
- Netlify CLI deployment limit: direct Netlify CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify connector deployment succeeded. Deploy `6a0a101965506c35dd466635` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches across 76 scanned files.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.

## 2026-05-17 09:06:42 MDT

- Added quick task label shortcuts to active task cards.
- Active tasks now show mobile-friendly label buttons for every label except the task's current label.
- Tapping a label shortcut updates the task through the existing save/sync path without reopening the composer.
- Added `task-label-shortcuts.mjs` and `test/task-label-shortcuts.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-task-label-shortcuts`, title `Quick Task Label Changes`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 41 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secret assignments or tokens; local matches were false-positive task/search text.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Git status: feature commit `08b0e48` (`Add task label shortcuts`) was pushed to `origin main`.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`; the connector-generated `@netlify/mcp` deploy command failed because DNS cannot resolve `registry.npmjs.org`.
- Netlify production deploy succeeded from the pushed commit. Deploy `6a09d90b3197b9000813f260` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches across 70 scanned files.

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

## 2026-05-16 19:49:35 MDT

- Added durable delete sync for Keeply notes and tasks.
- The client now stores `deletedIds`, filters those ids during remote load/merge, and sends them on the next successful `/api/items` save so items deleted forever do not reappear from cloud sync.
- Updated `netlify/functions/items.mjs` to merge incoming notes/tasks with current Turso data, remove ids listed in `deletedIds`, and keep the newest copy when two clients edited the same item.
- Added `test/sync-delete.test.mjs` and wired it into `npm test` to cover deleted-id removal and newest-item conflict handling.
- Updated What's New metadata with latest id `2026-05-17-durable-delete-sync`, title `Cleaner Cross-Device Deletes`, and 3 user-facing bullets.
- Included existing local reliability hardening in the commit: `.mjs` static MIME serving for local module imports and sequential MCP stdin request handling.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed.
- Netlify function smoke test: direct `/api/items` GET loaded local env without printing secrets but returned status 500 because sandbox DNS cannot resolve Turso host `keeply-majoraaron.aws-us-east-2.turso.io`.
- Mobile/browser verification limit: `npm start` remains blocked in this sandbox with `listen EPERM: operation not permitted 127.0.0.1:4174`.
- Git status: committed locally with message `Add durable delete sync` and pushed to `origin main`.
- Netlify deployment limit: `npx netlify deploy --prod --dir . --json` failed because DNS cannot resolve `registry.npmjs.org`; retrying cached Netlify CLI with temp config/cache paths and local env loaded failed because DNS cannot resolve `api.netlify.com`.

## 2026-05-16 20:05:25 MDT

- Added task date filters to the Tasks view.
- The new horizontally scrollable filter row supports All, Overdue, Today, Upcoming, and No date windows with live counts for active tasks.
- Empty task-filter states now point the user toward another date filter or a task for that window.
- Added `task-filters.mjs` with shared filter/count logic and `test/task-filters.test.mjs` for due-date and completion-state coverage.
- Updated What's New metadata with latest id `2026-05-17-task-date-filters`, title `Task Date Filters`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed.
- Secret scan of changed app/test/metadata files found no committed secrets.
- Mobile/browser verification limit: `npm start` remains blocked in this sandbox with `listen EPERM: operation not permitted 127.0.0.1:4174`.
- Git status: committed with message `Add task date filters` and pushed to `origin main` before deployment.
- Netlify deployment limit: `npx netlify deploy --prod --dir . --json` failed before deployment because DNS cannot resolve `registry.npmjs.org`, so no production deploy id or URL was produced from this run.

## 2026-05-16 21:05:31 MDT

- Added local visual fallbacks for Keeply image notes.
- The composer now creates a lightweight local visual when `/api/image` is unavailable, so Generate still produces a savable visual note.
- Added `note-images.mjs` with deterministic SVG fallback generation and data URL byte sizing, plus `test/note-images.test.mjs`.
- Updated What's New metadata with latest id `2026-05-17-visual-note-fallbacks`, title `Visual Notes Keep Working`, and 3 user-facing bullets.
- Included the existing visual-note/MCP worktree state in the shipped commit: image note UI, `/api/image`, remote `/mcp`, shared MCP core, and MCP HTTP tests.
- AI/API behavior: the image endpoint still uses the existing `/api/image` function; the new app behavior falls back locally without an API key when that endpoint fails.
- Verification: `npm test` passed.
- Secret scan of changed app/test/metadata/function/server/docs files found no committed secrets.
- Mobile/browser verification limit: `npm start` remains blocked in this sandbox with `listen EPERM: operation not permitted 127.0.0.1:4174`.
- Git status: committed with message `Add visual note fallbacks` (`f89e936`) and pushed to `origin main`.
- Netlify deployment limit: `npx netlify deploy --prod --dir . --json` failed because DNS cannot resolve `registry.npmjs.org`; retrying the cached Netlify CLI with local env and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`, so no production deploy id or URL was produced from this run.

## 2026-05-16 22:04:21 MDT

- Added quick due-date shortcuts to active task cards.
- Task cards in the Tasks view now show mobile-friendly chips for `Today`, `Tomorrow`, and `No date`, hiding the chip that matches the task's current due state.
- Completed tasks do not show rescheduling chips so finished work stays visually quiet.
- Added `task-due-shortcuts.mjs` with shared shortcut/date logic and `test/task-due-shortcuts.test.mjs`.
- Updated What's New metadata with latest id `2026-05-17-task-due-shortcuts`, title `Quick Task Rescheduling`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style files found no committed secrets.
- Mobile/browser verification limit: `npm start` remains blocked in this sandbox with `listen EPERM: operation not permitted 127.0.0.1:4174`.
- Git status: committed with message `Add task due shortcuts` (`2d5565c`) and pushed to `origin main`.
- Netlify deployment limit: initial `npx netlify deploy --prod --dir . --json` failed writing `/Users/aaronmajor/Library/Preferences/netlify/config.json.tmp-89906381712c1751`; retrying with temp config/cache paths and local env loaded failed because DNS cannot resolve `api.netlify.com`, so no production deploy id or URL was produced from this run.

## 2026-05-16 23:05:08 MDT

- Added note follow-up shortcuts to active note cards.
- Active notes now show mobile-friendly `Task today` and `Task tomorrow` buttons that create a task from the note without opening the composer.
- Follow-up tasks keep the note title, body, label, and `sourceNoteId`, with normal priority and the selected due date.
- Added `note-followups.mjs` and `test/note-followups.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-note-follow-up-shortcuts`, title `Note Follow-Up Shortcuts`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style files found no committed secrets.
- Mobile/browser verification limit: `npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4174`; retrying `HOST=0.0.0.0 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 0.0.0.0:4175`.
- Git status: committed with message `Add note follow-up shortcuts` (`6ef140d`) and pushed to `origin main`.
- Netlify deployment limit: `npx netlify deploy --prod --dir . --json` first failed writing `/Users/aaronmajor/Library/Preferences/netlify/config.json.tmp-8994294792844ddc`; retrying with temp `HOME`, config, and cache paths plus local env loaded failed because DNS cannot resolve `api.netlify.com`, so no production deploy id or URL was produced.

## 2026-05-17 00:03:57 MDT

- Added quick priority shortcuts to active task cards.
- Task cards in the Tasks view now show mobile-friendly priority buttons for High, Normal, and Low while hiding the task's current priority.
- Completed tasks do not show priority shortcuts, keeping finished work visually quiet.
- Added `task-priority-shortcuts.mjs` and `test/task-priority-shortcuts.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-task-priority-shortcuts`, title `Quick Task Priority Changes`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style files found no committed secrets.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`.
- Git status: committed with message `Add task priority shortcuts` (`4abcd77`) and pushed to `origin main`.
- Netlify deployment limit: `npx netlify deploy --prod --dir . --json` with temp config/cache paths and local env loaded failed because DNS cannot resolve `api.netlify.com`, so no production deploy id or URL was produced.

## 2026-05-17 01:03:57 MDT

- Added undo for cleanup actions across notes and tasks.
- Archive, trash, restore, and delete-forever flows now show a toast with an `Undo` action that restores the item snapshot.
- Permanent delete undo removes the item id from the local deleted-id sync queue before saving again.
- Added `undo-restore.mjs` and `test/undo-restore.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-undo-cleanup-actions`, title `Undo Cleanup Actions`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secrets.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`.
- Git status: committed with message `Add undo for cleanup actions` (`60e8cac`) and pushed to `origin main`.
- Netlify deployment limit: `npx netlify deploy --prod --dir . --json` with temp config/cache paths and local env loaded failed because DNS cannot resolve `api.netlify.com`, so no production deploy id or URL was produced.

## 2026-05-17 02:05:15 MDT

- Added completed task cleanup to the Tasks view.
- Tasks now show a mobile-friendly completed-work cleanup row with a live done count and an `Archive completed` action.
- Completed active tasks move to Archive in one tap and the toast offers `Undo` to restore the previous task list.
- Added `completed-task-cleanup.mjs` with shared archive logic and `test/completed-task-cleanup.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-archive-completed-tasks`, title `Archive Completed Tasks`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secrets; broad scan output contained only false-positive task/search text matches, not secret assignments or tokens.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`; the in-app Browser check also rejected loading `http://127.0.0.1:4175` by browser security policy after the server failure.
- Git status: committed with message `Add completed task cleanup` (`eba94ff`) and pushed to `origin main`.
- Netlify deployment limit: `npx netlify deploy --prod --dir . --json` with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`, so no production deploy id or URL was produced.

## 2026-05-17 03:05:23 MDT

- Added task due presets to the task composer.
- The task composer now shows mobile-friendly `Today`, `Tomorrow`, and `No date` preset buttons that update the due-date field.
- Preset active state stays in sync with manual due-date changes and with Keeply Shape task drafts.
- Added `task-composer-presets.mjs` and `test/task-composer-presets.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-task-composer-presets`, title `Task Due Presets`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secrets; Netlify deploy validation also reported no secret-scan matches across 58 scanned files.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local browser check could not be run in this sandbox.
- Git status: committed with message `Add task due presets` (`9566a46`) and pushed to `origin main`.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify connector deployment succeeded. Deploy `6a0984a6a84d93cf6778428a` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, and 1 header rule processed.

## 2026-05-17 04:06:13 MDT

- Added undo for task completion in the Tasks view.
- Tapping a task checkbox now updates completion through `task-completion.mjs` and shows a toast `Undo` action that restores the task snapshot.
- Added `test/task-completion.test.mjs`; wired the helper and test into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-undo-task-completion`, title `Undo Task Completion`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; `git diff --check` passed.
- Secret scan of changed app/test/metadata/package files found no committed secrets; Netlify deploy validation also reported no secret-scan matches across 60 scanned files.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.
- Git status: feature commit `d9e5240` (`Add undo for task completion`) was pushed to `origin main`.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify connector deployment succeeded. Deploy `6a0992d3ba53fc08f92e0f22` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, and 1 header rule processed.

## 2026-05-17 05:04:33 MDT

- Added overdue task snoozing to the Tasks view.
- Tasks now show a mobile-friendly cleanup row with live `overdue` and `done` counts plus separate `Snooze overdue` and `Archive completed` actions.
- `Snooze overdue` moves active overdue tasks to tomorrow, switches the task filter to Upcoming, and shows an Undo toast that restores the previous task list.
- Added `snooze-overdue-tasks.mjs` and `test/snooze-overdue-tasks.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-snooze-overdue-tasks`, title `Snooze Overdue Tasks`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secrets; local scan matches were task/search text false positives, and Netlify deploy validation reported no secret-scan matches across 62 scanned files.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.
- Git status: feature commit `7370b79` (`Add overdue task snooze`) was pushed to `origin main`.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify MCP deployment succeeded. Deploy `6a09a091143b767c431e313e` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches.

## 2026-05-17 06:04:37 MDT

- Added composer draft recovery for unfinished notes and tasks.
- The composer now saves local draft text, mode, label, color, due date, priority, and note images while the user edits.
- Reloading Keeply restores a meaningful in-progress draft and shows a short `Draft restored` toast.
- Saving a note or task clears the local draft so completed captures do not reappear.
- Added `composer-draft.mjs` and `test/composer-draft.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-composer-draft-recovery`, title `Composer Draft Recovery`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 33 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/package files found no committed secret patterns; Netlify deploy validation scanned 64 files with no secret-scan matches.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.
- Git status: feature commit `773c92e` (`Add composer draft recovery`) was pushed to `origin main`.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify MCP deployment succeeded. Initial feature deploy `6a09aef56f27526a162b6b99` and final current-tree deploy `6a09af61e06e854521402567` are ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches.

## 2026-05-17 07:04:36 MDT

- Added quick note color shortcuts to active note cards.
- Active notes now show mobile-friendly color swatches for every color except the card's current color.
- Tapping a swatch updates the note color through the existing save/sync path without reopening the composer.
- Added `note-color-shortcuts.mjs` and `test/note-color-shortcuts.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-note-color-shortcuts`, title `Quick Note Color Changes`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 36 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secret assignments or tokens; local matches were false-positive task/search text. Netlify deploy validation scanned 66 files with no secret-scan matches.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Git status: feature commit `7165334` (`Add note color shortcuts`) was pushed to `origin main`.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify MCP deployment succeeded. Deploy `6a09bcc0228bf96e4cd98ed6` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches.

## 2026-05-17 08:06:03 MDT

- Added live label counts to the existing label chip row.
- Label chips now show compact counts for the current view, with task counts respecting the selected task date filter.
- Archive and Trash label counts include both notes and tasks so mixed cleanup views are easier to scan.
- Added `label-counts.mjs` and `test/label-counts.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-label-count-chips`, title `Label Counts`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: `npm test` passed with 38 tests; `git diff --check` passed.
- Secret scan of changed app/test/metadata/style/package files found no committed secret assignments or tokens; Netlify deploy validation scanned 68 files with no secret-scan matches.
- Mobile/browser verification limit: `HOST=127.0.0.1 PORT=4175 npm start` failed with `listen EPERM: operation not permitted 127.0.0.1:4175`, so a local mobile browser check could not be run in this sandbox.
- Live shell verification limit: `curl -I https://keeply-notes-aaron-20260516.netlify.app` failed because DNS could not resolve the Netlify hostname from this sandbox.
- Git status: feature commit `7992938` (`Add label count chips`) was pushed to `origin main`.
- Netlify CLI deployment limit: direct CLI deploy with local env loaded and temp config/cache paths failed because DNS cannot resolve `api.netlify.com`.
- Netlify MCP deployment succeeded. Initial feature deploy `6a09cb0efa13889f2b48405b` and final current-tree deploy `6a09cb8b9cd8f9b356a565af` are ready at `https://keeply-notes-aaron-20260516.netlify.app`; readback confirmed state `ready`, 8 deployed functions, 7 redirect rules processed, 1 header rule processed, and no secret-scan matches.

## 2026-05-17 18:05:26 MDT

- Added bulk task list paste for Keeply task capture.
- In Task mode, leaving Title blank and pasting two or more lines into the details field now creates one active task per line.
- Common pasted prefixes such as bullets, numbered list markers, and checkbox markers are stripped before task creation.
- The selected label, priority, and due date apply to every task created from the pasted list; the composer placeholder now hints at list paste support.
- Added `task-bulk-entry.mjs` and `test/task-bulk-entry.test.mjs`; wired both into `npm test`.
- Updated What's New metadata with latest id `2026-05-17-bulk-task-paste`, title `Paste a Task List`, and 3 user-facing bullets.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: wrote the failing bulk-task test first, then implemented the helper and app wiring; `npm test` passed with 70 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the What's New popup appeared for `Paste a Task List`, the Task details placeholder mentions list paste, and pasting two bullet lines with an empty title created two separate active tasks.
- Secret scan of changed app/test/metadata/package/helper files found no committed API keys or tokens; the only scan match was the helper import name `buildBulkTasksFromText`.
- Git status: feature commit `fe7d867` (`Add bulk task list paste`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded from a clean temporary worktree with explicit site id `1d285a70-4cc9-4e30-a1e5-e84b6d00a57c` and `--no-build`. Final current-tree deploy `6a0a583c5479061b01ead90d` is ready at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0a583c5479061b01ead90d--keeply-notes-aaron-20260516.netlify.app`.
- Live shell verification limit: direct live-site `curl` was blocked by the command security scanner for the `.app` production hostname, so live HTTP verification was not run after deploy.
