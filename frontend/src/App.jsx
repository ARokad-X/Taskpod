import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pending from './pages/Pending'
import Complete from './pages/Complete'
import Profile from './components/Profile'
import Login from './components/Login'
import SignUp from './components/SignUp'
import './index.css'
import { clearAuth } from './utils/auth'

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  } catch {
    localStorage.removeItem('currentUser')
    return null
  }
}

const App = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getStoredUser)

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  const handleAuthSubmit = (data) => {
    const user = {
      id: data.id || data.userId,
      email: data.email,
      name: data.name || 'User',
      avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=4CBB17&color=fff`,
    }
    setCurrentUser(user)
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    clearAuth()
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  const ProtectedLayout = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  )

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="auth-page">
            <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div className="auth-page">
            <SignUp onSwitchMode={() => navigate('/login')} />
          </div>
        }
      />
      <Route element={currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="pending" element={<Pending />} />
        <Route path="complete" element={<Complete />} />
        <Route path="profile" element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
      </Route>
      <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
