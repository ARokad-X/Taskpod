import {
  Award, Calendar, CheckCircle2, Clock, Edit2, Flag, Home, ListChecks, ListTodo, Lock, Mail, MoreVertical, SortAsc, SortDesc, Trash2, User,
} from 'lucide-react'

export const baseControlClasses = 'form-control'

export const DEFAULT_TASK = {
  title: '', description: '', priority: 'Low', dueDate: '', completed: 'No', id: null,
}

export const INPUTWRAPPER = 'flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-[#fbfdfb] px-3 py-2 transition focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/15'
export const BUTTON_CLASSES = 'primary-button w-full'
export const INPUT_WRAPPER = INPUTWRAPPER
export const FULL_BUTTON = BUTTON_CLASSES
export const SECTION_WRAPPER = 'panel-card p-5 sm:p-7'
export const BACK_BUTTON = 'inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition-colors hover:text-brand-green'
export const DANGER_BTN = 'w-full rounded-xl border border-red-200 bg-red-50 py-2.5 font-semibold text-red-600 transition-colors hover:bg-red-100'

export const personalFields = [
  { name: 'name', type: 'text', placeholder: 'Full name', icon: User },
  { name: 'email', type: 'email', placeholder: 'Email', icon: Mail },
]
export const securityFields = [
  { name: 'current', placeholder: 'Current password' },
  { name: 'new', placeholder: 'New password' },
  { name: 'confirm', placeholder: 'Confirm password' },
]
export const FIELDS = [
  { name: 'name', type: 'text', placeholder: 'Full name', icon: User },
  { name: 'email', type: 'email', placeholder: 'Email', icon: Mail },
  { name: 'password', type: 'password', placeholder: 'Password', icon: Lock },
]
export const Inputwrapper = INPUTWRAPPER
export const BUTTONCLASSES = BUTTON_CLASSES
export const MESSAGE_SUCCESS = 'rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700'
export const MESSAGE_ERROR = 'rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600'

export const getPriorityColor = (priority) => ({
  low: 'border-gray-200',
  medium: 'border-amber-300',
  high: 'border-brand-green',
}[priority?.toLowerCase()] || 'border-gray-200')

export const getPriorityBadgeColor = (priority) => ({
  low: 'bg-gray-100 text-gray-600 border border-gray-200',
  medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  high: 'bg-green-50 text-green-700 border border-green-200',
}[priority?.toLowerCase()] || 'bg-gray-100 text-gray-600 border border-gray-200')

