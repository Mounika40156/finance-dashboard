import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useApp } from "../context/AppContext"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Sparkles,
  DollarSign,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
} from "lucide-react"

export default function Navbar({ darkMode, setDarkMode, onLogout }) {
  const { role } = useApp()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navLinks = [
    { path: "/",             label: "Dashboard",    icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: ArrowLeftRight  },
    { path: "/insights",     label: "Insights",     icon: Sparkles        },
  ]

  return (
    <>
      {/* ── Top Navbar ───────────────────────────────────────── */}
      <nav className="
        bg-white dark:bg-gray-900
        border-b border-gray-100 dark:border-gray-800
        px-6 py-0
        flex items-center justify-between
        h-16 sticky top-0 z-40
      ">

        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger — only on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="
              sm:hidden w-9 h-9
              flex items-center justify-center
              rounded-lg
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors duration-150
            "
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="
              w-8 h-8 rounded-lg
              bg-indigo-600 dark:bg-indigo-500
              flex items-center justify-center
              group-hover:bg-indigo-700 dark:group-hover:bg-indigo-400
              transition-colors
            ">
              <DollarSign size={16} strokeWidth={2.5} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white">
              FinanceApp
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-2
                  px-3.5 py-2 rounded-lg
                  text-sm font-medium
                  transition-colors duration-150
                  ${active
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Role Badge (desktop only) */}
          <span className={`
            hidden sm:inline-flex items-center
            text-xs font-medium px-2.5 py-1 rounded-full
            ${role === "admin"
              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700"
            }
          `}>
            {role === "admin" ? "Admin" : "Viewer"}
          </span>

          <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-500 transition-colors duration-150"
            aria-label="Sign out"
          >
            <LogOut size={16} strokeWidth={1.8} />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            className="
              w-9 h-9 flex items-center justify-center rounded-lg
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              hover:text-gray-700 dark:hover:text-gray-200
              transition-colors duration-150
            "
          >
            {darkMode ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Sidebar Overlay ───────────────────────────── */}
      {sidebarOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 flex"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Sidebar panel */}
          <div
            className="
              relative z-10
              w-64 h-full
              bg-white dark:bg-gray-900
              border-r border-gray-100 dark:border-gray-800
              flex flex-col
              shadow-2xl
            "
            onClick={e => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                  <DollarSign size={16} strokeWidth={2.5} className="text-white" />
                </div>
                <span className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white">
                  FinanceApp
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            {/* Role Badge */}
            <div className="px-5 pt-4">
              <span className={`
                inline-flex items-center
                text-xs font-medium px-2.5 py-1 rounded-full
                ${role === "admin"
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700"
                }
              `}>
                {role === "admin" ? "Admin" : "Viewer"}
              </span>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col gap-1 px-3 pt-4 flex-1">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3
                      px-4 py-3 rounded-xl
                      text-sm font-medium
                      transition-colors duration-150
                      ${active
                        ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                    {label}
                  </Link>
                )
              })}
            </div>

            {/* Bottom actions */}
            <div className="px-3 pb-6 flex flex-col gap-1 border-t border-gray-100 dark:border-gray-800 pt-3">
              <button
                onClick={() => { setDarkMode(!darkMode); setSidebarOpen(false) }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                onClick={() => { onLogout(); setSidebarOpen(false) }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
              >
                <LogOut size={18} strokeWidth={1.8} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}