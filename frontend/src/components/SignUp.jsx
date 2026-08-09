import { useState, useEffect } from "react"
import api from "../api/axios"
import { UserPlus } from "lucide-react"

import { Inputwrapper, FIELDS, BUTTONCLASSES, MESSAGE_SUCCESS, MESSAGE_ERROR } from '../assets/dummy'

// Dummy & Constants
const API_URL = import.meta.env.VITE_API_URL || "https://taskpods-api.onrender.com";
const INITIAL_FORM = { name: "", email: "", password: "" }

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    console.log("SignUp form data changed:", formData)
  }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: "", type: "" })
    try {
      const { data } = await api.post(`/api/user/register`, formData)
      console.log("SignUp successful:", data)
      setMessage({ text: "Registration successful! You can now log in.", type: "success" })
      setFormData(INITIAL_FORM)
    } catch (err) {
      console.error("SignUp error:", err)
      setMessage({ text: err.response?.data?.message || "An error occurred. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white/70 backdrop-blur-md border border-white/50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-coral to-brand-purple rounded-full mx-auto flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-brand-text">Create Account</h2>
        <p className="text-brand-muted text-sm mt-1">Join Taskpods to manage your tasks</p>
      </div>

      {message.text && (
        <div className={message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-brand-purple w-5 h-5 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className="w-full focus:outline-none text-sm text-brand-text"
              required
            />
          </div>
        ))}

        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? "Signing Up..." : <><UserPlus className="w-4 h-4" /> Sign Up</>}
        </button>
      </form>

      <p className="text-center text-sm text-brand-muted mt-6">
        Already have an account?{' '}
        <button
          onClick={onSwitchMode}
          className="text-brand-purple hover:text-brand-purple hover:underline font-medium transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  )
}

export default SignUp
