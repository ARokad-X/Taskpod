import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CheckCircle, Clock, Circle, ListTodo, TrendingUp, Zap } from 'lucide-react'
import TopNav from './TopNav'
import api from '../api/axios'
import { clearAuth, getToken } from '../utils/auth'

const isCompleted = (task) => [true, 1, 'yes'].includes(
  typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed,
)

const StatCard = ({ title, value, icon, gradient = false }) => (
  <div className="stat-card group">
    <div className="stat-icon">{icon}</div>
    <div className="min-w-0">
      <p className={`text-2xl font-bold ${gradient ? 'text-gradient' : 'text-brand-text'}`}>{value}</p>
      <p className="mt-1 truncate text-sm font-medium text-brand-muted">{title}</p>
    </div>
  </div>
)

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setError(null)
    try {
      const token = getToken()
      if (!token) throw new Error('Your session has expired. Please sign in again.')
      const { data } = await api.get('/api/tasks/gp', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const nextTasks = Array.isArray(data?.tasks) ? data.tasks : Array.isArray(data) ? data : []
      setTasks(nextTasks)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not load your tasks.')
      if (err.response?.status === 401 || !getToken()) {
        clearAuth()
        onLogout()
      }
    } finally {
      setInitialLoading(false)
    }
  }, [onLogout])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(isCompleted).length
    const totalCount = tasks.length
    return {
      totalCount,
      completedTasks,
      pendingCount: totalCount - completedTasks,
      completionPercentage: totalCount ? Math.round((completedTasks / totalCount) * 100) : 0,
    }
  }, [tasks])

  if (initialLoading) {
    return (
      <div className="app-state" role="status" aria-live="polite">
        <div className="loading-skeleton" aria-hidden="true">
          <div className="skeleton-line" style={{ width: '42%' }} />
          <div className="skeleton-line skeleton-line-short" />
          <div className="skeleton-line" style={{ width: '100%', height: '9rem', borderRadius: '1rem', marginTop: '1.5rem' }} />
          <div className="skeleton-line" style={{ width: '88%', marginTop: '.9rem' }} />
          <div className="skeleton-line" style={{ width: '66%' }} />
        </div>
        <p className="text-sm font-semibold">Loading your workspace…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-state px-6">
        <div className="state-card max-w-md">
          <div className="state-icon state-icon-error" aria-hidden="true">!</div>
          <h1 className="text-xl font-bold text-brand-text">We couldn’t load your tasks</h1>
          <p className="mt-2 text-center text-sm text-brand-muted">{error}</p>
          <button type="button" onClick={fetchTasks} className="primary-button mt-6">Try again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <TopNav user={user} onLogout={onLogout} />
      <main className="app-main page-enter">
        <div className="content-grid">
          <section className="min-w-0">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </section>
          <aside className="space-y-5" aria-label="Workspace summary">
            <div className="panel-card">
              <div className="panel-heading">
                <span className="panel-heading-icon"><TrendingUp className="h-4 w-4" /></span>
                <h2>Task overview</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatCard title="Total tasks" value={stats.totalCount} icon={<ListTodo className="h-5 w-5" />} gradient />
                <StatCard title="Completed" value={stats.completedTasks} icon={<CheckCircle className="h-5 w-5" />} />
                <StatCard title="Pending" value={stats.pendingCount} icon={<Clock className="h-5 w-5" />} />
                <StatCard title="Completion" value={`${stats.completionPercentage}%`} icon={<Zap className="h-5 w-5" />} />
              </div>
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-brand-muted">
                    <Circle className="h-3 w-3 fill-brand-green text-brand-green" /> Overall progress
                  </span>
                  <span className="rounded-full bg-brand-green/10 px-2.5 py-1 text-xs font-bold text-brand-green">
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100" aria-label={`${stats.completionPercentage}% complete`} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={stats.completionPercentage}>
                  <div className="h-full rounded-full bg-brand-green transition-all duration-700" style={{ width: `${stats.completionPercentage}%` }} />
                </div>
              </div>
            </div>

            <div className="panel-card">
              <div className="panel-heading">
                <span className="panel-heading-icon"><Clock className="h-4 w-4" /></span>
                <h2>Recent activity</h2>
              </div>
              <div className="space-y-2">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task.id || task._id} className="activity-row">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-text">{task.title}</p>
                      <p className="mt-1 text-xs text-brand-muted">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Recently added'}</p>
                    </div>
                    <span className={`status-pill ${isCompleted(task) ? 'status-pill-success' : 'status-pill-muted'}`}>
                      {isCompleted(task) ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
                {!tasks.length && (
                  <div className="empty-activity">
                    <Clock className="h-6 w-6 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Layout
