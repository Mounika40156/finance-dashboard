import { useApp } from "../context/AppContext"
import { monthlyData, categoryColors } from "../data/mockData"
import SummaryCard from "../components/SummaryCard"
import { ArrowUpRight, ArrowDownRight, Plus, ShieldCheck, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { formatINR } from "../utils/formatINR"

const styleTag = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { totalBalance, totalIncome, totalExpenses, transactions, role, setRole } = useApp()
  const navigate = useNavigate()

  const categoryTotals = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc }, {})

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const isAdmin = role === "admin"

  return (
    <>
      <style>{styleTag}</style>
      <div className="space-y-6">

        {/* ── Header + Role Toggle ────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          style={{ animation: "fadeSlideUp 0.35s ease both" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {isAdmin ? "Admin Dashboard" : "Overview"}
              </h1>
              {/* Role badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isAdmin
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700"
              }`}>
                {isAdmin
                  ? <ShieldCheck size={11} strokeWidth={2.5} />
                  : <Eye size={11} strokeWidth={2.5} />
                }
                {isAdmin ? "Admin" : "Viewer"}
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {isAdmin
                ? "Full access — you can add, edit and delete transactions."
                : "Read-only view — contact an admin to make changes."}
            </p>
          </div>

          {/* Role toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shrink-0"
            style={{ animation: "slideInRight 0.4s ease 0.1s both" }}>
            {["viewer", "admin"].map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize ${
                  role === r
                    ? r === "admin"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}>
                {r === "admin"
                  ? <ShieldCheck size={11} strokeWidth={2.5} />
                  : <Eye         size={11} strokeWidth={2.5} />
                }
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ── Admin Quick Actions ─────────────────────────────── */}
        {isAdmin && (
          <div
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ animation: "fadeSlideUp 0.4s ease 0.05s both" }}
          >
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">Admin Controls</p>
              <p className="text-indigo-200 text-xs">Add new transactions or manage existing ones from Transactions.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/transactions")}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-50 active:scale-95 transition-all duration-150"
              >
                <Plus size={13} strokeWidth={3} />
                Add Transaction
              </button>
              <button
                onClick={() => navigate("/insights")}
                className="px-4 py-2 bg-indigo-700/50 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                View Insights
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard title="Total Balance"  amount={totalBalance}  variant="balance"  sub="Net balance"       index={0} />
          <SummaryCard title="Total Income"   amount={totalIncome}   variant="income"   sub="All-time income"   index={1} />
          <SummaryCard title="Total Expenses" amount={totalExpenses} variant="expenses" sub="All-time expenses"  index={2} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "200ms" }}>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Monthly Income vs Expenses</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Trend over the past months</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:"#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:"#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:12 }} />
                <Area type="monotone" dataKey="income"   stroke="#6366f1" fill="url(#gIncome)"   strokeWidth={2} dot={false} activeDot={{ r:4 }} />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#gExpenses)" strokeWidth={2} dot={false} activeDot={{ r:4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Spending by Category</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Breakdown of where money goes</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, i) => <Cell key={i} fill={categoryColors[entry.name] || "#8884d8"} />)}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend wrapperStyle={{ fontSize:12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "320ms" }}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Transactions</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Last 5 entries</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentTransactions.map((t, i) => (
              <div key={t.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                style={{ animation: "fadeSlideUp 0.35s ease both", animationDelay: `${360 + i * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    t.type === "income" ? "bg-emerald-50 dark:bg-emerald-950" : "bg-rose-50 dark:bg-rose-950"
                  }`}>
                    {t.type === "income"
                      ? <ArrowUpRight   size={15} strokeWidth={2.2} className="text-emerald-600 dark:text-emerald-400" />
                      : <ArrowDownRight size={15} strokeWidth={2.2} className="text-rose-500 dark:text-rose-400" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{t.date} · {t.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${
                  t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                }`}>
                  {t.type === "income" ? "+" : "−"}{formatINR(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}