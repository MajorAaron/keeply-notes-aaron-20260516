export function toggleTaskCompletion(tasks, id, options = {}) {
  const now = options.now || new Date().toISOString();
  let changedTask = null;

  const nextTasks = tasks.map((task) => {
    if (task.id !== id) return task;
    changedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: now
    };
    return changedTask;
  });

  return {
    tasks: nextTasks,
    task: changedTask,
    completed: Boolean(changedTask?.completed)
  };
}
