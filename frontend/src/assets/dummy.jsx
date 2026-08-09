import {
    User, Mail, Home,
    ListChecks,
    CheckCircle2, Lock, Home as HomeIcon, Flame,
    SortDesc, SortAsc, Award,
    Edit2,
    Trash2,
    MoreVertical,
    Clock,
    Calendar,
    ListTodo,
    Flag,
} from "lucide-react"

// BACKEND TEST 
// DUMMY DATA
export const backendDummy = [
    { title: "Buy groceries", description: "Milk, bread, eggs", priority: "Low", dueDate: "2025-05-02T18:00:00.000Z", completed: "No" },
];

// assets/formConstants.js
export const baseControlClasses =
    "w-full px-4 py-2.5 bg-brand-surface-light border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm text-brand-text placeholder-brand-muted transition-all duration-200 outline-none";

export const priorityStyles = {
    Low: "bg-gray-100 text-gray-700 border-gray-200",
    Medium: "bg-gray-200 text-gray-800 border-gray-300",
    High: "bg-brand-green text-white border-brand-green",
};

export const DEFAULT_TASK = {
    title: "", description: "", priority: "Low", dueDate: "", completed: "No", id: null,
};

// LOGIN CSS
export const INPUTWRAPPER =
    "flex items-center bg-brand-surface-light border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-1 focus-within:ring-brand-green focus-within:border-brand-green transition-all duration-200 text-brand-text";
export const BUTTON_CLASSES =
    "w-full bg-brand-green text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm hover:bg-brand-green/90 transition-all duration-200 flex items-center justify-center gap-2";

// PROFILE CSS
export const INPUT_WRAPPER = INPUTWRAPPER;
export const FULL_BUTTON = BUTTON_CLASSES;
export const SECTION_WRAPPER = "bg-white/70 backdrop-blur-md rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 md:p-8"
export const BACK_BUTTON =
    "flex items-center text-brand-muted hover:text-brand-text mb-8 transition-colors duration-200"
export const DANGER_BTN =
    "w-full text-red-600 border border-red-200 bg-red-50 py-2.5 rounded-lg hover:bg-red-100 font-semibold transition-colors duration-200"

export const personalFields = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
]

export const securityFields = [
    { name: "current", placeholder: "Current Password" },
    { name: "new", placeholder: "New Password" },
    { name: "confirm", placeholder: "Confirm Password" },
];

export const menuItems = [
    { text: "Dashboard", path: "/", icon: <Home className="w-4 h-4" /> },
    { text: "Pending Tasks", path: "/pending", icon: <ListChecks className="w-4 h-4" /> },
    { text: "Completed Tasks", path: "/complete", icon: <CheckCircle2 className="w-4 h-4" /> },
]

export const SIDEBAR_CLASSES = {}
export const LINK_CLASSES = {}
export const PRODUCTIVITY_CARD = {}
export const TIP_CARD = {}

// SIGNUP 
export const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
]

export const Inputwrapper = INPUTWRAPPER;
export const BUTTONCLASSES = BUTTON_CLASSES;
export const MESSAGE_SUCCESS = "bg-gray-100 text-brand-green p-3 rounded-lg text-sm mb-4 border border-gray-200"
export const MESSAGE_ERROR = "bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200"

// TASK ITEM
export const getPriorityColor = (priority) => {
    const colors = {
        low: "border-gray-200 bg-gray-50 text-gray-600",
        medium: "border-gray-300 bg-gray-100 text-gray-800",
        high: "border-brand-green bg-brand-green text-white",
    }
    return colors[priority?.toLowerCase()] || "border-gray-200 bg-brand-surface text-brand-text"
}

export const getPriorityBadgeColor = (priority) => {
    const colors = {
        low: "bg-gray-100 text-gray-600 border border-gray-200",
        medium: "bg-gray-200 text-gray-800 border border-gray-300",
        high: "bg-brand-green text-white",
    }
    return colors[priority?.toLowerCase()] || "bg-gray-100 text-brand-text border border-gray-200"
}

// DASHBOARD
export const WRAPPER = "w-full"
export const HEADER = "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4"
export const ADD_BUTTON =
    "flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-brand-green/90 transition-all duration-200 font-semibold text-sm"
export const STATS_GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 md:mb-10"
export const STAT_CARD =
    "p-5 rounded-xl bg-brand-surface shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 min-w-0"
export const ICON_WRAPPER = "p-2 rounded-lg bg-gray-100 flex items-center justify-center"
export const VALUE_CLASS = "text-2xl font-bold truncate mt-3 text-brand-text"
export const LABEL_CLASS = "text-sm text-brand-muted font-medium truncate mt-1"

export const STATS = [
    { key: "total", label: "Total Tasks", icon: ListTodo, iconColor: "text-brand-green", valueKey: "total" },
    { key: "lowPriority", label: "Low Priority", icon: Flag, iconColor: "text-gray-400", borderColor: "border-gray-200", valueKey: "lowPriority", textColor: "text-brand-text" },
    { key: "mediumPriority", label: "Medium Priority", icon: Flag, iconColor: "text-gray-600", borderColor: "border-gray-200", valueKey: "mediumPriority", textColor: "text-brand-text" },
    { key: "highPriority", label: "High Priority", icon: Flag, iconColor: "text-brand-green", borderColor: "border-gray-200", valueKey: "highPriority", textColor: "text-brand-text" },
]

export const FILTER_OPTIONS = ["all", "today", "week", "high", "medium", "low"]
export const FILTER_LABELS = {
    all: "All Tasks", today: "Today", week: "This Week", high: "High Priority", medium: "Medium Priority", low: "Low Priority",
}

