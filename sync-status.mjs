const SYNC_STATUS_VIEWS = {
  syncing: {
    label: "Syncing",
    title: "Keeply is syncing your latest changes.",
    tone: "syncing"
  },
  synced: {
    label: "Synced",
    title: "Your Keeply data is synced.",
    tone: "synced"
  },
  offline: {
    label: "Offline",
    title: "Cloud sync is unavailable. Keeply is still saving on this device.",
    tone: "offline"
  },
  local: {
    label: "Saved locally",
    title: "Your changes are saved on this device and will sync when cloud save works again.",
    tone: "local"
  },
  pending: {
    label: "Local changes",
    title: "Keeply has local changes waiting for the first cloud sync.",
    tone: "local"
  }
};

export function getSyncStatusView(status, options = {}) {
  const normalizedStatus = typeof status === "string" ? status.toLowerCase() : "";
  const view = SYNC_STATUS_VIEWS[normalizedStatus] || SYNC_STATUS_VIEWS.syncing;
  const pendingCount = Number.isFinite(options.pendingDeletes) ? Math.max(0, Math.floor(options.pendingDeletes)) : 0;
  const title = pendingCount > 0 ? `${view.title} ${pendingCount} delete${pendingCount === 1 ? "" : "s"} pending.` : view.title;

  return {
    ...view,
    title,
    ariaLabel: `${view.label}: ${title}`
  };
}
