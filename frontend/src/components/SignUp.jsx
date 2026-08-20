import { createElement, useState } from 'react'
import { UserPlus } from 'lucide-react'
import api from '../api/axios'
import { BUTTONCLASSES, FIELDS, Inputwrapper, MESSAGE_ERROR, MESSAGE_SUCCESS } from '../assets/constants'

const INITIAL_FORM = { name: '', email: '', password: '' }

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (formData.password.length < 8) {
      setMessage({ text: 'Use a password with at least 8 characters.', type: 'error' })
      return
    }
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      await api.post('/api/user/register', formData)
      setMessage({ text: 'Registration successful. You can now sign in.', type: 'success' })
      setFormData(INITIAL_FORM)
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Unable to create your account. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="mb-7 text-center"><div className="auth-icon"><UserPlus className="h-7 w-7" aria-hidden="true" /></div><h1 className="text-2xl font-extrabold tracking-tight text-brand-text">Create your account</h1><p className="mt-1 text-sm text-brand-muted">Start organizing your work with Taskpods</p></div>
      {message.text && <div className={message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR} role="status">{message.text}</div>}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name}><label htmlFor={`signup-${name}`} className="form-label">{placeholder}</label><div className={Inputwrapper}>{createElement(Icon, { className: 'h-5 w-5 shrink-0 text-brand-green', 'aria-hidden': true })}<input id={`signup-${name}`} name={name} type={type} autoComplete={name === 'password' ? 'new-password' : name} placeholder={placeholder} value={formData[name]} onChange={(event) => setFormData((previous) => ({ ...previous, [name]: event.target.value }))} className="w-full bg-transparent text-sm text-brand-text outline-none" required /></div></div>
        ))}
        <button type="submit" className={BUTTONCLASSES} disabled={loading}>{loading ? 'Creating account…' : <><UserPlus className="h-4 w-4" aria-hidden="true" /> Create account</>}</button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-muted">Already have an account? <button type="button" onClick={onSwitchMode} className="font-bold text-brand-green underline-offset-4 hover:underline">Sign in</button></p>
    </div>
  )
}

export default SignUp
