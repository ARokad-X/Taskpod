import { useState, useEffect, useCallback, useMemo } from "react"
import { Outlet } from "react-router-dom"
import { Circle, TrendingUp, Zap, Clock, ListTodo, CheckCircle, ListChecks } from "lucide-react"
import TopNav from "./TopNav"
import axios from "axios"

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No auth token found")

      const API_URL = (import.meta.env.VITE_API_URL || "https://taskpod-teal.vercel.app").replace(/\/+$/, '');
      const { data } = await axios.get(`${API_URL}/api/tasks/gp`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const arr = Array.isArray(data) ? data : 
        Array.isArray(data?.tasks) ? data.tasks :
        Array.isArray(data?.data) ? data.data : []

      setTasks(arr)
    } catch (err) {
      console.error(err)
      setError(err.message || "Could not load tasks.")
      if (err.response?.status === 401) onLogout()
    } finally {
      setInitialLoading(false)
    }
  }, [onLogout])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => 
      t.completed === true ||
      t.completed === 1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length

    const totalCount = tasks.length
    const pendingCount = totalCount - completedTasks
    const completionPercentage = totalCount ? 
      Math.round((completedTasks / totalCount) * 100) : 0

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage
    }
  }, [tasks])

  const StatCard = ({ title, value, icon, gradient }) => (
    <div className="p-4 rounded-2xl bg-brand-surface shadow-lg border border-white/5 hover:border-brand-coral/30 transition-all duration-300 group">
      <div className="flex flex-col gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className={`text-2xl font-bold ${gradient ? 'bg-gradient-to-r from-brand-coral to-brand-purple bg-clip-text text-transparent' : 'text-brand-text'}`}>
            {value}
          </p>
          <p className="text-sm text-brand-muted font-medium mt-1">{title}</p>
        </div>
      </div>
    </div>
  )

  if (initialLoading) return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-brand-green animate-pulse drop-shadow-lg">
          <path fill="currentColor" d="M50 85 C 20 60, 10 40, 15 25 C 20 10, 40 10, 50 25 C 60 10, 80 10, 85 25 C 90 40, 80 60, 50 85 Z" />
          <circle cx="50" cy="35" r="15" fill="white" />
        </svg>
        <div className="absolute inset-0 border-4 border-brand-green/20 rounded-full animate-[spin_3s_linear_infinite]" style={{ margin: '-8px' }}></div>
      </div>
      <p className="text-brand-muted text-sm font-medium animate-pulse tracking-wide uppercase mt-4">Loading Workspace...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-brand-bg p-6 flex items-center justify-center">
      <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl border border-red-500/20 max-w-md">
        <p className="font-bold mb-2">Error loading tasks</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchTasks}
          className="mt-4 px-5 py-2 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text relative overflow-x-hidden">
      <TopNav />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 pt-4 md:pt-6 transition-all duration-300 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          <div className="xl:col-span-2 space-y-6">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className="xl:col-span-1 space-y-6">
            {/* Stats Panel */}
            <div className="bg-brand-surface rounded-3xl p-6 shadow-xl border border-white/5">
              <h3 className="text-lg font-bold mb-6 text-brand-green flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-green" />
                Task Overview
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard 
                  title="Total Tasks" 
                  value={stats.totalCount} 
                  icon={<ListTodo className="w-5 h-5 text-brand-green" />} 
                  gradient
                />
                <StatCard 
                  title="Completed" 
                  value={stats.completedTasks} 
                  icon={<CheckCircle className="w-5 h-5 text-brand-green" />} 
                />
                <StatCard 
                  title="Pending" 
                  value={stats.pendingCount} 
                  icon={<Clock className="w-5 h-5 text-brand-green" />} 
                />
                <StatCard
                  title="Completion"
                  value={`${stats.completionPercentage}%`}
                  icon={<Zap className="w-5 h-5 text-yellow-400" />}
                />
              </div>

              <hr className="my-6 border-white/5" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-brand-muted flex items-center gap-2">
                    <Circle className="w-3 h-3 text-brand-green fill-brand-coral" />
                    Overall Progress
                  </span>
                  <span className="text-xs bg-brand-coral/20 text-brand-green font-bold px-2 py-1 rounded-full">
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className="h-2 bg-brand-surface-light rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-brand-coral to-brand-purple transition-all duration-1000 ease-out"
                    style={{ width: `${stats.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity Panel */}
            <div className="bg-brand-surface rounded-3xl p-6 shadow-xl border border-white/5">
              <h3 className="text-lg font-bold mb-4 text-brand-green flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-green" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {tasks.slice(0, 4).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors duration-200 border border-transparent hover:border-white/10 group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-brand-text truncate group-hover:text-brand-green transition-colors">
                        {task.title}
                      </p>
                      <p className="text-xs text-brand-muted mt-1">
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Recently added"}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0 ${
                      task.completed ? 'bg-green-500/20 text-brand-green' : 'bg-brand-purple/20 text-brand-green'
                    }`}>
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-surface-light flex items-center justify-center">
                      <Clock className="w-8 h-8 text-brand-muted" />
                    </div>
                    <p className="text-sm font-medium text-brand-muted">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
