export function archiveCompletedTasks(tasks, options = {}) {
  const now = options.now || new Date().toISOString();
  const archived = [];

  const nextTasks = tasks.map((task) => {
    if (task.status !== "active" || !task.completed) return task;
    const updated = { ...task, status: "archive", updatedAt: now };
    archived.push(updated);
    return updated;
  });

  return { tasks: nextTasks, archived };
}
