import { Link, useLocation } from "react-router-dom"
import { useApp } from "../context/AppContext"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Sparkles,
  DollarSign,
  ShieldCheck,
  Eye,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react"
import { LogOut } from "lucide-react"

export default function Navbar({ darkMode, setDarkMode, onLogout }) {
  const { role, setRole } = useApp()
  const location = useLocation()

  const navLinks = [
    { path: "/",             label: "Dashboard",    icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: ArrowLeftRight  },
    { path: "/insights",     label: "Insights",     icon: Sparkles        },
  ]

  return (
    <nav className="
      bg-white dark:bg-gray-900
      border-b border-gray-100 dark:border-gray-800
      px-6 py-0
      flex items-center justify-between
      h-16
    ">

      {/* ── Logo ─────────────────────────────────────────────── */}
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

      {/* ── Nav Links ────────────────────────────────────────── */}
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
              <Icon
                size={15}
                strokeWidth={active ? 2.2 : 1.8}
                className={active ? "text-indigo-600 dark:text-indigo-400" : ""}
              />
              {label}
            </Link>
          )
        })}
      </div>

      {/* ── Right Controls ───────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Role Switcher */}
       
        {/* Role Badge */}
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

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
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
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800
            hover:text-gray-700 dark:hover:text-gray-200
            transition-colors duration-150
          "
        >
          {darkMode
            ? <Sun  size={17} strokeWidth={1.8} />
            : <Moon size={17} strokeWidth={1.8} />
          }
        </button>

      </div>
    </nav>
  )
}