export const EMPTY_STATE = {
    wrapper: "p-10 bg-brand-surface rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center",
    iconWrapper: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400",
    btn: "px-5 py-2.5 bg-brand-green text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-green/90 transition-all duration-200 mt-2",
}

export const FILTER_WRAPPER = "flex items-center justify-between bg-brand-surface p-2 rounded-xl shadow-sm border border-gray-200"
export const SELECT_CLASSES = "w-full px-4 py-2 bg-brand-surface-light border border-gray-200 text-brand-text rounded-lg focus:ring-1 focus:ring-brand-green md:hidden text-sm outline-none"
export const TABS_WRAPPER = "hidden md:flex p-1 bg-brand-surface-light rounded-lg w-full justify-between gap-1 overflow-x-auto border border-gray-200"
export const TAB_BASE = "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap"
export const TAB_ACTIVE = "bg-brand-surface shadow-sm border border-gray-200 text-brand-green"
export const TAB_INACTIVE = "text-brand-muted hover:text-brand-green hover:bg-gray-100"

// COMPLETE TASK
export const SORT_OPTIONS = [
    { id: "newest", label: "Newest", icon: <SortDesc className="w-3.5 h-3.5" /> },
    { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3.5 h-3.5" /> },
    { id: "priority", label: "Priority", icon: <Award className="w-3.5 h-3.5" /> },
]

export const CT_CLASSES = {
    page: "w-full",
    header: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4",
    titleWrapper: "flex-1 min-w-0",
    title: "text-2xl font-bold text-brand-green flex items-center gap-3 truncate",
    subtitle: "text-sm text-brand-muted mt-1 ml-9",
    sortContainer: "w-full md:w-auto",
    sortBox: "flex items-center justify-between bg-brand-surface p-2 rounded-xl shadow-sm border border-gray-200 w-full md:w-auto gap-2",
    filterLabel: "flex items-center gap-2 text-brand-text font-semibold text-sm px-2",
    select: "px-3 py-1.5 bg-brand-surface-light border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green md:hidden text-sm text-brand-text outline-none",
    btnGroup: "hidden md:flex gap-1 bg-brand-surface-light p-1 rounded-lg border border-gray-200",
    btnBase: "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
    btnActive: "bg-brand-surface text-brand-green shadow-sm border border-gray-200",
    btnInactive: "text-brand-muted hover:text-brand-green hover:bg-gray-100",
    list: "space-y-3",
    emptyState: "p-10 bg-brand-surface rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center",
    emptyIconWrapper: "w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4",
    emptyTitle: "text-lg font-bold text-brand-green mb-1",
    emptyText: "text-sm text-brand-muted",
}

export const layoutClasses = {
    container: "w-full",
    headerWrapper: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4",
    sortBox: "flex items-center justify-between bg-brand-surface p-2 rounded-xl shadow-sm border border-gray-200 w-full md:w-auto gap-2",
    select: "px-3 py-1.5 bg-brand-surface-light border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green md:hidden text-sm text-brand-text outline-none",
    tabWrapper: "hidden md:flex gap-1 bg-brand-surface-light p-1 rounded-lg border border-gray-200",
    tabButton: (active) =>
        `px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${active
            ? "bg-brand-surface text-brand-green shadow-sm border border-gray-200"
            : "text-brand-muted hover:text-brand-green hover:bg-gray-100"
        }`,
    addBox: "hidden md:flex p-5 border border-dashed border-gray-300 rounded-xl hover:border-gray-500 transition-all duration-200 cursor-pointer mb-6 bg-brand-surface-light group items-center justify-center text-brand-muted hover:text-brand-green font-medium",
    emptyState: "p-10 bg-brand-surface rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center",
    emptyIconBg: "w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4",
    emptyBtn: "px-5 py-2.5 bg-brand-surface-light hover:bg-gray-200 border border-gray-200 text-brand-green rounded-lg text-sm font-medium transition-colors",
};


// TASK ITEM
export const MENU_OPTIONS = [
    { action: "edit", label: "Edit Task", icon: <Edit2 size={14} className="text-brand-text" /> },
    { action: "delete", label: "Delete", icon: <Trash2 size={14} className="text-red-500" /> },
]

export const TI_CLASSES = {
    wrapper: "group p-4 rounded-xl shadow-sm bg-brand-surface border-l-4 hover:border-l-brand-green transition-all duration-200 border border-gray-200",
    leftContainer: "flex items-start gap-3 flex-1 min-w-0",
    completeBtn: "mt-0.5 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200 shrink-0 text-gray-400 hover:text-brand-green",
    checkboxIconBase: "w-5 h-5",
    titleBase: "text-base font-semibold truncate text-brand-text",
    priorityBadge: "text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md shrink-0",
    description: "text-sm text-brand-muted mt-1 truncate",
    subtasksContainer: "mt-3 space-y-2 bg-brand-surface-light p-3 rounded-lg border border-gray-200",
    progressBarBg: "h-1.5 bg-gray-200 rounded-full overflow-hidden",
    progressBarFg: "h-full bg-brand-green transition-all duration-300",
    rightContainer: "flex flex-col items-end gap-2",
    menuButton: "p-1.5 hover:bg-gray-100 rounded-md text-brand-muted hover:text-brand-green transition-colors duration-200",
    menuDropdown: "absolute right-0 mt-1 w-40 bg-brand-surface border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden animate-fadeIn py-1",
    dateRow: "flex items-center gap-1.5 text-xs font-medium text-brand-muted whitespace-nowrap",
    createdRow: "flex items-center gap-1.5 text-[10px] text-gray-400 whitespace-nowrap",
}
