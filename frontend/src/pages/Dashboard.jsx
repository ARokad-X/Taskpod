import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Calendar, Flame, Home as HomeIcon, Plus } from 'lucide-react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import TaskModal from '../components/AddTask'
import TaskItem from '../components/TaskItem'
import { ADD_BUTTON, EMPTY_STATE, FILTER_LABELS, FILTER_OPTIONS, FILTER_WRAPPER, HEADER, ICON_WRAPPER, LABEL_CLASS, STAT_CARD, STATS, STATS_GRID, TAB_ACTIVE, TAB_BASE, TAB_INACTIVE, TABS_WRAPPER, VALUE_CLASS, WRAPPER, SELECT_CLASSES } from '../assets/constants'
import { isTaskCompleted } from '../utils/task'

const toDateKey = (date) => {
  if (!date) return ''
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toDateString()
}

const Dashboard = () => {
  const { tasks = [], refreshTasks } = useOutletContext()
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openNewTask) {
      setShowModal(true)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const stats = useMemo(() => {
    const completed = tasks.filter(isTaskCompleted).length
    return {
      total: tasks.length,
      lowPriority: tasks.filter((task) => task.priority?.toLowerCase() === 'low').length,
      mediumPriority: tasks.filter((task) => task.priority?.toLowerCase() === 'medium').length,
      highPriority: tasks.filter((task) => task.priority?.toLowerCase() === 'high').length,
      completed,
    }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate)
      switch (filter) {
        case 'today': return toDateKey(task.dueDate) === today.toDateString()
        case 'week': return !Number.isNaN(dueDate.getTime()) && dueDate >= today && dueDate <= nextWeek
        case 'high':
        case 'medium':
        case 'low': return task.priority?.toLowerCase() === filter
        default: return true
      }
    })
  }, [tasks, filter])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setSelectedTask(null)
  }, [])

  const handleTaskSave = useCallback(async () => {
    await refreshTasks()
    closeModal()
  }, [closeModal, refreshTasks])

  return (
    <div className={WRAPPER}>
      <div className={HEADER}>
        <div className="min-w-0">
          <h1 className="page-title"><HomeIcon className="h-6 w-6 shrink-0 text-brand-green" aria-hidden="true" /><span>Task overview</span></h1>
          <p className="page-subtitle">A clear view of everything on your plate.</p>
        </div>
        <button type="button" onClick={() => setShowModal(true)} className={`${ADD_BUTTON} w-full sm:w-auto`}><Plus className="h-4 w-4" aria-hidden="true" /> Add new task</button>
      </div>

      <div className={STATS_GRID}>
        {STATS.map(({ key, label, icon: Icon, iconColor, valueKey, textColor }) => (
          <div key={key} className={`${STAT_CARD} ${textColor || ''}`}>
            <div className={`${ICON_WRAPPER} ${iconColor}`}>{createElement(Icon, { className: 'h-4 w-4 sm:h-5 sm:w-5', 'aria-hidden': true })}</div>
            <div className="min-w-0"><p className={VALUE_CLASS}>{stats[valueKey]}</p><p className={LABEL_CLASS}>{label}</p></div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 px-2 text-sm font-semibold text-brand-text"><Flame className="h-4 w-4 text-brand-green" aria-hidden="true" /> Filter tasks</div>
          <label className="sr-only" htmlFor="dashboard-filter">Filter tasks</label>
          <select id="dashboard-filter" value={filter} onChange={(event) => setFilter(event.target.value)} className={SELECT_CLASSES}>{FILTER_OPTIONS.map((option) => <option key={option} value={option}>{FILTER_LABELS[option]}</option>)}</select>
          <div className={TABS_WRAPPER} role="group" aria-label="Filter tasks">{FILTER_OPTIONS.map((option) => <button type="button" key={option} onClick={() => setFilter(option)} aria-pressed={filter === option} className={`${TAB_BASE} ${filter === option ? TAB_ACTIVE : TAB_INACTIVE}`}>{FILTER_LABELS[option]}</button>)}</div>
        </div>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}><Calendar className="h-7 w-7" aria-hidden="true" /></div>
              <h2 className="text-lg font-bold text-brand-text">No tasks found</h2>
              <p className="mt-1 text-center text-sm text-brand-muted">{filter === 'all' ? 'Create your first task to get started.' : `There are no tasks in ${FILTER_LABELS[filter].toLowerCase()}.`}</p>
              <button type="button" onClick={() => setShowModal(true)} className={EMPTY_STATE.btn}>Add new task</button>
            </div>
          ) : filteredTasks.map((task) => <TaskItem key={task.id || task._id} task={task} onRefresh={refreshTasks} showCompleteCheckbox onEdit={() => { setSelectedTask(task); setShowModal(true) }} />)}
        </div>

        <button type="button" onClick={() => setShowModal(true)} className="hidden w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm font-semibold text-brand-muted transition hover:border-brand-green hover:text-brand-green sm:flex"><Plus className="h-5 w-5" aria-hidden="true" /> Add another task</button>
      </div>

      <TaskModal isOpen={showModal || Boolean(selectedTask)} onClose={closeModal} taskToEdit={selectedTask} onSave={handleTaskSave} />
    </div>
  )
}

export default Dashboard
