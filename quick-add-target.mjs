export function getQuickAddTarget(view) {
  const currentView = typeof view === "string" ? view : "active";
  const isTaskView = currentView === "tasks";
  const mode = isTaskView ? "task" : "note";
  const label = isTaskView ? "task" : "note";

  return {
    mode,
    ariaLabel: `Quick add ${label}`,
    title: `Quick add ${label}`,
    toast: isTaskView ? "Task composer ready" : "Note composer ready"
  };
}
