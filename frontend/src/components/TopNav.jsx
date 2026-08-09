import { NavLink, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const TopNav = () => {
  const navigate = useNavigate();
  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/pending", label: "Pending Tasks" },
    { path: "/complete", label: "Completed" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <div className="sticky top-0 z-50 flex justify-center px-8 pointer-events-none pt-0 pb-6 w-full">
      {/* The navbar itself has pointer events */}
      <nav className="nav-cutout pointer-events-auto flex items-center justify-between px-4 sm:px-8 py-3 w-full max-w-5xl">
        
        {/* Left - Logo */}
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => navigate("/")}
        >
          {/* Custom logo mimicking the image */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-10 h-10 text-brand-coral drop-shadow-md transition-transform group-hover:scale-105">
              <path fill="currentColor" d="M50 85 C 20 60, 10 40, 15 25 C 20 10, 40 10, 50 25 C 60 10, 80 10, 85 25 C 90 40, 80 60, 50 85 Z" />
              <circle cx="50" cy="35" r="15" fill="white" />
            </svg>
            <span className="ml-3 font-extrabold text-xl text-brand-green tracking-tight">Taskpods</span>
          </div>
        </div>

        {/* Center - Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative text-sm font-semibold transition-colors duration-300 ${
                  isActive ? "text-brand-coral" : "text-brand-muted hover:text-brand-text"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span 
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-green rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right - Action */}
        <div>
          <button 
            onClick={() => navigate("/")}
            className="bg-brand-green text-white px-6 py-2 rounded-full font-medium text-sm shadow-sm hover:bg-brand-green/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </nav>
    </div>
  );
};

export default TopNav;
