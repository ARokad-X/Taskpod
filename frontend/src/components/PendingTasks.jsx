import { createElement, useCallback, useMemo, useState } from 'react'
import { Award, Clock, Filter, ListChecks, Plus, SortAsc, SortDesc } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import TaskItem from './TaskItem'
import TaskModal from './AddTask'
import api from '../api/axios'
import { layoutClasses } from '../assets/constants'
import { getTaskId, isTaskCompleted, toApiCompleted } from '../utils/task'
import { getToken } from '../utils/auth'

const sortOptions = [
  { id: 'newest', label: 'Newest', icon: SortDesc },
  { id: 'oldest', label: 'Oldest', icon: SortAsc },
  { id: 'priority', label: 'Priority', icon: Award },
]

const PendingTasks = () => {
  const { tasks = [], refreshTasks } = useOutletContext()
  const [sortBy, setSortBy] = useState('newest')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const authConfig = () => {
    const token = getToken()
    if (!token) throw new Error('Your session has expired. Please sign in again.')
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  const handleDelete = useCallback(async (id) => {
    await api.delete(`/api/tasks/${id}/gp`, authConfig())
    await refreshTasks()
  }, [refreshTasks])

  const handleToggleComplete = useCallback(async (id, completed) => {
    await api.put(`/api/tasks/${id}/gp`, { completed: toApiCompleted(completed) }, authConfig())
    await refreshTasks()
  }, [refreshTasks])

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter((task) => !isTaskCompleted(task))
    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      const order = { high: 3, medium: 2, low: 1 }
      return (order[b.priority?.toLowerCase()] || 0) - (order[a.priority?.toLowerCase()] || 0)
    })
  }, [tasks, sortBy])

  const closeModal = () => {
    setShowModal(false)
    setSelectedTask(null)
  }

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div className="min-w-0">
          <h1 className="page-title"><ListChecks className="h-6 w-6 shrink-0 text-brand-green" aria-hidden="true" /> <span>Pending tasks</span></h1>
          <p className="page-subtitle">{sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 ? 's' : ''} needing your attention</p>
        </div>
        <div className={layoutClasses.sortBox}>
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-text"><Filter className="h-4 w-4 text-brand-green" aria-hidden="true" /><span>Sort by</span></div>
          <select aria-label="Sort pending tasks" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={layoutClasses.select}>
            {sortOptions.map((option) => <option key={option.id} value={option.id}>{option.label}{option.id === 'newest' ? ' first' : ''}</option>)}
          </select>
          <div className={layoutClasses.tabWrapper} role="group" aria-label="Sort pending tasks">
            {sortOptions.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => setSortBy(id)} className={layoutClasses.tabButton(sortBy === id)} aria-pressed={sortBy === id}>{createElement(Icon, { className: 'h-3.5 w-3.5', 'aria-hidden': true })}{label}</button>)}
          </div>
        </div>
      </div>

      <button type="button" className={layoutClasses.addBox} onClick={() => setShowModal(true)}><span className="flex items-center justify-center gap-3 font-semibold"><span className="grid h-8 w-8 place-items-center rounded-full bg-green-50"><Plus className="h-4 w-4 text-brand-green" /></span>Add new task</span></button>

      <div className="space-y-3">
        {sortedPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyState}>
            <div className={layoutClasses.emptyIconBg}><Clock className="h-7 w-7" aria-hidden="true" /></div>
            <h2 className="text-lg font-bold text-brand-text">All caught up</h2>
            <p className="mt-1 text-sm text-brand-muted">No pending tasks right now.</p>
            <button type="button" onClick={() => setShowModal(true)} className={layoutClasses.emptyBtn}>Create new task</button>
          </div>
        ) : sortedPendingTasks.map((task, index) => {
          const id = getTaskId(task)
          return <TaskItem key={id} task={task} index={index} showCompleteCheckbox onDelete={() => handleDelete(id)} onToggleComplete={(completed) => handleToggleComplete(id, completed)} onEdit={() => { setSelectedTask(task); setShowModal(true) }} onRefresh={refreshTasks} />
        })}
      </div>

      <TaskModal isOpen={Boolean(selectedTask) || showModal} onClose={closeModal} taskToEdit={selectedTask} onSave={refreshTasks} />
    </div>
  )
}

export default PendingTasks
