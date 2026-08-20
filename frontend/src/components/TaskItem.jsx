import { createElement, useEffect, useState } from 'react'
import { Calendar, CheckCircle2, Clock, MoreVertical } from 'lucide-react'
import { format, isToday } from 'date-fns'
import TaskModal from './AddTask'
import { getPriorityBadgeColor, getPriorityColor, MENU_OPTIONS, TI_CLASSES } from '../assets/constants'
import api from '../api/axios'
import { getTaskId, isTaskCompleted, toApiCompleted } from '../utils/task'
import { getToken } from '../utils/auth'

const TaskItem = ({ task, onRefresh, onLogout, showCompleteCheckbox = true, onDelete, onToggleComplete, onEdit, className = '', index = 0 }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isCompleted, setIsCompleted] = useState(isTaskCompleted(task))
  const [showEditModal, setShowEditModal] = useState(false)
  const [actionError, setActionError] = useState('')
  const [completionPulse, setCompletionPulse] = useState(false)
  const taskId = getTaskId(task)

  useEffect(() => {
    setIsCompleted(isTaskCompleted(task))
  }, [task])

  const getAuthConfig = () => {
    const token = getToken()
    if (!token) throw new Error('Your session has expired. Please sign in again.')
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  const handleComplete = async () => {
    const nextCompleted = !isCompleted
    setActionError('')
    try {
      if (onToggleComplete) {
        await onToggleComplete(nextCompleted)
      } else {
        await api.put(`/api/tasks/${taskId}/gp`, { completed: toApiCompleted(nextCompleted) }, getAuthConfig())
        await onRefresh?.()
      }
      setIsCompleted(nextCompleted)
      setCompletionPulse(true)
      window.setTimeout(() => setCompletionPulse(false), 420)
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Unable to update this task.')
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete “${task.title}”?`)) return
    setActionError('')
    try {
      if (onDelete) {
        await onDelete()
      } else {
        await api.delete(`/api/tasks/${taskId}/gp`, getAuthConfig())
        await onRefresh?.()
      }
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Unable to delete this task.')
      if (err.response?.status === 401) onLogout?.()
    }
  }

  const handleAction = (action) => {
    setShowMenu(false)
    if (action === 'edit') {
      if (onEdit) onEdit()
      else setShowEditModal(true)
    }
    if (action === 'delete') handleDelete()
  }

  return (
    <>
      <article className={`${TI_CLASSES.wrapper} stagger-in ${getPriorityColor(task.priority)} ${completionPulse ? 'completion-pop is-complete' : ''} ${className}`} style={{ '--stagger-delay': `${Math.min(index, 6) * 55}ms` }}>
        <div className={TI_CLASSES.leftContainer}>
          {showCompleteCheckbox && (
            <button type="button" onClick={handleComplete} className={`${TI_CLASSES.completeBtn} icon-button ${isCompleted ? 'text-brand-green' : ''}`}
 aria-label={isCompleted ? `Mark ${task.title} as in progress` : `Mark ${task.title} as complete`}>
              <CheckCircle2 className={`${TI_CLASSES.checkboxIconBase} ${isCompleted ? 'fill-green-100' : ''}`} aria-hidden="true" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className={`${TI_CLASSES.titleBase} ${isCompleted ? 'text-brand-muted line-through' : 'text-brand-text'}`}>{task.title}</h3>
              <span className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(task.priority)}`}>{task.priority || 'Low'}</span>
            </div>
            {task.description && <p className={TI_CLASSES.description}>{task.description}</p>}
            {actionError && <p className="mt-2 text-xs font-medium text-red-600" role="alert">{actionError}</p>}
          </div>
        </div>

        <div className={TI_CLASSES.rightContainer}>
          <div className="task-menu-anchor shrink-0">
            <button type="button" onClick={() => setShowMenu((open) => !open)} className={`${TI_CLASSES.menuButton} icon-button`}
 aria-expanded={showMenu} aria-haspopup="menu" aria-label={`Actions for ${task.title}`}>
              <MoreVertical className="h-5 w-5" aria-hidden="true" />
            </button>
            {showMenu && (
              <div className={TI_CLASSES.menuDropdown} role="menu">
                {MENU_OPTIONS.map(({ action, label, icon: Icon }) => (
                  <button key={action} type="button" role="menuitem" onClick={() => handleAction(action)} className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium transition hover:bg-gray-50 ${action === 'delete' ? 'text-red-600' : 'text-brand-text'}`}>
                    {createElement(Icon, { className: 'h-4 w-4', 'aria-hidden': true })}{label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="md:text-right">
            <div className={`${TI_CLASSES.dateRow} ${task.dueDate && isToday(new Date(task.dueDate)) ? 'text-brand-green' : ''}`}>
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {task.dueDate ? (isToday(new Date(task.dueDate)) ? 'Today' : format(new Date(task.dueDate), 'MMM dd')) : 'No due date'}
            </div>
            <div className={TI_CLASSES.createdRow}><Clock className="h-3 w-3" aria-hidden="true" />{task.createdAt ? `Created ${format(new Date(task.createdAt), 'MMM dd')}` : 'Recently added'}</div>
          </div>
        </div>
      </article>
      {!onEdit && <TaskModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} taskToEdit={task} onSave={onRefresh} onLogout={onLogout} />}
    </>
  )
}

export default TaskItem
