
## 2026-05-20 13:06:39 MDT

- Added mobile-first Task Blocker Badges for faster stalled-work triage in the Tasks view.
- Open task cards now show compact `Blocked`, `Stuck`, `Waiting`, or `Depends` badges when the title/details include blocker or dependency language; completed tasks stay quiet.
- Updated What's New metadata with latest id `2026-05-20-task-blocker-badges`, title `Task Blocker Badges`, and 3 user-facing bullets.
- UI/code areas touched: task card metadata rendering in `app.js`, task template in `index.html`, badge styling in `styles.css`, release metadata, package test wiring, and new helper/test files `task-blocker-meta.mjs` plus `test/task-blocker-meta.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task-language detection only.
- Verification: full `npm test` passed with the new blocker helper test included; `git diff --check` passed; `node scripts/check-release-updates.mjs` passed; focused `node --test test/task-blocker-meta.test.mjs` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4194 npm start` served `http://127.0.0.1:4194/` with HTTP 200. Browser verification confirmed the `Task Blocker Badges` What's New popup/dismissal persistence, a saved task titled `Launch migration blocked by API review` rendering a visible `Blocked` badge with aria label `Task is marked blocked`, no document-level horizontal overflow, and no browser console errors.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-task-blocker-badges` in the What's New popup, dismissed to `keeply-last-seen-update`, dynamically imported `task-blocker-meta.mjs` and returned a `Blocked` badge for blocker/waiting copy while hiding a completed blocked task, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of added lines in changed app/index/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `daa8564` (`Add task blocker badges`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0e061b2617607e7c79a622` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink: `https://6a0e061b2617607e7c79a622--keeply-notes-aaron-20260516.netlify.app`

## 2026-05-20 12:07:38 MDT

- Added mobile-first Link Count Badges for faster scanning of notes and tasks that contain web references.
- Note and task cards now show compact `1 link` / `N links` pills when titles or bodies include unique `http(s)` URLs, with screen-reader labels that include the first link domain.
- Updated What's New metadata with latest id `2026-05-20-link-count-badges`, title `Link Count Badges`, and 3 user-facing bullets.
- UI/code areas touched: card metadata rendering in `app.js`, note/task templates in `index.html`, badge styling in `styles.css`, release metadata, package test wiring, and new helper/test files `item-link-meta.mjs` plus `test/item-link-meta.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local URL detection only.
- Verification: full `npm test` passed, including the new link metadata helper test; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4193 npm start` served `http://127.0.0.1:4193/` with HTTP 200. Browser verification confirmed the `Link Count Badges` What's New popup/dismissal persistence, a note badge `2 links`, a task badge `1 link`, no document-level horizontal overflow, and no browser console errors.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-link-count-badges` in the What's New popup, dismissed to `keeply-last-seen-update`, dynamically imported `item-link-meta.mjs` and returned `2 links` for two production URLs, reported no document horizontal overflow, and had no browser console errors. Production sample data did not include visible link cards, so the deployed helper/import path was smoke-tested directly.
- Secret scan of added lines in changed app/index/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `d5880cd` (`Add link count badges`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0df83f85d8ee5207d30354` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink: `https://6a0df83f85d8ee5207d30354--keeply-notes-aaron-20260516.netlify.app`

## 2026-05-20 11:04:11 MDT

- Added mobile-first Task Weekday Due Badges for clearer task timing at a glance.
- Task due badges now include weekday names for scheduled dates beyond Today/Tomorrow; overdue and completed badges keep their status while adding weekday context.
- Updated What's New metadata with latest id `2026-05-20-task-weekday-due-badges`, title `Task Weekday Due Badges`, and 3 user-facing bullets.
- UI/code areas touched: task due badge formatter in `task-due-badge.mjs`, release metadata, and `test/task-due-badge.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task badge formatting only.
- Verification: full `npm test` passed with 219 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4192 npm start` served `http://127.0.0.1:4192/` with HTTP 200. Browser verification confirmed the `Task Weekday Due Badges` What's New popup/dismissal persistence, visible weekday due badges such as `Overdue · Tue, May 19` and `Sat, May 23`, no document-level horizontal overflow, and no browser console errors.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-task-weekday-due-badges` in the What's New popup, dismissed to `keeply-last-seen-update`, displayed task badges such as `Done · Thu, May 21`, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of added lines in changed metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `7a738ef` (`Add task weekday due badges`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0de971913da4248a6c6169` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink: `https://6a0de971913da4248a6c6169--keeply-notes-aaron-20260516.netlify.app`

## 2026-05-20 10:08:22 MDT

- Added mobile-first Composer Draft Stats for faster note/task capture confidence before saving.
- The composer now shows live body metadata under the text area: word count, non-empty line count, markdown checklist count, and reading-time estimates for longer note drafts.
- Updated What's New metadata with latest id `2026-05-20-composer-body-meta`, title `Composer Draft Stats`, and 3 user-facing bullets.
- UI/code areas touched: composer markup in `index.html`, live metadata wiring in `app.js`, compact mobile styling in `styles.css`, release metadata, package test wiring, and new helper/test files `composer-body-meta.mjs` plus `test/composer-body-meta.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local composer metadata only.
- Verification: full `npm test` passed; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4191 npm start` served `http://127.0.0.1:4191/` with HTTP 200. Browser verification confirmed the `Composer Draft Stats` What's New popup/dismissal persistence, live composer metadata for a multi-line checklist draft (`13 words • 3 lines • 2 checks`), no document-level horizontal overflow, and no browser console errors.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-composer-body-meta` in the What's New popup, dismissed to `keeply-last-seen-update`, showed live composer metadata for a two-line draft (`5 words • 2 lines`), reported no document horizontal overflow, and had no browser console errors.
- Secret scan of added lines in changed app/index/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `f93375a` (`Add composer draft stats`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0ddc5743c3aa007a201850` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink: `https://6a0ddc5743c3aa007a201850--keeply-notes-aaron-20260516.netlify.app`

## 2026-05-20 09:05:51 MDT

- Added mobile-first Weekday Task Hints for faster natural-language task capture.
- Task title parsing now understands weekday names from Sunday through Saturday, including `this Monday`; single tasks and pasted task lists set the matching due date while saving clean titles.
- Updated What's New metadata with latest id `2026-05-20-weekday-task-hints`, title `Weekday Task Hints`, and 3 user-facing bullets.
- UI/code areas touched: deterministic task hint parser in `task-bulk-entry.mjs`, single-task capture via existing `task-capture-hints.mjs` integration, release metadata, and parser/capture tests. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task parsing/capture behavior only.
- Verification: full `npm test` passed with 219 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4190 npm start` served `http://127.0.0.1:4190/` with HTTP 200. Browser verification confirmed the `Weekday Task Hints` What's New popup/dismissal persistence, dynamic-imported local parsing of `Send invoices Friday @work` to title `Send invoices`, Work label, and due date `2026-05-22`, reported no document horizontal overflow, and had no browser console errors.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-weekday-task-hints` in the What's New popup, dismissed to `keeply-last-seen-update`, dynamic-imported production weekday parsing for `Send invoices Friday @work`, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of changed metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `0045fcf` (`Add weekday task hints`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0dcdaefa6b0f00a106e874` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink: `https://6a0dcdaefa6b0f00a106e874--keeply-notes-aaron-20260516.netlify.app`

## 2026-05-20 08:08:29 MDT

- Added mobile-first Note Activity Badges for faster note triage.
- Note cards now show compact `Created`, `Edited`, `Pinned`, or `Stale` activity badges beside reading/checklist/image metadata, with accessible labels and responsive wrapping for dense mobile card footers.
- Updated What's New metadata with latest id `2026-05-20-note-activity-badges`, title `Note Activity Badges`, and 3 user-facing bullets.
- UI/code areas touched: note card metadata rendering in `app.js`/`index.html`, note activity badge styling in `styles.css`, release metadata, package test wiring, and new helper/test files `note-activity-meta.mjs` plus `test/note-activity-meta.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local note metadata display only.
- Verification: full `npm test` passed with 216 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4189 npm start` served `http://127.0.0.1:4189/` with HTTP 200. Browser verification confirmed the `Note Activity Badges` What's New popup/dismissal persistence, visible note activity badges, no document-level horizontal overflow, and no browser console errors. Visual review found the badge/action area dense on some cards but readable with no clipping or overlap after footer wrapping.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-note-activity-badges` in the What's New popup, dismissed to `keeply-last-seen-update`, displayed note activity badges (`Pinned today`, `Pinned 2d ago`, `Created yesterday`), reported no document horizontal overflow, and had no browser console errors.
- Secret scan of added lines in changed app/index/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `4596cdc` (`Add note activity badges`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0dc0351a59788271d6afb7` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink: `https://6a0dc0351a59788271d6afb7--keeply-notes-aaron-20260516.netlify.app`

## 2026-05-20 07:07:13 MDT

- Added mobile-first Note Image Badges for faster scanning of visual notes.
- Note cards with safe data-image attachments now show a compact `Image`, `AI image`, or `Local image` badge beside reading/checklist metadata, with accessible labels and image-type styling.
- Updated What's New metadata with latest id `2026-05-20-note-image-badges`, title `Note Image Badges`, and 3 user-facing bullets.
- UI/code areas touched: note card metadata rendering in `app.js`/`index.html`, note badge styling in `styles.css`, release metadata, package test wiring, and new helper/test files `note-image-meta.mjs` plus `test/note-image-meta.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local metadata display for attached/generated note images only.
- Verification: full `npm test` passed with 211 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4188 npm start` served `http://127.0.0.1:4188/` with HTTP 200. Browser verification confirmed the `Note Image Badges` What's New popup/dismissal persistence, visible image badges on note cards with visual content, no document-level horizontal overflow, and no browser console errors.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-note-image-badges` in the What's New popup, dismissed to `keeply-last-seen-update`, dynamic-imported the production note image metadata helper to confirm local fallback image badge copy, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of added lines in changed app/index/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `475b5af` (`Add note image badges`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0db1bd33f32b5d4899304b` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink: `https://6a0db1bd33f32b5d4899304b--keeply-notes-aaron-20260516.netlify.app`

## 2026-05-20 06:06:56 MDT

- Added mobile-first Task Freshness Badges for quicker task review context.
- Task cards now show a compact activity pill such as `Updated today`, `Updated 2d ago`, `Stale 10d`, or `Done yesterday`, with screen-reader labels and stale/open-task coloring.
- Updated What's New metadata with latest id `2026-05-20-task-freshness-badges`, title `Task Freshness Badges`, and 3 user-facing bullets.
- UI/code areas touched: task card metadata rendering in `app.js`/`index.html`, activity pill styling in `styles.css`, release metadata, package test wiring, and new helper/test files `task-activity-meta.mjs` plus `test/task-activity-meta.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task metadata display only.
- Verification: full `npm test` passed after wiring the new helper checks/tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4187 npm start` served `http://127.0.0.1:4187/` with HTTP 200. Browser verification confirmed the `Task Freshness Badges` What's New popup/dismissal persistence, visible task activity badges in the Tasks view, no document-level horizontal overflow, and no browser console errors.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-task-freshness-badges` in the What's New popup, dismissed to `keeply-last-seen-update`, displayed task activity badges including `Updated today` and `Done yesterday`, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of added lines in changed app/index/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `406e95d` (`Add task freshness badges`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0da3c44c0d0429ae7b7f3a` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink: `https://6a0da3c44c0d0429ae7b7f3a--keeply-notes-aaron-20260516.netlify.app`

## 2026-05-20 05:07:26 MDT

- Added mobile-first Cleanup Count Shortcuts for faster review from the Tasks cleanup bar.
- The `overdue` and `done` cleanup counts are now accessible buttons; tapping overdue jumps to open overdue tasks, and tapping done jumps to completed tasks before bulk snooze/archive actions.
- Updated What's New metadata with latest id `2026-05-20-cleanup-count-shortcuts`, title `Cleanup Count Shortcuts`, and 3 user-facing bullets.
- UI/code areas touched: task cleanup bar markup and styling, task cleanup shortcut helper/wiring in `app.js`, release metadata, package test wiring, and new helper/test files `task-cleanup-shortcuts.mjs` plus `test/task-cleanup-shortcuts.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task filtering/navigation behavior only.
- Verification: full `npm test` passed with 204 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4186 npm start` served `http://127.0.0.1:4186/` with HTTP 200. Browser verification confirmed the `Cleanup Count Shortcuts` What's New popup/dismissal persistence, visible cleanup count buttons in Tasks, done-count shortcut setting Done tasks, overdue-count shortcut setting Overdue + Open tasks via JS click after one stale-ref browser click miss, no document-level horizontal overflow, and no browser console errors.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-cleanup-count-shortcuts` in the What's New popup, dismissed to `keeply-last-seen-update`, displayed cleanup count buttons, done-count shortcut filtered to completed tasks, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of added lines in changed app/index/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `abf2e50` (`Add task cleanup count shortcuts`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d95c78ee30f0081d297dc` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d95c78ee30f0081d297dc--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-20 04:07:13 MDT

- Added mobile-first Ask Follow-Up Chips for faster follow-on questions after an Ask Keeply answer.
- Ask answer cards now render tested local follow-up chips from the answer's sources and next step; tapping a chip fills the Ask field without auto-submitting.
- Updated What's New metadata with latest id `2026-05-20-ask-followup-chips`, title `Ask Follow-Up Chips`, and 3 user-facing bullets.
- UI/code areas touched: Ask answer rendering in `app.js`, follow-up question helper/tests in `ask-answer-note.mjs` and `test/ask-answer-note.test.mjs`, Ask chip styling in `styles.css`, and release metadata. No new dependencies or Netlify functions were added.
- AI/API behavior: submitted Ask requests still use the existing `/api/ask` Anthropic flow and local fallback; the new follow-up chips are deterministic local UI suggestions based on returned answer metadata.
- Verification: full `npm test` passed with 204 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4185 npm start` served `http://127.0.0.1:4185/` with HTTP 200. Browser verification confirmed the `Ask Follow-Up Chips` What's New popup/dismissal persistence, an Ask answer rendering follow-up chips, tapping a chip filling the Ask field, no document-level horizontal overflow, and no browser console errors.
- Production verification: deploy permalink loaded, showed latest update id `2026-05-20-ask-followup-chips` in the What's New popup, dismissed to `keeply-last-seen-update`, rendered Ask follow-up chips after a production Ask answer, reported no horizontal overflow, and had no browser console errors.
- Secret scan of changed app/style/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `ef54143` (`Add Ask follow-up chips`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d879f6071e1b41ab8f498` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d879f6071e1b41ab8f498--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-20 01:08:40 MDT

- Added No-Date Task Hints for faster mobile task capture when a selected due preset should be cleared.
- Task title parsing now understands `no date`, `unscheduled`, and `someday`; those words are stripped from saved task titles while label and priority hints still apply.
- Pasted multi-line task lists can use the same no-date hints to override a shared composer due date on individual lines.
- Updated What's New metadata with latest id `2026-05-20-no-date-task-hints`, title `No-Date Task Hints`, and 3 user-facing bullets.
- UI/code areas touched: task hint parser, single-task capture due handling, release metadata, and task capture/bulk parser tests. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task parsing/capture behavior only.
- Verification: full `npm test` passed; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4184 npm start` served `http://127.0.0.1:4184/` with HTTP 200. Browser verification confirmed the `No-Date Task Hints` What's New popup/bullets, dismissal persistence to `keeply-last-seen-update`, creating `Inventory freezer someday @home` with a selected due date saved title `Inventory freezer`, Home label, and blank due date, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the Tasks composer/filter area readable with no obvious clipping, overlapping controls, or document-level horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, exposed latest update id `2026-05-20-no-date-task-hints` in the What's New popup, dismissed to `keeply-last-seen-update`, dynamic-imported the production parser to confirm `Inventory freezer someday @home` returns `clearsDue: true`, Home label, and no due date, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of changed metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `7dd3c68` (`Add no-date task hints`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d5dd2a4b1a333fadfeb04` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d5dd2a4b1a333fadfeb04--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-20 00:05:52 MDT

- Added a mobile-first This Week Task Filter for faster near-term task planning.
- Tasks view now includes a `This week` date chip between Tomorrow and Upcoming; it counts tasks due today through the next six days and composes with status, priority, label, and search filters.
- Updated What's New metadata with latest id `2026-05-20-this-week-task-filter`, title `This Week Task Filter`, and 3 user-facing bullets.
- UI/code areas touched: task date filter markup, date-window helper logic, active-filter labels, view-preference normalization, release metadata, and task/filter/view-preference tests. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task filtering/count behavior only.
- Verification: full `npm test` passed with 195 passing tests after shortening one release bullet to satisfy the metadata checker; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4183 npm start` served `http://127.0.0.1:4183/` with HTTP 200. Browser verification confirmed the `This Week Task Filter` What's New popup/bullets, dismissal persistence to `keeply-last-seen-update`, visible `This week` task date chip and counts, selecting it persisted `taskWindow: week`, active-filter summary copy, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the task date filter row readable with `This week` selected and no obvious clipping, overlapping controls, or document-level horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed latest update id `2026-05-20-this-week-task-filter` in the What's New popup, dismissed to `keeply-last-seen-update`, selected the `This week` task chip, persisted `taskWindow: week`, showed the active-filter summary, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of changed app/index/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `d315684` (`Add this week task filter`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d4f1c06b5c21bd32cf834` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d4f1c06b5c21bd32cf834--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 23:08:26 MDT

- Added mobile-first Stats Shortcuts so the summary row doubles as quick navigation/filter controls.
- Notes view now exposes tappable Total and Pinned summary tiles for clearing back to all active notes or isolating pinned notes; the Today note tile remains a disabled summary because there is no exact created-today filter.
- Tasks view now exposes tappable Tasks, Open, and Due summary tiles; Due jumps to Today + Open when today work exists, Tomorrow + Open when tomorrow work exists, or Open tasks when due-soon work is clear.
- Updated What's New metadata with latest id `2026-05-19-stats-shortcuts`, title `Stats Shortcuts`, and 3 user-facing bullets.
- UI/code areas touched: summary row markup and styles, stats shortcut helper/action wiring in `app.js`, release metadata, package test wiring, and new helper/test files `stats-shortcuts.mjs` plus `test/stats-shortcuts.test.mjs`. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local filtering/navigation behavior only.
- Verification: full `npm test` passed with 195 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4182 npm start` served `http://127.0.0.1:4182/` with HTTP 200. Browser verification confirmed the `Stats Shortcuts` What's New popup/bullets, dismissal persistence to `keeply-last-seen-update`, Notes summary shortcut accessibility labels, Tasks summary shortcut labels, the Due stat setting Tasks + Today + Open preferences, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the Summary shortcuts row readable with no obvious clipping, overlap, or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Stats Shortcuts` What's New popup and bullets, dismissed to `keeply-last-seen-update`, exposed the Summary shortcuts row, set Tasks + Today + Open preferences via the Due stat shortcut, reported no document horizontal overflow, and had no browser console errors.
- Secret scan of added lines in changed app/index/style/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `506d23b` (`Add stats shortcut filters`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d41a151841be4b077da4c` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d41a151841be4b077da4c--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 22:07:22 MDT

- Added a mobile-first Today Progress Shortcut so the task progress card can jump directly into the most relevant task queue.
- The Today progress card now renders a tested action button: open work due today goes to Today + Open, completed days go to Today + Done, clear days with tomorrow work go to Tomorrow + Open, and fully clear days go to open task planning.
- Updated What's New metadata with latest id `2026-05-19-today-progress-cta`, title `Today Progress Shortcut`, and 3 user-facing bullets.
- UI/code areas touched: Today progress summary helper/action metadata, Today progress card markup and styling, task filter wiring in `app.js`, release metadata, and Today progress tests. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task navigation/filtering behavior only.
- Verification: full `npm test` passed with 195 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4181 npm start` served `http://127.0.0.1:4181/` with HTTP 200. Browser verification confirmed the `Today Progress Shortcut` What's New popup/bullets, dismissal persistence to `keeply-last-seen-update`, the visible `Show today` progress-card action, action-driven Today + Open preference state, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the Today progress card's `Show today` button visible/readable with no obvious horizontal overflow, clipping, or overlap at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed latest update id `2026-05-19-today-progress-cta` in the What's New popup, dismissed to `keeply-last-seen-update`, exposed the Today progress action, clicked it into Today + Open task filters, and reported no browser console errors.
- Secret scan of added lines in changed app/index/style/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `1499e5d` (`Add today progress shortcut`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d334d69671dce4467f0ef` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d334d69671dce4467f0ef--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 21:04:38 MDT

- Added mobile-first Weekend Note Follow-Ups for turning notes into weekend tasks without opening the task composer.
- Active note cards now include a `Task weekend` follow-up shortcut alongside today, tomorrow, and next week; the shortcut preserves note title, body, and label on the generated task.
- Weekend follow-up dates resolve to the upcoming Saturday, or today when already on Saturday/Sunday.
- Updated What's New metadata with latest id `2026-05-19-weekend-note-followups`, title `Weekend Note Follow-Ups`, and 3 user-facing bullets.
- UI/code areas touched: note follow-up shortcut helper, note follow-up tests, mobile note follow-up button wrapping CSS, and release metadata. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local note-to-task scheduling behavior only.
- Verification: full `npm test` passed with 194 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4180 npm start` served `http://127.0.0.1:4180/` with HTTP 200. Browser verification confirmed the `Weekend Note Follow-Ups` What's New popup/bullets, dismissal persistence to `keeply-last-seen-update`, visible `Task weekend` note-card follow-up buttons, dynamic-imported weekend follow-up due date `2026-05-23`, and no browser console errors.
- Mobile/layout verification: browser checks found the four note follow-up buttons visible/readable and wrapping into two rows without obvious clipping or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the latest update id `2026-05-19-weekend-note-followups` in the What's New popup, exposed `Task weekend` note follow-up buttons, dismissed to `keeply-last-seen-update`, dynamic-imported weekend follow-up logic returned due date `2026-05-23`, and reported no browser console errors.
- Secret scan of changed metadata/helper/style/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `c90ae12` (`Add weekend note follow-ups`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d24a197d149afe06ca063` and final current-tree deploy `6a0d24ecdf08faa728822f19` are live at `https://keeply-notes-aaron-20260516.netlify.app`; final deploy permalink is `https://6a0d24ecdf08faa728822f19--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 20:06:07 MDT

- Added mobile-first Weekend Scheduling for faster task planning around the upcoming weekend.
- Task composer due presets and per-task due shortcut chips now include `Weekend`; the shortcut resolves to the upcoming Saturday, or today when already on Saturday/Sunday.
- Single task titles and pasted bulk task lines now understand `weekend` and `this weekend` hints, strip those words from saved titles, and preserve label/priority hints such as `@home` and `!low`.
- Updated What's New metadata with latest id `2026-05-19-weekend-scheduling`, title `Weekend Scheduling`, and 3 user-facing bullets.
- UI/code areas touched: task due preset helper, task due shortcut helper, bulk/single task hint parsing, release metadata, and task scheduling tests. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local scheduling/parsing behavior only.
- Verification: full `npm test` passed with 194 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4178 npm start` served `http://127.0.0.1:4178/` with HTTP 200. Browser verification confirmed the `Weekend Scheduling` What's New popup/dismiss persistence, visible `Weekend` composer preset and task-card shortcut chips, creating `Buy trail snacks this weekend @home` as title `Buy trail snacks` with Home label and due date `2026-05-23`, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the Weekend preset and task-card due chips visible/readable with no obvious horizontal overflow, overlap, or clipping at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed latest update id `2026-05-19-weekend-scheduling` in the What's New popup, exposed the `Weekend` composer preset, dismissed to `keeply-last-seen-update`, created `Buy trail snacks` from a `this weekend @home` title with due date `2026-05-23`, and reported no browser console errors.
- Secret scan of changed metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `d557662` (`Add weekend task scheduling`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d16e7b31b737ff4b339a9` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d16e7b31b737ff4b339a9--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-19 19:06:46 MDT

- Added mobile-first Ask History Chips for faster repeated Ask Keeply follow-up questions.
- Ask Keeply now stores the last four asked questions in localStorage key `keeply-ask-history-v1`, dedupes repeated questions case-insensitively, and renders recent question chips before the existing suggested prompts so a tap refills the Ask field.
- Updated What's New metadata with latest id `2026-05-19-ask-history-chips`, title `Ask History Chips`, and 3 user-facing bullets.
- UI/code areas touched: Ask Keeply chip rendering and localStorage wiring in `app.js`, chip styling in `styles.css`, release metadata, package test wiring, and new helper/test files `ask-history.mjs` plus `test/ask-history.test.mjs`.
- AI/API behavior: no new endpoint or API key usage was added; submitted questions continue to use the existing `/api/ask` Anthropic flow with the existing local fallback, and history storage is deterministic local UI behavior.
- Verification: full `npm test` passed with 190 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4177 npm start` served `http://127.0.0.1:4177/` with HTTP 200. Browser verification confirmed the `Ask History Chips` What's New popup/dismiss persistence, a submitted Ask saving `What launch tasks are still open?` to `keeply-ask-history-v1`, recent chip rendering before suggestions, answer rendering, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the What's New popup visible and the Ask Keeply input/button/chips contained without obvious clipping or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Ask History Chips` What's New popup and bullets, persisted dismissal to `keeply-last-seen-update`, submitted `What tasks are due today?`, rendered a recent-history chip and answer, and reported no browser console errors.
- Secret scan of changed app/style/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `7b8f79e` (`Add Ask Keeply history chips`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d08fa6db9856e5504a1e3` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d08fa6db9856e5504a1e3--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 18:04:22 MDT

- Added mobile-first Note Pin Filters for faster pinned-note review in the Notes view.
- Notes now show compact All notes, Pinned, and Others filter chips with live counts; the pin filter composes with label, color, and search filters, appears in the active-filter summary, and persists in `keeply-view-preferences-v1` until Clear filters resets it.
- Updated What's New metadata with latest id `2026-05-19-note-pin-filters`, title `Note Pin Filters`, and 3 user-facing bullets.
- UI/code areas touched: note pin filter markup in `index.html`, filtering/render/preference wiring in `app.js`, active/empty-state filter helpers, responsive filter chip CSS, release metadata, package test wiring, and the new `note-pin-filters.mjs` helper plus `test/note-pin-filters.test.mjs`.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local filtering/count behavior only.
- Verification: full `npm test` passed with 185 passing tests; `git diff --check` passed.
- Local smoke verification: port 4175 was already in use, so `HOST=127.0.0.1 PORT=4176 npm start` served `http://127.0.0.1:4176/` with HTTP 200. Browser verification confirmed the `Note Pin Filters` What's New popup/dismiss persistence, Pinned filter persistence to `keeply-view-preferences-v1`, pinned-only rendering with Others hidden, active-filter summary copy, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the All notes/Pinned/Others filter chips readable, clearly selected, and free of obvious overlap or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Note Pin Filters` What's New popup, persisted dismissal to `keeply-last-seen-update`, filtered to pinned notes only, and reported no browser console errors.
- Secret scan of added lines in changed app/index/style/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `c59ade3` (`Add note pin filters`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0cfa6c7cbbcd4db0086cd9` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0cfa6c7cbbcd4db0086cd9--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 04:12:55 MDT

- Added Next Week Scheduling for faster mobile task planning beyond today/tomorrow.
- Task composer due presets and per-task due shortcut chips now include `Next week`, which sets the task due date 7 days from the current local date; typed single-task titles and pasted bulk task lines also understand `next week` and strip the hint from the saved title.
- Updated What's New metadata with latest id `2026-05-19-next-week-scheduling`, title `Next Week Scheduling`, and 3 user-facing bullets.
- UI/code areas touched: task due shortcut helper, task composer preset helper, bulk/single task hint parsing, responsive preset grid CSS, release metadata, and task scheduling tests.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task scheduling/parsing only.
- Verification: full `npm test` passed with 175 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Next Week Scheduling` What's New popup/bullets, dismiss persistence to `keeply-last-seen-update`, `Next week` composer preset setting a due date 7 days out with `Due in 7 days`, visible task-card `Next week` chips, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the four composer due presets and task-card due shortcut chips readable with no obvious overlap, clipping, or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Next Week Scheduling` What's New popup, persisted dismissal, exposed the `Next week` composer preset/task-card shortcut, and the preset set a due date 7 days out with no browser console errors.
- Secret scan of added lines in changed metadata/style/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `bcbf851` (`Add next week task scheduling`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0c378073599db2b936b181` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0c378073599db2b936b181--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-19 03:06:21 MDT

- Added mobile-first Navigation Badges for at-a-glance workspace counts in the side rail.
- Rail buttons now show compact badges for active notes, unfinished active tasks, archived items, and trashed items; completed active tasks are excluded from the task badge so the count reflects open work.
- Updated What's New metadata with latest id `2026-05-19-navigation-badges`, title `Navigation Badges`, and 3 user-facing bullets.
- UI/code areas touched: rail badge markup/accessibility in `index.html`, badge rendering in `app.js`, compact badge styling in `styles.css`, release metadata, package test wiring, and the new `navigation-badges.mjs` helper plus `test/navigation-badges.test.mjs`.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local UI/count behavior only.
- Verification: full `npm test` passed with the existing suite plus 2 new navigation-badge tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Navigation Badges` What's New popup, accessible rail labels with counts, visible badges after dismissing the popup, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the rail badges visible and readable with no obvious overlap, clipping, or horizontal overflow around the side rail/top app at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Navigation Badges` What's New popup, exposed rail labels for `Notes, 3 active notes` and `Tasks, 1 open task`, and browser console reported no errors.
- Secret scan of added lines in changed app/index/style/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `a8b56e8` (`Add navigation badges`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0c27fb6b9f0b6bbafc4fd0` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0c27fb6b9f0b6bbafc4fd0--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-19 01:07:20 MDT

- Added a mobile-first Search Clear Shortcut for faster recovery from note/task searches.
- Search rows now show a compact Clear button as soon as a query is typed; tapping it clears only the query, keeps active label/color/task filters in place, returns focus to search, and hides the shortcut again.
- Added search-clear.mjs and test/search-clear.test.mjs; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id 2026-05-19-search-clear-shortcut, title Search Clear Shortcut, and 3 user-facing bullets.
- UI/code areas touched: search row markup/accessibility in index.html, search-clear rendering/click wiring in app.js, mobile pill styling in styles.css, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local UI behavior only.
- Verification: full npm test passed with 176 tests across the existing suite plus the new search-clear helper tests; git diff --check passed.
- Local smoke verification: the local Node server on 127.0.0.1:4175 returned HTTP 200. Browser verification confirmed the Search Clear Shortcut What's New popup, visible Clear note search for market button after typing, one-tap query clearing, restored search input label, and no browser console errors.
- Mobile/layout verification: browser screenshot review with an active query found the Clear button readable with no obvious overlap, clipping, or horizontal overflow around the search row and layout-toggle button at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the Search Clear Shortcut What's New popup, and production browser smoke confirmed the Clear button appears for market, clears the query, hides afterward, and reports no browser console errors.
- Secret scan of added lines in changed app/index/style/package/metadata/helper/test files found no committed ANTHROPIC_API_KEY, long sk- key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit e0f0491 (Add search clear shortcut) was pushed to origin main; unrelated untracked backups/ was left untouched.
- Netlify production deploy succeeded with the existing production no-build command. Feature deploy 6a0c0bfecbcd4922a28473d7 is live at https://keeply-notes-aaron-20260516.netlify.app; deploy permalink is https://6a0c0bfecbcd4922a28473d7--keeply-notes-aaron-20260516.netlify.app.

## 2026-05-19 00:05:50 MDT

- Added Note Swipe Triage for safer mobile note cleanup.
- Active notes now swipe left into Archive instead of jumping straight to Trash, while right swipes still pin/unpin; Archive notes can swipe right to restore or left to move to Trash, and Trash notes can swipe right to restore.
- Added `note-swipe-actions.mjs` and `test/note-swipe-actions.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-19-note-swipe-triage`, title `Note Swipe Triage`, and 3 user-facing bullets.
- UI/code areas touched: note swipe decision helper, note card swipe handling in `app.js`, release metadata, package test wiring, and the new helper test. No CSS changes or new dependencies were needed.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local touch/gesture behavior only.
- Verification: full `npm test` passed with 173 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Note Swipe Triage` What's New popup, dismiss persistence to `keeply-last-seen-update`, dynamic-imported swipe rules for active/archive notes, and no browser console errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or horizontal overflow around the note list, composer, and floating Quick Add button at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Note Swipe Triage` What's New popup, persisted dismissal locally, and dynamic-imported production swipe rules returned active-left `archive` and archive-right `restore` with no browser console errors.
- Secret scan of added lines in changed app/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `21ee65c` (`Add note swipe triage`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0bfda1621125f5f1b2bde5` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0bfda1621125f5f1b2bde5--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 17:06:22 MDT

- Added context-aware Quick Add for faster mobile capture from the floating plus button.
- The FAB now updates its accessible label/title for notes versus tasks, opens the task composer from the Tasks view, keeps note capture for Notes/Archive/Trash, focuses the title field, and shows a concise ready toast.
- Added `quick-add-target.mjs` and `test/quick-add-target.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-context-quick-add`, title `Context Quick Add`, and 3 user-facing bullets.
- UI/code areas touched: Quick Add target helper, FAB render/click wiring in `app.js`, release metadata, package test wiring, and the new helper test. No CSS changes or new dependencies were needed.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local UI behavior only.
- Verification: full `npm test` passed with 150 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Context Quick Add` What's New popup, note-view `Quick add note`, task-view `Quick add task`, task-mode composer focus after tapping FAB, note-mode composer focus after returning to Notes, ready toasts, and no browser console errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or horizontal overflow around the floating Quick Add button, composer, and filter rows at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Context Quick Add` What's New popup, and a production console smoke test confirmed the Tasks-view FAB label, task composer focus, `Add task` state, and no browser console errors.
- Secret scan of added lines in changed app/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `4cfdb20` (`Add context-aware quick add`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b9b4d66fa152e3b931402` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b9b4d66fa152e3b931402--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 16:05:45 MDT

- Added smart bulk task hints for faster mobile task-list capture.
- Pasted multi-line task lists now understand per-line hints like `today`, `tomorrow`, `!high`, `#normal`, `@home`, and `#ideas`; hint words are stripped from the saved task title while shared composer defaults still fill missing metadata.
- Updated `task-bulk-entry.mjs` and `test/task-bulk-entry.test.mjs`; no new UI dependencies or Netlify functions were added.
- Updated What's New metadata with latest id `2026-05-18-smart-bulk-task-hints`, title `Smart Bulk Task Hints`, and 3 user-facing bullets.
- UI/code areas touched: bulk task parsing helper, bulk task tests, and release metadata only. The existing task composer and task cards surface the parsed labels/priorities/due dates.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local parsing only.
- Verification: full `npm test` passed with 147 tests after fixing a local-date parsing test issue; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Smart Bulk Task Hints` What's New popup, dismiss behavior, and a pasted list creating `Call dentist` as Home/High/due tomorrow plus `Draft launch note` as Ideas/Normal/no date; browser console reported no errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or horizontal overflow around the task filters, top task cards, composer, or newly created task cards at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Smart Bulk Task Hints` What's New popup before dismissal, and a production console smoke test created the same parsed bulk tasks in localStorage with no browser console errors.
- Secret scan of changed helper/test/metadata files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `b537582` (`Add smart bulk task hints`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b8d1221b8780e697ae394` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b8d1221b8780e697ae394--keeply-notes-aaron-20260516.netlify.app`.


## 2026-05-18 12:06:24 MDT

- Added body-first note titles for faster mobile note capture.
- Notes saved without a typed title now derive a compact title from the first meaningful body line, cleaning bullet/checklist markers and falling back to `Image note` for image-only captures.
- Added `note-title.mjs` and `test/note-title.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-body-first-note-titles`, title `Body-First Note Titles`, and 3 user-facing bullets.
- UI/code areas touched: note creation in `app.js`, release metadata, package test wiring, and the new title helper/test files. No CSS changes were needed.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local note-title cleanup only.
- Verification: full `npm test` passed with 136 tests after fixing one helper assertion; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Body-First Note Titles` What's New popup, dismiss behavior, a body-only bullet note saving with title `Call Sam about the venue`, and no browser console errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or horizontal overflow around the composer, note cards, or visible popup trigger at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Body-First Note Titles` What's New popup, and a body-only checklist note saved with title `Draft launch note from phone`; browser console reported no errors.
- Secret scan of changed app/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `933de33` (`Add body-first note titles`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b54f9b3c49ec5de93c0d9` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b54f9b3c49ec5de93c0d9--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-18 11:08:08 MDT

- Added mobile-first Ask Keeply suggestions for faster question starts.
- Ask Keeply now renders local suggested-question chips from active notes/tasks, prioritizing overdue/today tasks, pinned notes, and busy labels; tapping a chip fills the Ask field without mutating saved data.
- Added `ask-suggestions.mjs` and `test/ask-suggestions.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-ask-suggestions`, title `Ask Suggestions`, and 3 user-facing bullets.
- UI areas touched: Ask Keeply markup in `index.html`, suggestion rendering/click wiring in `app.js`, mobile horizontal chip styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added; suggestions are deterministic local heuristics, and submitted questions continue to use the existing `/api/ask` Anthropic flow with the existing local fallback if that endpoint is unavailable.
- Verification: full `npm test` passed with 132 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Ask Suggestions` What's New popup, visible Ask suggestion chips, chip-to-input fill behavior, no document-level horizontal overflow, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the Ask suggestion chips readable with no obvious overlap, clipping, or horizontal page overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Ask Suggestions` What's New popup and suggestion chips; console smoke clicked a suggestion and confirmed it filled the Ask input with no browser console errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `1906454` (`Add Ask Keeply suggestions`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b473f3a1e9c5fa1ad2f77` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b473f3a1e9c5fa1ad2f77--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 10:09:43 MDT

- Added a mobile-first Cleanup Spotlight for Archive and Trash review.
- Archive and Trash now show a compact card for the latest saved-away note or task, including note/task counts and a Review action that clears filters/search context and jumps to the matching card.
- Added `cleanup-spotlight.mjs` and `test/cleanup-spotlight.test.mjs`; wired both into `npm test` syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-cleanup-spotlight`, title `Cleanup Spotlight`, and 3 user-facing bullets.
- UI areas touched: cleanup spotlight markup in `index.html`, archive/trash rendering and review-button wiring in `app.js`, mobile card styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 128 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Cleanup Spotlight` What's New popup, the Archive cleanup spotlight after archiving a note, the Review note action applying the search/jump flow, and no browser console errors.
- Mobile/layout verification: browser snapshot and screenshot review found the Cleanup Spotlight card readable with no obvious overlap, clipping, or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: production loaded at `https://keeply-notes-aaron-20260516.netlify.app`; the `Cleanup Spotlight` What's New popup appeared, seeded production localStorage verification showed the Archive Cleanup Spotlight with a Review note button, and browser console reported no errors. The initial deploy permalink navigation timed out once, but the canonical production URL loaded and verified the deploy.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `42d08a6` (`Add cleanup spotlight`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b396f9caeeb72190d9863` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b396f9caeeb72190d9863--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 09:06:16 MDT

- Added mobile-friendly Note Label Shortcuts for faster note reclassification.
- Note cards now show compact Work/Home/Ideas/Personal chips that hide the card’s current label and let the user move a note immediately without opening Edit.
- Added `note-label-shortcuts.mjs` and `test/note-label-shortcuts.test.mjs`; wired both into `npm test` syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-note-label-shortcuts`, title `Note Label Shortcuts`, and 3 user-facing bullets.
- UI areas touched: note card template in `index.html`, note rendering/update wiring in `app.js`, mobile chip styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 125 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Note Label Shortcuts` What's New popup, visible note label shortcut chips, a label chip updating a note/counts, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the quick note label chips readable with no obvious overlap, clipping, or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded in browser, showed the `Note Label Shortcuts` What's New popup and note label shortcut chips, and browser console reported no errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `00331f5` (`Add note label shortcuts`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b2ad2f767c73ea0bafe62` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b2ad2f767c73ea0bafe62--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-18 08:06:42 MDT

- Added a mobile-first Note Spotlight card for faster note resurfacing.
- Notes view now shows a compact spotlight above the composer, preferring the most recently updated pinned note and falling back to the most recent active note.
- The card previews the note body and includes a `Show pinned` / `Show note` button that clears note filters, searches for the spotlighted title, and scrolls to the matching pinned or regular note list.
- Added `note-spotlight.mjs` and `test/note-spotlight.test.mjs`; wired both into `npm test` syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-note-spotlight`, title `Note Spotlight`, and 3 user-facing bullets.
- UI areas touched: Notes dashboard markup in `index.html`, note spotlight rendering/jump wiring in `app.js`, mobile-friendly card styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 122 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Note Spotlight` What's New popup, the Notes view spotlight card, the spotlight button filtering to a matching note, and no browser console errors.
- Mobile/layout verification: browser snapshot and screenshot review found no severe overlap, clipping, or unreadable text around the new spotlight card at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded in browser, showed the `Note Spotlight` What's New popup and Notes view spotlight card, and browser console reported no errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `cb84ee1` (`Add note spotlight card`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b1cd9b3c49e14b393c032` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b1cd9b3c49e14b393c032--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-18 07:07:39 MDT

- Added a mobile-first Next Task Highlight for faster task triage.
- Tasks view now shows a compact `Next task` card above the Today progress card, selecting the most urgent open task by due window (overdue, today, upcoming, no date), priority, due date, and recent update.
- The card includes a `Show overdue` / `Show today` / `Show task` button that clears filters and jumps to the matching task window, so the highlighted task is easier to act on from mobile.
- Added `next-task.mjs` and `test/next-task.test.mjs`; wired both into `npm test` syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-next-task-highlight`, title `Next Task Highlight`, and 3 user-facing bullets.
- UI areas touched: task dashboard markup in `index.html`, task highlight rendering/filter jump wiring in `app.js`, mobile-friendly card styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 118 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Next Task Highlight` What's New popup, the Tasks view `Next task` card, and no browser console errors.
- Mobile/layout verification: browser snapshot and screenshot review found no obvious overlap, clipping, or unreadable controls around the new `Next task` card at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded in browser, showed the `Next Task Highlight` What's New popup, and the Tasks view showed the `Next task` card with no browser console errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `80b0081` (`Add next task highlight`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b0ef9bd35e8aa8c9cd561` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b0ef9bd35e8aa8c9cd561--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 06:05:16 MDT

- Added recent note ordering for faster mobile note resurfacing.
- Notes now sort newest-updated first within pinned and unpinned groups, so edited or changed notes move back toward the top while pinned notes still stay prioritized.
- Added `note-sort.mjs` and `test/note-sort.test.mjs`; wired both into `npm test` syntax checks and the full `node --test` suite.
- Updated What's New metadata with latest id `2026-05-18-recent-note-ordering`, title `Recent Note Ordering`, and 3 user-facing bullets.
- UI areas touched: note ordering in `app.js`, release metadata, package test wiring, and the new helper/test files. No style changes were needed.
- AI/API behavior: no new AI endpoint or API key usage was added.
- Verification: full `npm test` passed with 118 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Recent Note Ordering` What's New popup, recent-first note ordering in the note list, and no browser console errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or unreadable controls around the note list/top composer area at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded in browser, showed the `Recent Note Ordering` What's New popup, and browser console reported no errors.
- Secret scan of changed app/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, or token assignments.
- Git status: feature commit `fbb66a5` (`Sort notes by recent updates`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b0068306cb29247d23316` and final post-log deploy `6a0b00ab2a16848677a634ee` are live at `https://keeply-notes-aaron-20260516.netlify.app`; final deploy permalink is `https://6a0b00ab2a16848677a634ee--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-18 05:06:59 MDT

- Added search capture drafts for faster mobile recovery when a search turns up empty.
- Empty note/task search results now show a secondary `Capture as note` or `Capture as task` action; using it clears the search, preloads the composer with the query, and applies lightweight task due/priority hints for words like today, tomorrow, urgent, or asap.
- Added `search-capture.mjs` and `test/search-capture.test.mjs`; wired both into `npm test` syntax checks and the full `node --test` suite.
- Updated What's New metadata with latest id `2026-05-18-search-capture-drafts`, title `Capture Search Drafts`, and 3 user-facing bullets.
- UI areas touched: empty-state markup in `index.html`, empty-state capture wiring in `app.js`, secondary empty-state button styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added; the task draft hints are local deterministic heuristics only.
- Verification: full `npm test` passed with 114 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Capture Search Drafts` What's New popup, an empty note search showed `Capture as note`, invoking the action populated the composer and cleared the search, and browser console reported no errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or unreadable controls around the search-capture composer flow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded in browser, showed the `Capture Search Drafts` What's New popup, an empty search exposed `Capture as note`, console-clicking it populated the note draft and cleared search with no browser console errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, or token assignments.
- Git status: feature commit `64bce19` (`Add search capture drafts`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Deploy `6a0af2a518bb02523fdeec27` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0af2a518bb02523fdeec27--keeply-notes-aaron-20260516.netlify.app`.
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

## 2026-05-18 13:06:39 MDT

- Added a mobile-first Mark done action to the Next task card for faster task triage.
- The Tasks dashboard now shows `Mark done` beside the existing Show action when a next task is available; tapping it completes the highlighted task, refreshes the next recommendation, and keeps the existing Undo toast flow.
- Updated `next-task.mjs` metadata returned to the UI (`canComplete`, `completeLabel`, and accessible complete labels) and extended `test/next-task.test.mjs` coverage.
- Updated What's New metadata with latest id `2026-05-18-next-task-done-button`, title `Next Task Done Button`, and 3 user-facing bullets.
- UI/code areas touched: `index.html` Next task card actions, `app.js` completion wiring, `styles.css` responsive button layout, `next-task.mjs`, release metadata, and `test/next-task.test.mjs`.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task-completion wiring only.
- Verification: full `npm test` passed with 136 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Next Task Done Button` What's New popup, visible Mark done and Show buttons on the Tasks view Next task card, Mark done completing the highlighted task and refreshing the recommendation, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the Next task action buttons readable with no overlap or clipping in the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool, but CSS stacks/wraps the actions for smaller widths.
- Production verification: production loaded at `https://keeply-notes-aaron-20260516.netlify.app`; the `Next Task Done Button` What's New popup appeared, the Tasks view exposed the Mark done button, clicking it completed the highlighted task and changed the card to `No open tasks`, and browser console reported no errors. The deploy permalink timed out once, but the canonical production URL loaded and verified the deploy.
- Secret scan of changed app/style/test/metadata/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `d8e6aac` (`Add next task done button`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Deploy `6a0b63019a0b7a00dc664b1a` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b63019a0b7a00dc664b1a--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 14:06:36 MDT

- Added mobile-first Composer Checklists for faster note/task outline capture.
- The composer now includes a `Checklist` button that inserts a fresh `- [ ]` line at the cursor or converts selected body/detail lines into checklist rows while preserving existing checked rows.
- Added `composer-checklist.mjs` and `test/composer-checklist.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-composer-checklists`, title `Composer Checklists`, and 3 user-facing bullets.
- UI/code areas touched: composer toolbar markup in `index.html`, checklist insertion wiring in `app.js`, mobile-friendly button styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local composer text insertion only.
- Verification: full `npm test` passed with 141 tests after correcting two expected selection-length assertions; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Composer Checklists` What's New popup, dismiss behavior, visible Checklist button, selected-line conversion to `- [ ] Milk` / `- [ ] Bread`, no document-level horizontal overflow, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the composer controls, including Checklist, readable with no obvious overlap, clipping, or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Composer Checklists` What's New popup and Checklist button, converted selected lines to `- [ ] Alpha` / `- [ ] Beta`, had no document-level horizontal overflow, and browser console reported no errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `f0fc5e0` (`Add composer checklist insertion`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b712c4be7224691852b00` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b712c4be7224691852b00--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-18 15:05:44 MDT

- Added mobile-first Task Checklist Progress for markdown checkbox details.
- Task cards now show a compact `1/3 checked`-style pill when task details contain `- [ ]` or `- [x]` checklist rows, helping checklist-heavy tasks scan faster on mobile.
- Checklist-free tasks stay unchanged with no extra metadata pill.
- Added `task-checklist-meta.mjs` and `test/task-checklist-meta.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-task-checklist-progress`, title `Task Checklist Progress`, and 3 user-facing bullets.
- UI/code areas touched: task card template in `index.html`, task rendering in `app.js`, mobile-friendly pill styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local checklist metadata only.
- Verification: full `npm test` passed with 145 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Task Checklist Progress` What's New popup, dismiss behavior, a task with checklist details showing `1/3 CHECKED`, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the new checklist progress pill and task-card meta row readable with no obvious overlap, clipping, or horizontal overflow in the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Task Checklist Progress` What's New popup, and a production browser smoke task with checklist details rendered `1/2 CHECKED`; browser console reported no errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `f037f4b` (`Add task checklist progress pills`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0b7f0fb59f1475736cac4f` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0b7f0fb59f1475736cac4f--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 18:05:07 MDT

- Added mobile-first Note Checklist Progress for markdown checkbox notes.
- Note cards now show a compact 1/3 checked-style pill when note bodies contain markdown checklist rows, helping checklist-heavy notes scan faster on mobile.
- Checklist-free notes stay unchanged with no extra metadata.
- Added note-checklist-meta.mjs and test/note-checklist-meta.test.mjs; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id 2026-05-18-note-checklist-progress, title Note Checklist Progress, and 3 user-facing bullets.
- UI/code areas touched: note card template in index.html, note rendering in app.js, mobile-friendly pill styling in styles.css, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local checklist metadata only.
- Verification: full npm test passed with 154 tests; git diff --check passed.
- Local smoke verification: the local server served Keeply with HTTP 200. Browser verification confirmed the Note Checklist Progress What's New popup, dismiss behavior, a note with checklist body showing 1/3 checked, no document-level horizontal overflow, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the new checklist progress pill visible and unclipped with no obvious overlap or horizontal overflow in the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the Note Checklist Progress What's New popup, and dynamic module smoke checks confirmed latest release metadata plus getNoteChecklistMeta on one checked and one unchecked item returning 1/2 checked; browser console reported no errors.
- Secret scan of changed app/style/test/metadata/package/helper files found no committed ANTHROPIC_API_KEY, long sk- key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit 1d7f242 (Add note checklist progress pills) was pushed to origin main; unrelated untracked backups/ was left untouched.
- Netlify production deploy succeeded with Netlify CLI. Feature deploy 6a0ba910c69e7a4f03f888df is live at https://keeply-notes-aaron-20260516.netlify.app and deploy permalink is https://6a0ba910c69e7a4f03f888df--keeply-notes-aaron-20260516.netlify.app


## 2026-05-18 19:06:13 MDT

- Added Task Due Hints for clearer mobile task capture.
- The task composer now shows a plain-language due-date hint under the date picker, updating for no date, today, tomorrow, overdue dates, and upcoming dates when presets or manual date changes are used.
- Added `getTaskComposerDueHint` to `task-composer-presets.mjs` and expanded `test/task-composer-presets.test.mjs` coverage for relative, overdue, far-future, and invalid dates.
- Updated What's New metadata with latest id `2026-05-18-task-due-hints`, title `Task Due Hints`, and 3 user-facing bullets.
- UI/code areas touched: task composer markup in `index.html`, due-hint rendering in `app.js`, task composer hint styling in `styles.css`, release metadata, and task composer preset helper/tests. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local date copy only.
- Verification: full `npm test` passed with 156 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Task Due Hints` What's New popup, task composer `No date selected`, preset-driven `Due today` / `Due tomorrow`, manual overdue `Overdue by 1 day`, no document-level horizontal overflow, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the due-date hint visible and readable with no obvious clipping, overlapping controls, or horizontal overflow in the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Task Due Hints` What's New popup, and a production console smoke test confirmed the task composer `Due tomorrow` hint/preset state with no horizontal overflow and no browser console errors.
- Secret scan of added lines in changed app/style/HTML/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `c74804a` (`Add task due hints`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0bb76aa94d75717ddb78a8` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0bb76aa94d75717ddb78a8--keeply-notes-aaron-20260516.netlify.app`.


## 2026-05-18 20:06:14 MDT

- Added a mobile-first Draft Resume Card for unsaved note/task composer drafts.
- When Keeply restores a saved composer draft on load, the composer now shows a compact card with the draft type, title/body fallback, label, task priority/due-state, or attached-image context, plus a one-tap Discard action.
- Added getComposerDraftResume to composer-draft.mjs and expanded test/composer-draft.test.mjs coverage for task summaries, body fallback titles, image context, and empty drafts.
- Updated What's New metadata with latest id 2026-05-18-draft-resume-card, title Draft Resume Card, and 3 user-facing bullets.
- UI/code areas touched: composer markup in index.html, restored-draft rendering/discard wiring in app.js, mobile-friendly card styling in styles.css, release metadata, and composer draft helper/tests. No new dependencies or Netlify functions were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local draft-resume UI only.
- Verification: full npm test passed with 158 tests; git diff --check passed.
- Local smoke verification: local server on port 4175 served Keeply with HTTP 200. Browser verification confirmed the Draft Resume Card What's New popup, a seeded restored task draft showing the resume card, restored task composer fields, Discard clearing the composer/localStorage draft, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the composer and new draft resume card readable with no obvious overlap, clipped text, or horizontal overflow in the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the Draft Resume Card What's New popup, and a production console smoke test confirmed latest release metadata plus a seeded restored task draft card with Add task state and no browser console errors.
- Secret scan of added lines in changed app/style/HTML/metadata/helper/test files found no committed ANTHROPIC_API_KEY, long sk- key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit 8ae1d03 (Add draft resume card) was pushed to origin main; unrelated untracked backups/ was left untouched.
- Netlify production deploy succeeded with npx netlify deploy --prod --dir . --no-build --json. Feature deploy 6a0bc576566d098d5227d3d0 is live at https://keeply-notes-aaron-20260516.netlify.app and deploy permalink is https://6a0bc576566d098d5227d3d0--keeply-notes-aaron-20260516.netlify.app

## 2026-05-18 21:06:57 MDT

- Added detail-first task titles for faster mobile task capture when the title box is skipped.
- Task mode now derives a compact title from the first meaningful details line for single-detail drafts, cleaning bullet, checklist, and numbered prefixes; multi-line pasted lists still use the existing bulk-task flow.
- Added `task-title.mjs` and `test/task-title.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-detail-first-task-titles`, title `Detail-First Task Titles`, and 3 user-facing bullets.
- UI/code areas touched: task creation in `app.js`, release metadata, package test wiring, and the new task-title helper/test files. No CSS changes, Netlify functions, AI endpoint changes, or new dependencies were added.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task-title cleanup only.
- Verification: full `npm test` passed with 163 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Detail-First Task Titles` What's New popup, a details-only checklist task saving as `Refill printer paper`, no document-level horizontal overflow, and no browser console errors. A first multi-line trial correctly exercised the pre-existing bulk-task paste path instead of the single-task title derivation.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or horizontal overflow around the task composer and task cards at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Detail-First Task Titles` What's New popup, and a production console smoke test confirmed a details-only checklist task saved as `Refill travel toiletries`, with no horizontal overflow and no browser console errors.
- Secret scan of changed app/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `7fc0ec6` (`Add detail-first task titles`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0bd3a78623a0abc2d2e9f9` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0bd3a78623a0abc2d2e9f9--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 22:06:49 MDT

- Added single task capture hints for faster mobile task entry.
- Quick task titles now understand hints like `tomorrow`, `!high`, `#low`, `@home`, `#ideas`, `urgent`, and `asap`; Keeply strips those hints from the saved title while applying the due date, priority, and label.
- Detail-first task capture reuses the same hint parsing when the first detail line becomes the task title.
- Added `task-capture-hints.mjs` and `test/task-capture-hints.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-single-task-hints`, title `Single Task Hints`, and 3 user-facing bullets.
- UI/code areas touched: single-task creation in `app.js`, release metadata, package test wiring, and the new task capture helper/test. No CSS changes or new dependencies were needed.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local parsing only.
- Verification: full `npm test` passed with 167 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Single Task Hints` What's New popup/dismissal and a task typed as `Pay insurance tomorrow !high @personal` saved as `Pay insurance` with Personal label, High priority, and tomorrow due date. Browser console reported no errors.
- Mobile/layout verification: browser screenshot review found no obvious overlap, clipping, or horizontal overflow around the task filters, composer controls, task cards, or floating Quick Add button at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Single Task Hints` What's New popup, and a production smoke test saved `Renew parking tomorrow !high @personal` as `Renew parking` with Personal label, High priority, and tomorrow due date. Browser console reported no errors.
- Secret scan of added lines in changed app/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `e36d7fd` (`Add single task capture hints`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0be1acf9f01ed16106ed29` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0be1acf9f01ed16106ed29--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-18 23:07:04 MDT

- Added clear Trash/Archive restore actions for safer mobile cleanup recovery.
- Cards in Archive and Trash now show a visible `Restore` button, and Trash restore returns notes/tasks directly to active lists instead of moving them to Archive first.
- Added `item-status-actions.mjs` and `test/item-status-actions.test.mjs`; wired the helper into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-18-trash-restore-actions`, title `Trash Restore Actions`, and 3 user-facing bullets.
- UI/code areas touched: note/task card action wiring in `app.js`, restore button styling in `styles.css`, release metadata, package test wiring, and the new status-action helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local UI/status handling only.
- Verification: full `npm test` passed with 170 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Trash Restore Actions` What's New popup, visible Trash-view `Restore note` buttons, restoring a trash note back to active status, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the Trash-view Restore buttons readable with no obvious overlap, clipping, or horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded and showed the `Trash Restore Actions` What's New popup. A production dynamic-import smoke check confirmed Trash/Archive restore action metadata resolves to active status and delete-forever labels remain scoped to Trash; browser console reported no errors.
- Secret scan of changed app/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignments, token assignments, or API key assignments.
- Git status: feature commit `716a847` (`Add trash restore actions`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0befd494a2e7f29ec6d7fd` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0befd494a2e7f29ec6d7fd--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 02:07:52 MDT

- Added a mobile-first Sync Status Pill for clearer cloud/local save awareness.
- The top bar now shows a compact status badge that updates across Syncing, Synced, Offline, Local changes, and Saved locally states, with accessible status text and a colored dot that fits beside the theme button.
- Added `sync-status.mjs` and `test/sync-status.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-19-sync-status-pill`, title `Sync Status Pill`, and 3 user-facing bullets.
- UI/code areas touched: topbar markup in `index.html`, sync state transitions in `app.js`, responsive pill styling in `styles.css`, release metadata, package test wiring, and the new helper/test files.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic sync-status UI around the existing `/api/items` save/load flow.
- Verification: full `npm test` passed with 180 tests across the existing suite plus the new sync-status helper tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Sync Status Pill` What's New popup, the topbar badge reaching `Synced`, a simulated failed save showing `Saved locally`, no browser console errors after verification, and no document-level horizontal overflow.
- Mobile/layout verification: browser screenshot review after dismissing the popup found the `Saved locally` pill readable with no overlap against the Notes title or theme button, no clipping, and no obvious horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Sync Status Pill` What's New popup, and production browser smoke confirmed the topbar badge reached `Synced` with no console errors and no horizontal overflow.
- Secret scan of added lines in changed app/index/style/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, secret assignment, token assignment, or API key assignment.
- Git status: feature commit `d9f8d74` (`Add sync status pill`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0c1a42889aea5fdfb82d2a` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0c1a42889aea5fdfb82d2a--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 05:08:57 MDT

- Added mobile-first Priority Composer Chips for faster task capture without opening the priority select menu.
- Task mode now shows High, Normal, and Low chips below the due presets; the active chip stays highlighted and stays in sync with the dropdown.
- Updated What's New metadata with latest id `2026-05-19-priority-composer-chips`, title `Priority Composer Chips`, and 3 user-facing bullets.
- UI/code areas touched: task composer markup in `index.html`, priority chip rendering/wiring in `app.js`, responsive chip styling in `styles.css`, release metadata, package test wiring, and the new `task-composer-priorities.mjs` helper plus `test/task-composer-priorities.test.mjs`.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task-composer UI behavior only.
- Verification: full `npm test` passed with 179 tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/` with HTTP 200. Browser verification confirmed the `Priority Composer Chips` What's New popup, dismissal persistence to `keeply-last-seen-update`, task-mode High/Normal/Low priority chips, chip-driven priority updates, no document horizontal overflow, and no browser console errors.
- Mobile/layout verification: browser screenshot review found the new priority chips visible/readable with no obvious overlap, clipping, or horizontal overflow around the task composer at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Priority Composer Chips` What's New popup, persisted dismissal, exposed the task composer priority chips, a chip click updated the priority/select state, and browser console reported no errors.
- Secret scan of added lines in changed app/index/style/package/metadata/helper/test files found no committed `ANTHROPIC_API_KEY`, long standalone `sk-` key, secret assignment, token assignment, or API key assignment. A naive `sk-` regex matched CSS class substrings in `task-composer-priority-preset`, which was manually reviewed as a false positive.
- Git status: feature commit `089bc36` (`Add task priority composer chips`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0c44adcc01ec070efbc919` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0c44adcc01ec070efbc919--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 06:12:54 MDT

- Added mobile-first Composer Label Chips for faster task/note capture without opening the label select menu.
- Composer mode now shows Ideas, Work, Home, and Personal chips; the active chip stays highlighted and stays in sync with the label dropdown for quick one-tap relabeling.
- Updated What's New metadata with latest id `2026-05-19-composer-label-chips`, title `Composer Label Chips`, and concise user-facing bullets.
- UI/code areas touched: composer markup in `index.html`, label chip rendering/wiring in `app.js`, responsive chip styling in `styles.css`, release metadata, package test wiring, and the new `composer-labels.mjs` helper plus `test/composer-labels.test.mjs`.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local composer UI behavior only.
- Verification: full `npm test` passed with 181 tests; `git diff --check` passed during the run.
- Local smoke verification: `HOST=127.0.0.1 PORT=4175 npm start` served `http://127.0.0.1:4175/`. Browser verification confirmed the `Composer Label Chips` What's New popup, task-mode label chips, chip-driven label dropdown updates, no browser console errors, and no obvious horizontal overflow.
- Mobile/layout verification: browser screenshot review found the 2-column mobile chip grid readable with no obvious overlap, clipping, or horizontal overflow around the composer at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded at `https://6a0c52fa36e688007e88ee0c--keeply-notes-aaron-20260516.netlify.app/`, showing the latest production app after deployment.
- Secret scan of the final diff found no committed `ANTHROPIC_API_KEY`, long `sk-` key, `api_key`, secret assignment, or token assignment patterns.
- Git status: feature commit `9bcf439` (`Add composer label chips`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded. Feature deploy permalink is `https://6a0c52fa36e688007e88ee0c--keeply-notes-aaron-20260516.netlify.app/`; production site is `https://keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 07:12:35 MDT

- Added mobile-first Task Status Filters to the Tasks view: compact All status, Open, and Done chips with live counts.
- Status filtering now composes with task date windows, priority filters, labels, and search; the active filter summary/empty-state recovery includes the new completion filter.
- Persisted the selected task status filter in local view preferences, and completed tasks now expose a clearer `Reopen task` control label when visible through the Done filter.
- Updated What's New metadata with latest id `2026-05-19-task-status-filters`, title `Task Status Filters`, and 3 user-facing bullets.
- UI/code areas touched: task filter markup in `index.html`, task filtering/rendering in `app.js`, responsive chip styling in `styles.css`, release metadata, active-filter and empty-state helpers, view preferences, package test wiring, and the new `task-completion-filters.mjs` helper plus `test/task-completion-filters.test.mjs`.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task filtering behavior only.
- Verification: full `npm test` passed; `git diff --check` passed; secret scan of the final diff found no committed `ANTHROPIC_API_KEY`, long `sk-` key, `api_key`, secret assignment, or token assignment patterns.
- Local smoke verification: existing local server at `http://127.0.0.1:4175/` loaded successfully. Browser verification confirmed the `Task Status Filters` What's New popup, dismissal, Tasks view All/Open/Done chips with counts, Done filtering, active filter chip, `Reopen task` accessibility labels for completed tasks, no browser console errors, and no obvious horizontal overflow.
- Mobile/layout verification: browser screenshot review found the date, priority, and completion filter rows readable with no obvious overlap, clipping, or horizontal page overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded at `https://6a0c61a49806522b5f3eb911--keeply-notes-aaron-20260516.netlify.app/`, showed the `Task Status Filters` What's New popup, exposed the new completion chips in Tasks, and browser console reported no errors.
- Git status: feature commit `410927d` (`Add task status filters`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0c61a49806522b5f3eb911` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0c61a49806522b5f3eb911--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 08:06:11 MDT

- Added mobile-first Next Week Note Follow-Ups so active notes can become dated follow-up tasks for the following week without opening the composer.
- Note cards now show `Task today`, `Task tomorrow`, and `Task next week` follow-up shortcuts; each created task keeps the note title/body/label/source note and gets the selected due date.
- Updated follow-up confirmation copy for all shortcut timings while preserving the existing Undo flow.
- Updated What's New metadata with latest id `2026-05-19-note-next-week-followups`, title `Next Week Note Follow-Ups`, and 3 user-facing bullets.
- UI/code areas touched: `note-followups.mjs`, note-card follow-up rendering in `app.js`, mobile follow-up grid styling in `styles.css`, release metadata, and `test/note-followups.test.mjs`.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local note-to-task scheduling behavior only.
- Verification: full `npm test` passed with 182 passing tests; `git diff --check` passed; secret scan of added lines found no committed `ANTHROPIC_API_KEY`, long `sk-` key, API key, secret, or token assignment patterns.
- Local smoke verification: local server on port 4176 served `http://127.0.0.1:4176/` with HTTP 200. Browser verification confirmed the `Next Week Note Follow-Ups` What's New popup, dismissal persistence to `keeply-last-seen-update`, visible `Task next week` note buttons, next-week task creation with a due date 7 days out, no browser console errors, and no document horizontal overflow.
- Mobile/layout verification: browser screenshot review found the new follow-up button visible/readable with no obvious overlap, clipping, or horizontal overflow; at the available responsive viewport the flex row wrapped the third button cleanly on wider cards, while the mobile media rule uses a compact three-column grid. Exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Next Week Note Follow-Ups` What's New popup after clearing the local last-seen key, exposed `Task today`/`Task tomorrow`/`Task next week` follow-up buttons, reported no horizontal overflow, and browser console reported no errors.
- Git status: feature commit `1584fbd` (`Add next week note follow-ups`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0c6e37a881e759dcfd7691` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0c6e37a881e759dcfd7691--keeply-notes-aaron-20260516.netlify.app`.

## 2026-05-19 16:00:45 MDT

- Added mobile-first Tomorrow Task Filter for faster next-day task planning in the Tasks view.
- Tasks date filters now include a dedicated `Tomorrow` chip between Today and Upcoming; the chip has a live count, composes with label/priority/status/search filters, appears in the active-filter summary, and persists through view preferences.
- Updated What's New metadata with latest id `2026-05-19-tomorrow-task-filter`, title `Tomorrow Task Filter`, and 3 user-facing bullets.
- UI/code areas touched: task date filter helper, task filter markup in `index.html`, active filter labels, view preference validation, release metadata, and task/filter preference tests.
- AI/API behavior: no new AI endpoint or API key usage was added; the improvement is deterministic local task filtering behavior only.
- Verification: full `npm test` passed with 182 passing tests; `git diff --check` passed; secret scan of added lines found no committed `ANTHROPIC_API_KEY`, long `sk-` key, API key, secret, or token assignment patterns.
- Local smoke verification: port 4175 was already in use, so `HOST=127.0.0.1 PORT=4180 npm start` served `http://127.0.0.1:4180/` with HTTP 200. Browser verification confirmed the `Tomorrow Task Filter` What's New popup and bullets, dismiss persistence to `keeply-last-seen-update`, the Tasks-view Tomorrow chip with live counts, active-filter summary, no browser console errors, and no document horizontal overflow.
- Mobile/layout verification: browser screenshot review found the expanded task filter rows readable with the new Tomorrow chip active, no obvious overlap or clipping, and no visible horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Tomorrow Task Filter` What's New popup after clearing the local last-seen key, exposed the Tasks-view Tomorrow chip with count `1`, persisted dismissal, selected the Tomorrow filter, reported no horizontal overflow, and browser console reported no errors.
- Git status: feature commit `3721683` (`Add tomorrow task filter`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0cdd6ff93d2b0811a1d6b5` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0cdd6ff93d2b0811a1d6b5--keeply-notes-aaron-20260516.netlify.app`.
## 2026-05-20 02:08:28 MDT

- Added Ask Answer Notes so Ask Keeply results can be saved directly into the notes workspace from mobile.
- Ask answer cards now show a `Save as note` action; saved notes include the original question, answer, next step, and up to four source references, then jump to the new note in Notes with the answer title in search.
- Added `ask-answer-note.mjs` and `test/ask-answer-note.test.mjs`; wired both into syntax checks and the Node test suite.
- Updated What's New metadata with latest id `2026-05-20-ask-answer-notes`, title `Ask Answer Notes`, and 3 user-facing bullets.
- UI/code areas touched: Ask Keeply answer rendering in `app.js`, Ask answer button styling in `styles.css`, release metadata, package test wiring, and the new answer-to-note helper/test files.
- AI/API behavior: no new endpoint or secret usage was added; the feature reuses the existing Ask Keeply `/api/ask` flow when available and still works with the existing local Ask fallback.
- Verification: full `npm test` passed with 200 passing tests; `git diff --check` passed.
- Local smoke verification: `HOST=127.0.0.1 PORT=4181 npm start` served `http://127.0.0.1:4181/` with HTTP 200. Browser verification confirmed the `Ask Answer Notes` What's New popup/localStorage dismissal, Ask answer `Save as note` button, saved note titled `Ask: What should I remember about dinner?`, no browser console errors, and no document horizontal overflow.
- Mobile/layout verification: browser snapshot/DOM checks found the Ask answer action and saved-note search flow usable with no obvious horizontal overflow at the available responsive viewport; exact narrow-phone viewport resizing was not available in the browser tool.
- Production verification: deploy permalink loaded, showed the `Ask Answer Notes` What's New popup after clearing the local last-seen key, exposed the Ask answer `Save as note` action, saved an Ask answer as `Ask: What did I say about check-in?`, and browser console reported no errors.
- Secret scan of changed app/style/metadata/helper/test/package files found no committed `ANTHROPIC_API_KEY`, long `sk-` key, API key, secret, or token assignment patterns.
- Git status: feature commit `463054c` (`Add Ask answer note saving`) was pushed to `origin main`; unrelated untracked `backups/` was left untouched.
- Netlify production deploy succeeded with `npx netlify deploy --prod --dir . --no-build --json`. Feature deploy `6a0d6bc8498d885be1963a60` is live at `https://keeply-notes-aaron-20260516.netlify.app`; deploy permalink is `https://6a0d6bc8498d885be1963a60--keeply-notes-aaron-20260516.netlify.app`.

