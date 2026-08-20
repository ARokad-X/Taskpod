import { createElement, useEffect, useState } from 'react'
import { ChevronLeft, Lock, LogOut, Save, Shield, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import api from '../api/axios'
import { BACK_BUTTON, DANGER_BTN, FULL_BUTTON, INPUT_WRAPPER, personalFields, SECTION_WRAPPER, securityFields } from '../assets/constants'
import { getToken } from '../utils/auth'
import 'react-toastify/dist/ReactToastify.css'

export default function Profile({ setCurrentUser, onLogout }) {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (!token) return
    api.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (data.success) setProfile({ name: data.user.name || '', email: data.user.email || '' })
        else toast.error(data.message || 'Unable to load profile.')
      })
      .catch(() => toast.error('Unable to load profile.'))
  }, [])

  const saveProfile = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.put('/api/user/profile', profile, { headers: { Authorization: `Bearer ${getToken()}` } })
      if (!data.success) throw new Error(data.message || 'Profile update failed.')
      setCurrentUser((previous) => ({ ...previous, name: profile.name, email: profile.email, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=4CBB17&color=fff` }))
      toast.success('Profile updated.')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Profile update failed.')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (event) => {
    event.preventDefault()
    if (passwords.new.length < 8) return toast.error('New password must be at least 8 characters.')
    if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match.')
    setLoading(true)
    try {
      const { data } = await api.put('/api/user/password', { currentPassword: passwords.current, newPassword: passwords.new }, { headers: { Authorization: `Bearer ${getToken()}` } })
      if (!data.success) throw new Error(data.message || 'Password change failed.')
      toast.success('Password changed.')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Password change failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <ToastContainer position="top-center" autoClose={2800} hideProgressBar />
      <button type="button" onClick={() => navigate(-1)} className={`${BACK_BUTTON} mb-6`}><ChevronLeft className="h-5 w-5" aria-hidden="true" /> Back</button>
      <div className="mb-7 flex items-center gap-4"><div className="avatar h-14 w-14 text-xl">{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}</div><div><h1 className="text-2xl font-extrabold tracking-tight text-brand-text sm:text-3xl">Account settings</h1><p className="mt-1 text-sm text-brand-muted">Manage your profile and security preferences.</p></div></div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className={SECTION_WRAPPER}>
          <div className="mb-5 flex items-center gap-2"><UserCircle className="h-5 w-5 text-brand-green" aria-hidden="true" /><h2 className="text-lg font-bold text-brand-text">Personal information</h2></div>
          <form onSubmit={saveProfile} className="space-y-4">
            {personalFields.map(({ name, type, placeholder, icon: Icon }) => <div key={name}><label className="form-label" htmlFor={`profile-${name}`}>{placeholder}</label><div className={INPUT_WRAPPER}>{createElement(Icon, { className: 'h-5 w-5 shrink-0 text-brand-green', 'aria-hidden': true })}<input id={`profile-${name}`} type={type} value={profile[name]} onChange={(event) => setProfile((previous) => ({ ...previous, [name]: event.target.value }))} className="w-full bg-transparent text-sm outline-none" required /></div></div>)}
            <button type="submit" className={FULL_BUTTON} disabled={loading}><Save className="h-4 w-4" aria-hidden="true" /> Save changes</button>
          </form>
        </section>
        <section className={SECTION_WRAPPER}>
          <div className="mb-5 flex items-center gap-2"><Shield className="h-5 w-5 text-brand-green" aria-hidden="true" /><h2 className="text-lg font-bold text-brand-text">Security</h2></div>
          <form onSubmit={changePassword} className="space-y-4">
            {securityFields.map(({ name, placeholder }) => <div key={name}><label className="form-label" htmlFor={`password-${name}`}>{placeholder}</label><div className={INPUT_WRAPPER}><Lock className="h-5 w-5 shrink-0 text-brand-green" aria-hidden="true" /><input id={`password-${name}`} type="password" value={passwords[name]} onChange={(event) => setPasswords((previous) => ({ ...previous, [name]: event.target.value }))} className="w-full bg-transparent text-sm outline-none" required /></div></div>)}
            <button type="submit" className={FULL_BUTTON} disabled={loading}><Shield className="h-4 w-4" aria-hidden="true" /> Change password</button>
            <div className="mt-7 border-t border-gray-100 pt-5"><h3 className="mb-3 flex items-center gap-2 font-bold text-red-600"><LogOut className="h-4 w-4" aria-hidden="true" /> Danger zone</h3><button type="button" onClick={onLogout} className={DANGER_BTN}>Sign out</button></div>
          </form>
        </section>
      </div>
    </div>
  )
}
