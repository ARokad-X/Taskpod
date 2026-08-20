import { createElement, useState } from 'react'
import { Menu, Plus, X, CheckCircle2, Home, ListChecks, UserCircle } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home, end: true },
  { path: '/pending', label: 'Pending tasks', icon: ListChecks },
  { path: '/complete', label: 'Completed', icon: CheckCircle2 },
  { path: '/profile', label: 'Profile', icon: UserCircle },
]

const TopNav = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const goTo = (path, state) => {
    setMenuOpen(false)
    navigate(path, state ? { state } : undefined)
  }

  return (
    <header className="top-nav-wrap">
      <nav className="top-nav" aria-label="Primary navigation">
        <button type="button" className="brand-button" onClick={() => goTo('/')} aria-label="Go to Taskpods dashboard">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="brand-name">Taskpods</span>
        </button>

        <div className="desktop-nav">
          {navItems.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              {createElement(Icon, { className: 'h-4 w-4', 'aria-hidden': true })}
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <button type="button" onClick={() => goTo('/', { openNewTask: true })} className="primary-button nav-new-task">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>New task</span>
          </button>
          <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-navigation" className="mobile-nav-panel">
            <div className="mobile-user-card">
              <div className="avatar" aria-hidden="true">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
              <div className="min-w-0"><p className="truncate font-semibold text-brand-text">{user?.name || 'User'}</p><p className="truncate text-xs text-brand-muted">{user?.email || 'Workspace member'}</p></div>
            </div>
            {navItems.map(({ path, label, icon: Icon, end }) => (
              <NavLink key={path} to={path} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}>
                {createElement(Icon, { className: 'h-4 w-4', 'aria-hidden': true })} {label}
              </NavLink>
            ))}
            <button type="button" className="mobile-nav-link text-red-600" onClick={() => { setMenuOpen(false); onLogout?.() }}>Sign out</button>
          </div>
        )}
      </nav>
      {location.pathname !== '/profile' && user && <div className="desktop-user" title={user.email || 'Signed in user'}><span className="avatar">{(user.name || 'U').charAt(0).toUpperCase()}</span><span className="hidden lg:inline">{user.name || 'User'}</span></div>}
    </header>
  )
}

export default TopNav
