export const getTaskId = (task) => task?.id || task?._id || null

export const isTaskCompleted = (task) => [true, 1, 'yes'].includes(
  typeof task?.completed === 'string' ? task.completed.toLowerCase() : task?.completed,
)

export const toApiCompleted = (value) => (value ? 'Yes' : 'No')

export const normalizeTask = (task) => ({
  ...task,
  id: getTaskId(task),
  completed: isTaskCompleted(task) ? 'Yes' : 'No',
})
