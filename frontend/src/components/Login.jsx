import { useEffect, useState } from 'react'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import api from '../api/axios'
import { INPUTWRAPPER, BUTTON_CLASSES } from '../assets/constants'
import { clearAuth, getToken } from '../utils/auth'
import 'react-toastify/dist/ReactToastify.css'

const INITIAL_FORM = { email: '', password: '' }

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    let active = true
    api.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (active && data.success) onSubmit?.({ token, userId: localStorage.getItem('userId'), ...data.user })
      })
      .catch(() => {
        clearAuth()
      })
    return () => { active = false }
  }, [onSubmit])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/api/user/login', formData)
      if (!data.token || !data.user) throw new Error(data.message || 'Login failed.')
      if (rememberMe) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user.id)
      } else {
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('userId', data.user.id)
      }
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user })
      toast.success('Login successful.')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Unable to log in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <ToastContainer position="top-center" autoClose={2800} hideProgressBar newestOnTop />
      <div className="mb-7 text-center">
        <div className="auth-icon"><LogIn className="h-7 w-7" aria-hidden="true" /></div>
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-text">Welcome back</h1>
        <p className="mt-1 text-sm text-brand-muted">Sign in to continue to Taskpods</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="form-label">Email address</label>
          <div className={INPUTWRAPPER}><Mail className="h-5 w-5 shrink-0 text-brand-green" aria-hidden="true" /><input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))} className="w-full bg-transparent text-sm text-brand-text outline-none" required /></div>
        </div>
        <div>
          <label htmlFor="login-password" className="form-label">Password</label>
          <div className={INPUTWRAPPER}><Lock className="h-5 w-5 shrink-0 text-brand-green" aria-hidden="true" /><input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={formData.password} onChange={(event) => setFormData((previous) => ({ ...previous, password: event.target.value }))} className="w-full bg-transparent text-sm text-brand-text outline-none" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="rounded-md p-1 text-brand-muted transition hover:text-brand-green" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-muted"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 accent-brand-green" /> Remember me</label>
        <button type="submit" className={BUTTON_CLASSES} disabled={loading}>{loading ? 'Signing in…' : <><LogIn className="h-4 w-4" aria-hidden="true" /> Sign in</>}</button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-muted">Don’t have an account? <button type="button" onClick={onSwitchMode} className="font-bold text-brand-green underline-offset-4 hover:underline">Create one</button></p>
    </div>
  )
}

export default Login
