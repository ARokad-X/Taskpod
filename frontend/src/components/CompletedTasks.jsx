import { createElement, useMemo, useState } from 'react'
import { CheckCircle2, Filter } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import TaskItem from './TaskItem'
import { CT_CLASSES, SORT_OPTIONS } from '../assets/constants'
import { isTaskCompleted } from '../utils/task'

const CompletedTasks = () => {
  const { tasks = [], refreshTasks } = useOutletContext()
  const [sortBy, setSortBy] = useState('newest')

  const sortedCompletedTasks = useMemo(() => [...tasks.filter(isTaskCompleted)].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    const order = { high: 3, medium: 2, low: 1 }
    return (order[b.priority?.toLowerCase()] || 0) - (order[a.priority?.toLowerCase()] || 0)
  }), [tasks, sortBy])

  return (
    <div className={CT_CLASSES.page}>
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}><CheckCircle2 className="h-6 w-6 shrink-0 text-brand-green" aria-hidden="true" /><span>Completed tasks</span></h1>
          <p className={CT_CLASSES.subtitle}>{sortedCompletedTasks.length} task{sortedCompletedTasks.length !== 1 ? 's' : ''} marked as complete</p>
        </div>
        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}><Filter className="h-4 w-4 text-brand-green" aria-hidden="true" /><span>Sort by</span></div>
            <label className="sr-only" htmlFor="completed-sort">Sort completed tasks</label>
            <select id="completed-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={CT_CLASSES.select}>{SORT_OPTIONS.map(({ id, label }) => <option key={id} value={id}>{label}{id === 'newest' ? ' first' : ''}</option>)}</select>
            <div className={CT_CLASSES.btnGroup} role="group" aria-label="Sort completed tasks">{SORT_OPTIONS.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => setSortBy(id)} aria-pressed={sortBy === id} className={`${CT_CLASSES.btnBase} ${sortBy === id ? CT_CLASSES.btnActive : CT_CLASSES.btnInactive}`}>{createElement(Icon, { className: 'h-3.5 w-3.5', 'aria-hidden': true })}{label}</button>)}</div>
          </div>
        </div>
      </div>

      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={CT_CLASSES.emptyState}><div className={CT_CLASSES.emptyIconWrapper}><CheckCircle2 className="h-7 w-7" aria-hidden="true" /></div><h2 className={CT_CLASSES.emptyTitle}>No completed tasks yet</h2><p className={CT_CLASSES.emptyText}>Complete a task and it will appear here.</p></div>
        ) : sortedCompletedTasks.map((task, index) => <TaskItem key={task.id || task._id} task={task} index={index} onRefresh={refreshTasks} showCompleteCheckbox />)}
      </div>
    </div>
  )
}

export default CompletedTasks
