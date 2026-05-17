export const appUpdates = [
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