export const WRAPPER = 'w-full'
export const HEADER = 'page-header'
export const ADD_BUTTON = 'primary-button'
export const STATS_GRID = 'mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4'
export const STAT_CARD = 'stat-card'
export const ICON_WRAPPER = 'stat-icon'
export const VALUE_CLASS = 'text-2xl font-bold'
export const LABEL_CLASS = 'mt-1 truncate text-sm font-medium text-brand-muted'
export const STATS = [
  { key: 'total', label: 'Total tasks', icon: ListTodo, iconColor: 'text-brand-green', valueKey: 'total' },
  { key: 'lowPriority', label: 'Low priority', icon: Flag, iconColor: 'text-gray-400', valueKey: 'lowPriority', textColor: 'text-brand-text' },
  { key: 'mediumPriority', label: 'Medium priority', icon: Flag, iconColor: 'text-amber-600', valueKey: 'mediumPriority', textColor: 'text-brand-text' },
  { key: 'highPriority', label: 'High priority', icon: Flag, iconColor: 'text-green-700', valueKey: 'highPriority', textColor: 'text-brand-text' },
]
export const FILTER_OPTIONS = ['all', 'today', 'week', 'high', 'medium', 'low']
export const FILTER_LABELS = { all: 'All tasks', today: 'Today', week: 'This week', high: 'High priority', medium: 'Medium priority', low: 'Low priority' }
export const EMPTY_STATE = {
  wrapper: 'state-card p-8 sm:p-10',
  iconWrapper: 'mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-50 text-brand-green',
  btn: 'primary-button mt-2',
}
export const FILTER_WRAPPER = 'flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between'
export const SELECT_CLASSES = 'form-control sm:hidden'
export const TABS_WRAPPER = 'hidden w-full gap-1 overflow-x-auto rounded-lg bg-gray-50 p-1 sm:flex'
export const TAB_BASE = 'rounded-md px-3 py-2 text-sm font-semibold transition whitespace-nowrap'
export const TAB_ACTIVE = 'bg-white text-brand-green shadow-sm'
export const TAB_INACTIVE = 'text-brand-muted hover:bg-white hover:text-brand-green'

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest', icon: SortDesc },
  { id: 'oldest', label: 'Oldest', icon: SortAsc },
  { id: 'priority', label: 'Priority', icon: Award },
]
export const CT_CLASSES = {
  page: 'w-full',
  header: 'page-header',
  titleWrapper: 'min-w-0',
  title: 'page-title',
  subtitle: 'page-subtitle',
  sortContainer: 'w-full sm:w-auto',
  sortBox: 'flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:w-auto',
  filterLabel: 'flex items-center gap-2 px-2 text-sm font-semibold text-brand-text',
  select: 'form-control max-w-[12rem] sm:hidden',
  btnGroup: 'hidden gap-1 rounded-lg bg-gray-50 p-1 sm:flex',
  btnBase: 'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition',
  btnActive: 'bg-white text-brand-green shadow-sm',
  btnInactive: 'text-brand-muted hover:bg-white hover:text-brand-green',
  list: 'space-y-3',
  emptyState: 'state-card p-8 sm:p-10',
  emptyIconWrapper: 'mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-50 text-brand-green',
  emptyTitle: 'text-lg font-bold text-brand-text',
  emptyText: 'mt-1 text-sm text-brand-muted',
}
export const layoutClasses = {
  container: 'w-full',
  headerWrapper: 'page-header',
  sortBox: 'flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:w-auto',
  select: 'form-control max-w-[12rem] sm:hidden',
  tabWrapper: 'hidden gap-1 rounded-lg bg-gray-50 p-1 sm:flex',
  tabButton: (active) => `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${active ? 'bg-white text-brand-green shadow-sm' : 'text-brand-muted hover:bg-white hover:text-brand-green'}`,
  addBox: 'group mb-5 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-4 text-brand-muted transition hover:border-brand-green hover:text-brand-green',
  emptyState: 'state-card p-8 sm:p-10',
  emptyIconBg: 'mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-50 text-brand-green',
  emptyBtn: 'primary-button mt-4',
}

export const MENU_OPTIONS = [
  { action: 'edit', label: 'Edit task', icon: Edit2 },
  { action: 'delete', label: 'Delete', icon: Trash2 },
]
export const TI_CLASSES = {
  wrapper: 'task-card flex flex-col gap-4 border-l-4 p-4 transition hover:-translate-y-0.5 sm:p-5 md:flex-row md:items-start md:justify-between',
  leftContainer: 'flex min-w-0 flex-1 items-start gap-3',
  completeBtn: 'mt-0.5 shrink-0 rounded-lg p-1.5 text-gray-300 transition hover:bg-green-50 hover:text-brand-green',
  checkboxIconBase: 'h-5 w-5',
  titleBase: 'break-words text-base font-bold',
  priorityBadge: 'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
  description: 'mt-1 break-words text-sm leading-6 text-brand-muted',
  subtasksContainer: 'mt-3 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3',
  progressBarBg: 'h-1.5 overflow-hidden rounded-full bg-gray-200',
  progressBarFg: 'h-full rounded-full bg-brand-green transition-all duration-300',
  rightContainer: 'flex items-center justify-between gap-3 md:flex-col md:items-end',
  menuButton: 'rounded-lg p-2 text-brand-muted transition hover:bg-gray-100 hover:text-brand-green',
  menuDropdown: 'absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl',
  dateRow: 'flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-brand-muted',
  createdRow: 'mt-1 flex items-center gap-1.5 whitespace-nowrap text-[10px] text-gray-400',
}

export const unusedIconReferences = { Calendar, Clock, MoreVertical }
