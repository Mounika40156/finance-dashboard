import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, TrendingUp, Shield, Zap, Lock, Mail,Sun, Moon } from "lucide-react"
import { BarChart3, ShieldCheck, Brain } from "lucide-react"
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes floatUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%) rotate(12deg); }
    100% { transform: translateX(400%) rotate(12deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(99,102,241,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0); }
  }
  @keyframes ticker {
    0%   { transform: translateY(0); }
    33%  { transform: translateY(-33.33%); }
    66%  { transform: translateY(-66.66%); }
    100% { transform: translateY(0); }
  }
  @keyframes orb1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(30px, -20px) scale(1.05); }
  }
  @keyframes orb2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(-20px, 30px) scale(1.08); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .login-font  { font-family: 'DM Sans', sans-serif; }
  .login-serif { font-family: 'DM Serif Display', serif; }

  .shimmer-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
    transform: translateX(-100%) rotate(12deg);
  }
  .shimmer-btn:hover::after { animation: shimmer 0.65s ease forwards; }

  .input-field {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border-radius: 0.875rem;
    border: 1.5px solid #e5e7eb;
    background: #fafafa;
    font-size: 0.875rem;
    color: #111827;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    font-family: 'DM Sans', sans-serif;
  }
  .input-field:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
  }
  .input-field::placeholder { color: #9ca3af; }
`

const DEMO_USERS = [
  { email: "admin@financeapp.com",  password: "admin123",  role: "admin"  },
  { email: "viewer@financeapp.com", password: "viewer123", role: "viewer" },
]

// ✅ Fixed: using ₹ only in display strings, not in template literals for animation
const stats = [
  { label: "Portfolio Value", values: ["₹20,48,500", "₹25,60,000", "₹15,75,000"], color: "#10b981" },
  { label: "Monthly Growth",  values: ["+12.4%",     "+8.7%",      "+15.2%"],      color: "#a5b4fc" },
  { label: "Active Assets",   values: ["24",          "31",          "18"],          color: "#fbbf24" },
]

const features = [
  { icon: BarChart3, title: "Real-time tracking", desc: "Monitor every transaction instantly" },
  { icon: ShieldCheck, title: "Bank-grade security", desc: "256-bit SSL encryption on all data" },
  { icon: Brain, title: "Smart insights", desc: "AI-powered spending analysis" },
]

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const [showPw, setShowPw]             = useState(false)
  const [error, setError]               = useState("")
  const [loading, setLoading]           = useState(false)
  const [focusedField, setFocusedField] = useState(null)
const [darkMode, setDarkMode] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const user = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (user) { onLogin?.(user.role); navigate("/") }
    else       { setError("Invalid credentials. Try the demo accounts below."); setLoading(false) }
  }

  const fillDemo = (role) => {
    const user = DEMO_USERS.find(u => u.role === role)
    setEmail(user.email); setPassword(user.password); setError("")
  }

  return (
    <>
      <style>{styleTag}</style>
<div className={`login-font min-h-screen flex ${darkMode ? "dark bg-gray-900" : ""}`} style={{ background: darkMode ? "#020617" : "#f8f7f4" }}>
        {/* ── Left Panel ───────────────────────────────────────── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12"
          style={{ background: "linear-gradient(155deg, #0a0818 0%, #1a1560 45%, #0f1f3d 100%)" }}
        >
          {/* Orbs */}
          <div style={{ position:"absolute", top:"10%", left:"15%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", animation:"orb1 8s ease-in-out infinite", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"15%", right:"10%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", animation:"orb2 10s ease-in-out infinite", pointerEvents:"none" }} />

          {/* Dot grid — more visible */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize:"32px 32px", animation:"fadeIn 2s ease forwards"
          }} />

          {/* Logo */}
          <div style={{ animation:"floatUp 0.5s ease both", position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
  
  {/* Logo */}
  <div style={{
    width:42,
    height:42,
    borderRadius:12,
    background:"linear-gradient(135deg, #6366f1, #818cf8)",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    animation:"pulse-ring 2.5s ease infinite"
  }}>
    <TrendingUp size={18} color="#fff" strokeWidth={2.5} />
  </div>

  {/* Text Section */}
  <div style={{ display:"flex", flexDirection:"column", lineHeight:1.2 }}>
    <span style={{ color:"#fff", fontWeight:700, fontSize:18 }}>
      FinanceApp
    </span>
    <span style={{ color:"#c7d2fe", fontSize:11, letterSpacing:"0.08em" }}>
      Personal Finance Intelligence
    </span>
  </div>

</div>
          </div>

          {/* Hero copy */}
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ animation:"floatUp 0.55s ease 0.15s both" }}>
              {/* Pill badge */}
      <h1 className="login-serif" style={{ color:"#fff", fontSize:"clamp(2.2rem, 3.2vw, 3rem)", lineHeight:1.15, marginBottom:16 }}>
                Your money,<br />
                <span style={{ color:"#a5b4fc", fontStyle:"italic" }}>clearly.</span>
              </h1>
              <p style={{ color:"rgba(203,213,225,0.75)", fontSize:15, lineHeight:1.75, maxWidth:360 }}>
                Track every rupee, spot every trend, and make smarter financial decisions with real-time insights.
              </p>
            </div>

            {/* Feature list — replaces barely-visible stats ticker */}
            <div style={{ animation:"floatUp 0.55s ease 0.28s both", marginTop:36, display:"flex", flexDirection:"column", gap:12 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"12px 16px" }}>
                  <f.icon size={20} strokeWidth={2} color="#a5b4fc" />
                  <div>
                    <p style={{ color:"#e2e8f0", fontWeight:600, fontSize:13, marginBottom:2 }}>{f.title}</p>
                    <p style={{ color:"rgba(148,163,184,0.8)", fontSize:12 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live stats ticker — now clearly visible */}
            <div style={{ animation:"floatUp 0.55s ease 0.42s both", marginTop:24, display:"flex", gap:10 }}>
              {stats.map((s, i) => (
                <div key={i} style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"10px 12px", overflow:"hidden" }}>
                  <p style={{ color:"rgba(203,213,225,0.85)", fontSize:11, fontWeight:600, marginBottom:4, letterSpacing:"0.04em" }}>
                    {s.label}
                  </p>
                  <div style={{ height:22, overflow:"hidden" }}>
                    {/* ✅ Fixed template literal — uses ${} not ₹{} */}
                    <div style={{ animation: `ticker ${4 + i}s steps(1) infinite` }}>
                      {[...s.values, s.values[0]].map((v, j) => (
                        <p key={j} style={{ color:s.color, fontWeight:700, fontSize:14, height:22, lineHeight:"22px" }}>{v}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div style={{ animation:"floatUp 0.55s ease 0.55s both", marginTop:20, display:"flex", gap:20 }}>
              {[{ icon:Shield, text:"Bank-grade encryption" }, { icon:Zap, text:"Real-time sync" }].map(({ icon:Icon, text }, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Icon size={13} color="#a5b4fc" strokeWidth={2} />
                  <span style={{ color:"rgba(203,213,225,0.7)", fontSize:12 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:12, position:"relative", zIndex:1, animation:"fadeIn 1s ease 1s both" }}>
            © 2026 FinanceApp. All rights reserved.
          </p>
        </div>

        {/* ── Right Panel ──────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16" style={{ animation:"fadeIn 0.5s ease both" }}>
          <div style={{ width:"100%", maxWidth:420 }}>
            {/* Dark Mode Toggle */}
<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
  <button
    onClick={() => setDarkMode(!darkMode)}
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
      ? <Sun size={17} strokeWidth={1.8} />
      : <Moon size={17} strokeWidth={1.8} />
    }
  </button>
</div>

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-10" style={{ animation:"floatUp 0.4s ease both" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <TrendingUp size={16} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight:700, fontSize:16, color:"#111827" }}>FinanceApp</span>
            </div>

            <div style={{ animation:"floatUp 0.45s ease 0.05s both" }}>
              <h2
  className="login-serif text-gray-900 dark:text-white"
  style={{ fontSize:"2rem", marginBottom:6, lineHeight:1.2 }}
>Welcome back</h2>
              <p style={{ color:"#6b7280", fontSize:14 }}>Sign in to your account to continue</p>
            </div>

            {/* Demo pills */}
            <div style={{ animation:"floatUp 0.45s ease 0.12s both", marginTop:28, marginBottom:8 }}>
              <p style={{ fontSize:11, color:"#9ca3af", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>Quick demo access</p>
              <div style={{ display:"flex", gap:8 }}>
                {[
                  { role:"admin",  label:"Admin",  icon:"🛠", border:"#a5b4fc", bg:"rgba(99,102,241,0.05)", color:"#6366f1" },
                  { role:"viewer", label:"Viewer", icon:"👁", border:"#d1d5db", bg:"#fff",                  color:"#6b7280" },
                ].map(({ role, label, icon, border, bg, color }) => (
                  <button key={role} type="button" onClick={() => fillDemo(role)} style={{ flex:1, padding:"9px 0", borderRadius:10, border:`1.5px dashed ${border}`, background:bg, color, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s", fontFamily:"'DM Sans', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)" }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none" }}
                  >
                    {icon} {label} Demo
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ animation:"floatUp 0.45s ease 0.18s both", display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
              <div style={{ flex:1, height:1, background:"#f0f0f0" }} />
              <span style={{ fontSize:11, color:"#d1d5db", fontWeight:500 }}>or sign in manually</span>
              <div style={{ flex:1, height:1, background:"#f0f0f0" }} />
            </div>

            <form onSubmit={handleSubmit} style={{ animation:"floatUp 0.45s ease 0.22s both" }}>
              {/* Email */}
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6 }}>Email address</label>
                <div style={{ position:"relative" }}>
                  <Mail size={15} strokeWidth={2} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color: focusedField==="email" ? "#6366f1" : "#9ca3af", transition:"color 0.2s", pointerEvents:"none" }} />
                  <input type="email" className="input-field" placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} required />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:8 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6 }}>Password</label>
                <div style={{ position:"relative" }}>
                  <Lock size={15} strokeWidth={2} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color: focusedField==="password" ? "#6366f1" : "#9ca3af", transition:"color 0.2s", pointerEvents:"none" }} />
                  <input type={showPw ? "text" : "password"} className="input-field" placeholder="••••••••" value={password}
                    onChange={e => setPassword(e.target.value)} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} required style={{ paddingRight:"2.75rem" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:4 }}>
                    {showPw ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
                <button type="button" style={{ background:"none", border:"none", fontSize:12, color:"#6366f1", cursor:"pointer", fontWeight:500, fontFamily:"'DM Sans', sans-serif" }}>
                  Forgot password?
                </button>
              </div>

              {error && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#dc2626", animation:"floatUp 0.2s ease both" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="shimmer-btn"
                style={{ width:"100%", padding:"13px", borderRadius:14, border:"none", background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", color:"#fff", fontWeight:600, fontSize:14, cursor: loading ? "not-allowed" : "pointer", transition:"all 0.2s", boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)", position:"relative", overflow:"hidden", fontFamily:"'DM Sans', sans-serif" }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(99,102,241,0.45)" }}}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)" }}
              >
                {loading
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                      <svg style={{ animation:"spin 0.7s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                      Signing in…
                    </span>
                  : "Sign in to FinanceApp"
                }
              </button>
            </form>

            <p style={{ animation:"floatUp 0.45s ease 0.4s both", marginTop:24, fontSize:12, color:"#9ca3af", textAlign:"center" }}>
              Protected by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </>
  )
}