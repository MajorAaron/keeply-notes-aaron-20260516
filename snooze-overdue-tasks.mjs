export function snoozeOverdueTasks(tasks, options = {}) {
  const now = options.now || new Date();
  const today = toDateInput(now);
  const tomorrow = options.tomorrow || toDateInput(new Date(new Date(today).getTime() + 86400000));
  const updatedAt = options.updatedAt || (now instanceof Date ? now.toISOString() : new Date(now).toISOString());
  const snoozed = [];

  const nextTasks = tasks.map((task) => {
    if (task.status !== "active" || task.completed || !task.dueAt || task.dueAt >= today) return task;
    const updated = { ...task, dueAt: tomorrow, updatedAt };
    snoozed.push(updated);
    return updated;
  });

  return { tasks: nextTasks, snoozed, tomorrow };
}

function toDateInput(value) {
  return new Date(value).toISOString().slice(0, 10);
}
