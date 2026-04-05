import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AppProvider } from "./context/AppContext"
import Navbar      from "./components/Navbar"
import Dashboard   from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Insights    from "./pages/Insights"
import Login       from "./pages/Login"

export default function App() {
  const [darkMode,   setDarkMode]   = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginRole,  setLoginRole]  = useState("viewer")

  const handleLogin  = (role) => { setLoginRole(role); setIsLoggedIn(true)  }
  const handleLogout = ()     => { setIsLoggedIn(false); setLoginRole("viewer") }

  return (
    // ✅ Pass loginRole so context initialises with the correct role
    <AppProvider initialRole={loginRole}>
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          {!isLoggedIn ? (
            <Routes>
              <Route path="*" element={<Login onLogin={handleLogin} />} />
            </Routes>
          ) : (
            <>
              <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onLogout={handleLogout} />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/"             element={<Dashboard />}    />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/insights"     element={<Insights />}     />
                  <Route path="*"             element={<Navigate to="/" />} />
                </Routes>
              </main>
            </>
          )}
        </div>
      </div>
    </AppProvider>
  )
}