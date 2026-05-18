export const appUpdates = [
  {
    id: "2026-05-18-next-task-highlight",
    title: "Next Task Highlight",
    bullets: [
      "Tasks now show a compact Next up card that points at the most urgent open task.",
      "Overdue and today tasks are prioritized before upcoming or unscheduled work.",
      "The Show task button jumps straight to the matching task window for faster mobile triage."
    ]
  },
  {
    id: "2026-05-18-recent-note-ordering",
    title: "Recent Note Ordering",
    bullets: [
      "Notes now stay ordered by the most recently updated cards inside each pinned or unpinned group.",
      "Edited notes move back toward the top so fresh context is easier to find on mobile.",
      "Pinned notes still keep their priority while using the same newest-first ordering."
    ]
  },
  {
    id: "2026-05-18-search-capture-drafts",
    title: "Capture Search Drafts",
    bullets: [
      "Empty search results now offer a quick Capture action instead of leaving the query behind.",
      "Notes searches become note drafts, while task searches become task drafts with lightweight due and priority hints.",
      "Keeply clears the search and scrolls you back to the composer so the draft is ready to save or refine."
    ]
  },
  {
    id: "2026-05-18-empty-filter-recovery",
    title: "Empty Filter Recovery",
    bullets: [
      "Empty filtered views now explain when filters are hiding cards.",
      "A Clear filters button appears right in the empty state for one-tap recovery.",
      "Archive and Trash now use clearer empty-view copy on mobile."
    ]
  },
  {
    id: "2026-05-18-today-task-progress",
    title: "Today Task Progress",
    bullets: [
      "Tasks now show a compact Today progress card above the mobile composer.",
      "See done, open, high-priority, and tomorrow counts without changing filters.",
      "A lightweight progress bar makes the day’s task load easier to scan."
    ]
  },
  {
    id: "2026-05-18-collapsible-task-details",
    title: "Collapsible Task Details",
    bullets: [
      "Long task details now stay compact in the mobile task list.",
      "Tap Show details to expand the full context in place, then hide it again.",
      "Search highlights continue to work in both collapsed and expanded task details."
    ]
  },
  {
    id: "2026-05-18-priority-task-order",
    title: "Priority Task Ordering",
    bullets: [
      "Tasks due on the same day now sort High before Normal and Low.",
      "Open dated tasks still stay ahead of undated and completed work.",
      "Mobile task lists surface the most important next action sooner."
    ]
  },
  {
    id: "2026-05-18-note-color-filters",
    title: "Note Color Filters",
    bullets: [
      "Notes now have quick color filters for Sun, Mint, Sky, Rose, and Ink cards.",
      "Color counts update with the selected label so matching notes are easier to spot.",
      "Keeply remembers the chosen note color filter on this device."
    ]
  },
  {
    id: "2026-05-17-task-priority-filters",
    title: "Task Priority Filters",
    bullets: [
      "Tasks now have quick priority filters for High, Normal, and Low work.",
      "Priority counts update with the selected date window and label.",
      "Keeply remembers the chosen priority filter on this device."
    ]
  },
  {
    id: "2026-05-17-note-reading-metadata",
    title: "Note Reading Details",
    bullets: [
      "Note cards now show a compact word count and reading-time pill.",
      "Longer notes are easier to triage before expanding them.",
      "Empty image or title-only notes stay labeled as quick notes."
    ]
  },
  {
    id: "2026-05-17-task-due-badges",
    title: "Task Due Badges",
    bullets: [
      "Task cards now show color-coded due badges for faster mobile scanning.",
      "Overdue, Today, Tomorrow, and future dates are labeled at a glance.",
      "Completed and unscheduled tasks stay visually quiet so urgent work stands out."
    ]
  },
  {
    id: "2026-05-17-collapsible-note-previews",
    title: "Collapsible Note Previews",
    bullets: [
      "Long note cards now stay compact in the mobile feed.",
      "Tap Read more to expand the full note body in place.",
      "Search highlights keep working inside collapsed and expanded previews."
    ]
  },
  {
    id: "2026-05-17-task-swipe-triage",
    title: "Swipe Task Triage",
    bullets: [
      "Task cards now respond to mobile swipes for faster cleanup.",
      "Swipe right in Tasks to complete or reopen a task with Undo available.",
      "Swipe left in Tasks to archive, and swipe right from Archive or Trash to restore."
    ]
  },
  {
    id: "2026-05-17-bulk-task-paste",
    title: "Paste a Task List",
    bullets: [
      "Task mode now turns pasted multi-line lists into separate tasks.",
      "Common bullets, numbered lines, and checkbox prefixes are cleaned automatically.",
      "Label, priority, and due date choices apply to every created task."
    ]
  },
  {
    id: "2026-05-17-undo-note-pinning",
    title: "Undo Note Pinning",
    bullets: [
      "Pinning or unpinning a note now shows an Undo action in the toast.",
      "Undo works from both the pin button and the mobile swipe gesture.",
      "Accidental pin changes can be reversed without hunting for the moved note."
    ]
  },
  {
    id: "2026-05-17-undo-follow-up-tasks",
    title: "Undo Follow-Up Tasks",
    bullets: [
      "Creating a task from a note now shows an Undo action in the toast.",
      "Undo removes the fresh follow-up before it clutters your task list.",
      "If the task already synced, Keeply queues the cleanup for the next save."
    ]
  },
  {
    id: "2026-05-17-undo-duplicate-cards",
    title: "Undo Copied Cards",
    bullets: [
      "Copying a note or task now shows an Undo action in the toast.",
      "Undo removes the fresh copy before it clutters your active list.",
      "The cleanup also queues the copied card for sync removal when needed."
    ]
  },
  {
    id: "2026-05-17-edit-cards",
    title: "Edit Saved Cards",
    bullets: [
      "Saved notes and tasks now include an Edit action.",
      "Edit opens the card in the composer so title, details, label, color, priority, and due date can be revised.",
      "The composer switches into a clear save-or-cancel state for mobile updates."
    ]
  },
  {
    id: "2026-05-17-duplicate-cards",
    title: "Duplicate Cards",
    bullets: [
      "Note and task cards now include a Copy action for making a fresh duplicate.",
      "Copied notes reopen as active, unpinned cards with the same label, color, body, and image.",
      "Copied tasks reopen as active, unchecked tasks with the same label, priority, due date, and details."
    ]
  },
  {
    id: "2026-05-17-share-cards",
    title: "Share Notes and Tasks",
    bullets: [
      "Saved note and task cards now include a mobile-friendly Share action.",
      "Keeply uses the device share sheet when available and copies clean text otherwise.",
      "Shared tasks include status, label, priority, due date, and details."
    ]
  },
  {
    id: "2026-05-17-remember-workspace",
    title: "Remembered Workspace",
    bullets: [
      "Keeply now restores your last section, label, and task date filter after reload.",
      "Compact layout and evening paper choices stay on this device.",
      "Mobile triage can pick up where you left off without resetting the view."
    ]
  },
  {
    id: "2026-05-17-clear-active-filters",
    title: "Clear Active Filters",
    bullets: [
      "Keeply now shows a compact summary when labels, search, or task dates are filtering the view.",
      "One tap clears every active filter and resets task dates back to All.",
      "Empty lists are easier to recover from on mobile."
    ]
  },
  {
    id: "2026-05-17-task-label-shortcuts",
    title: "Quick Task Label Changes",
    bullets: [
      "Active task cards now show one-tap label shortcuts.",
      "The current label stays hidden so only useful moves appear.",
      "Mobile task triage is faster without reopening the composer."
    ]
  },
  {
    id: "2026-05-17-label-count-chips",
    title: "Label Counts",
    bullets: [
      "Label chips now show live counts for the current view.",
      "Task counts respect the selected date filter.",
      "Archive and Trash counts include both notes and tasks."
    ]
  },
  {
    id: "2026-05-17-note-color-shortcuts",
    title: "Quick Note Color Changes",
    bullets: [
      "Active note cards now show one-tap color swatches.",
      "The current note color stays hidden so only useful changes appear.",
      "Mobile notes are easier to organize without reopening the composer."
    ]
  },
  {
    id: "2026-05-17-composer-draft-recovery",
    title: "Composer Draft Recovery",
    bullets: [
      "Keeply now saves unfinished composer text locally while you type.",
      "Reloading the app restores the in-progress note or task draft.",
      "Attached and generated image drafts recover with the note composer."
    ]
  },
  {
    id: "2026-05-17-snooze-overdue-tasks",
    title: "Snooze Overdue Tasks",
    bullets: [
      "Tasks now show a one-tap action for moving overdue work to tomorrow.",
      "The overdue count updates live beside completed-task cleanup.",
      "The toast includes Undo so bulk snoozing is easy to reverse."
    ]
  },
  {
    id: "2026-05-17-undo-task-completion",
    title: "Undo Task Completion",
    bullets: [
      "Tapping a task checkbox now shows an Undo action in the toast.",
      "Undo restores the task to its previous open or completed state.",
      "The flow works for quick mobile checkoffs and accidental reopens."
    ]
  },
  {
    id: "2026-05-17-task-composer-presets",
    title: "Task Due Presets",
    bullets: [
      "The task composer now has one-tap due presets for Today, Tomorrow, and No date.",
      "Preset buttons stay in sync with the manual due-date field.",
      "The controls are sized for quick mobile task capture."
    ]
  },
  {
    id: "2026-05-17-archive-completed-tasks",
    title: "Archive Completed Tasks",
    bullets: [
      "Tasks now include a one-tap cleanup action for completed work.",
      "Archived completed tasks leave the active task list while staying recoverable.",
      "The cleanup toast includes Undo so accidental bulk cleanup is easy to reverse."
    ]
  },
  {
    id: "2026-05-17-undo-cleanup-actions",
    title: "Undo Cleanup Actions",
    bullets: [
      "Archive, trash, restore, and delete-forever actions now offer a quick Undo.",
      "Undo restores the note or task back into its previous spot when possible.",
      "The toast action is sized for mobile so cleanup mistakes are easier to catch."
    ]
  },
  {
    id: "2026-05-17-task-priority-shortcuts",
    title: "Quick Task Priority Changes",
    bullets: [
      "Active task cards now include quick priority buttons for High, Normal, and Low.",
      "The current priority stays hidden so each card only shows useful changes.",
      "Completed tasks remain visually quiet while open tasks stay easy to triage."
    ]
  },
  {
    id: "2026-05-17-note-follow-up-shortcuts",
    title: "Note Follow-Up Shortcuts",
    bullets: [
      "Active note cards now include quick buttons for creating a follow-up task.",
      "Follow-up tasks keep the note label and details so context carries over.",
      "Mobile cards offer Today and Tomorrow choices without opening the composer."
    ]
  },
  {
    id: "2026-05-17-task-due-shortcuts",
    title: "Quick Task Rescheduling",
    bullets: [
      "Task cards now include quick due-date chips for Today, Tomorrow, and No date.",
      "The current due state is hidden so only useful date changes are shown.",
      "Completed tasks stay quiet, keeping the mobile task list easier to scan."
    ]
  },
  {
    id: "2026-05-17-visual-note-fallbacks",
    title: "Visual Notes Keep Working",
    bullets: [
      "Image notes now get a local visual fallback when generation is unavailable.",
      "Fallback visuals save into notes like regular generated images.",
      "Image preview sizes now handle both generated files and lightweight local visuals."
    ]
  },
  {
    id: "2026-05-17-task-date-filters",
    title: "Task Date Filters",
    bullets: [
      "Tasks now get quick filters for all, overdue, today, upcoming, and no-date work.",
      "Each filter shows a live count so the busiest date group is easy to spot.",
      "The filter row is horizontally scrollable on mobile and stays out of Notes."
    ]
  },
  {
    id: "2026-05-17-durable-delete-sync",
    title: "Cleaner Cross-Device Deletes",
    bullets: [
      "Items deleted forever stay deleted after Keeply syncs with the cloud.",
      "Offline deletes are remembered locally until the next successful save.",
      "Sync keeps the newest edit when another device changes the same item."
    ]
  },
  {
    id: "2026-05-17-whats-new",
    title: "What's New in Keeply",
    bullets: [
      "Keeply now announces new user-facing updates on the next app load.",
      "Dismissed updates stay dismissed on this device.",
      "Release metadata is checked during the test run so update notes stay complete."
    ]
  }
];

export const latestUpdate = appUpdates[0];
