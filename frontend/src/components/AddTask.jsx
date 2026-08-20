import { useCallback, useEffect, useState } from 'react'
import { AlignLeft, Calendar, CheckCircle, Flag, PlusCircle, Save, X } from 'lucide-react'
import api from '../api/axios'
import { baseControlClasses, DEFAULT_TASK } from '../assets/constants'
import { getTaskId, isTaskCompleted } from '../utils/task'
import { getToken } from '../utils/auth'

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const today = new Date().toISOString().split('T')[0]
  const isEdit = Boolean(taskData.id)

  useEffect(() => {
    if (!isOpen) return
    if (taskToEdit) {
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'Low',
        dueDate: taskToEdit.dueDate ? String(taskToEdit.dueDate).split('T')[0] : '',
        completed: isTaskCompleted(taskToEdit) ? 'Yes' : 'No',
        id: getTaskId(taskToEdit),
      })
    } else {
      setTaskData(DEFAULT_TASK)
    }
    setError('')
  }, [isOpen, taskToEdit])

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loading) onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, loading, onClose])

  const handleChange = useCallback((event) => {
    const { name, value } = event.target
    setTaskData((previous) => ({ ...previous, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    if (!taskData.title.trim()) {
      setError('Please add a title for this task.')
      return
    }
    if (!taskData.dueDate) {
      setError('Please choose a due date.')
      return
    }
    if (!isEdit && taskData.dueDate < today) {
      setError('Due date cannot be in the past.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const token = getToken()
      if (!token) throw new Error('Your session has expired. Please sign in again.')
      const payload = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        completed: taskData.completed,
      }
      const response = await api.request({
        url: isEdit ? `/api/tasks/${taskData.id}/gp` : '/api/tasks/gp',
        method: isEdit ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
      })
      onSave?.(response.data?.task || response.data)
      onClose()
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout?.()
        return
      }
      setError(err.response?.data?.message || err.message || 'Unable to save this task.')
    } finally {
      setLoading(false)
    }
  }, [isEdit, onClose, onLogout, onSave, taskData, today])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-slate-900/35 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose() }}>
      <section className="modal-panel max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-white/80 bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[.14em] text-brand-green">Workspace task</p>
            <h2 id="task-modal-title" className="flex items-center gap-2 text-xl font-extrabold text-brand-text sm:text-2xl">
              {isEdit ? <Save className="h-5 w-5 text-brand-green" aria-hidden="true" /> : <PlusCircle className="h-5 w-5 text-brand-green" aria-hidden="true" />}
              {isEdit ? 'Edit task' : 'Create new task'}
            </h2>
          </div>
          <button type="button" onClick={onClose} disabled={loading} className="rounded-lg p-2 text-brand-muted transition hover:bg-gray-100 hover:text-brand-text" aria-label="Close task dialog"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
          <div>
            <label className="form-label" htmlFor="task-title">Task title</label>
            <input id="task-title" name="title" type="text" required maxLength={120} autoFocus value={taskData.title} onChange={handleChange} className={baseControlClasses} placeholder="What needs to be done?" />
          </div>
          <div>
            <label className="form-label" htmlFor="task-description"><span className="inline-flex items-center gap-1"><AlignLeft className="h-4 w-4 text-brand-green" aria-hidden="true" /> Description</span></label>
            <textarea id="task-description" name="description" rows="3" maxLength={500} value={taskData.description} onChange={handleChange} className={`${baseControlClasses} resize-y`} placeholder="Add helpful context (optional)" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="task-priority"><span className="inline-flex items-center gap-1"><Flag className="h-4 w-4 text-brand-green" aria-hidden="true" /> Priority</span></label>
              <select id="task-priority" name="priority" value={taskData.priority} onChange={handleChange} className={baseControlClasses}><option>Low</option><option>Medium</option><option>High</option></select>
            </div>
            <div>
              <label className="form-label" htmlFor="task-due-date"><span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4 text-brand-green" aria-hidden="true" /> Due date</span></label>
              <input id="task-due-date" type="date" name="dueDate" required min={isEdit ? undefined : today} value={taskData.dueDate} onChange={handleChange} className={baseControlClasses} />
            </div>
          </div>
          <fieldset>
            <legend className="form-label"><span className="inline-flex items-center gap-1"><CheckCircle className="h-4 w-4 text-brand-green" aria-hidden="true" /> Status</span></legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[{ value: 'No', label: 'In progress' }, { value: 'Yes', label: 'Completed' }].map(({ value, label }) => (
                <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${taskData.completed === value ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-brand-muted hover:border-gray-300'}`}>
                  <input type="radio" name="completed" value={value} checked={taskData.completed === value} onChange={handleChange} className="h-4 w-4 accent-brand-green" />{label}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" disabled={loading} className="primary-button w-full">{loading ? 'Saving…' : isEdit ? <><Save className="h-4 w-4" /> Update task</> : <><PlusCircle className="h-4 w-4" /> Create task</>}</button>
        </form>
      </section>
    </div>
  )
}

export default TaskModal
