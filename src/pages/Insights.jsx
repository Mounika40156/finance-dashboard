import { useApp } from "../context/AppContext"
import { monthlyData, categoryColors } from "../data/mockData"
import { AlertTriangle, CheckCircle2, BarChart2 } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts"

const styleTag = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">${p.value?.toLocaleString()}</p>
      ))}
    </div>
  )
}

const InsightMetric = ({ label, value, sub, accentClass, index }) => (
  <div
    className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-300"
    style={{ animation: "fadeSlideUp 0.4s ease both", animationDelay: `${index * 70}ms` }}
  >
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">{label}</p>
    <p className={`text-2xl font-bold tracking-tight ${accentClass}`}>{value}</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
  </div>
)

export default function Insights() {
  const { transactions } = useApp()

  const categoryTotals = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc }, {})

  const categoryArray = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const highestCategory = categoryArray[0]
  const lowestCategory  = categoryArray[categoryArray.length - 1]

  const monthlySavings = monthlyData.map(m => ({
    month: m.month, savings: m.income - m.expenses,
  }))

  const totalIncome   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const savingsRate   = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)
  const avgExpense    = (totalExpenses / transactions.filter(t => t.type === "expense").length).toFixed(0)

  const observations = [
    {
      icon: AlertTriangle,
      bg:   "bg-rose-50 dark:bg-rose-950/50",
      iconColor: "text-rose-500 dark:text-rose-400",
      title: <>Highest spending category is <strong>{highestCategory?.name}</strong></>,
      sub:   `Consider reviewing your ${highestCategory?.name?.toLowerCase()} expenses to find savings.`,
    },
    {
      icon: CheckCircle2,
      bg:   "bg-emerald-50 dark:bg-emerald-950/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      title: <>You're saving <strong>{savingsRate}%</strong> of your income</>,
      sub:   savingsRate >= 20
        ? "Great work — you're above the recommended 20% savings rate."
        : "Try to reach a 20% savings rate for long-term financial health.",
    },
    {
      icon: BarChart2,
      bg:   "bg-indigo-50 dark:bg-indigo-950/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      title: <>Average expense transaction is <strong>${avgExpense}</strong></>,
      sub:   "Tracking small expenses adds up — every dollar counts.",
    },
  ]

  return (
    <>
      <style>{styleTag}</style>
      <div className="space-y-6">

        {/* Header */}
        <div style={{ animation: "fadeSlideUp 0.35s ease both" }}>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Insights</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Smart observations from your financial data</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightMetric label="Highest Spending" value={highestCategory?.name} sub={`$${highestCategory?.value} spent`}     accentClass="text-rose-500 dark:text-rose-400"      index={0} />
          <InsightMetric label="Lowest Spending"  value={lowestCategory?.name}  sub={`$${lowestCategory?.value} spent`}      accentClass="text-emerald-600 dark:text-emerald-400" index={1} />
          <InsightMetric label="Savings Rate"     value={`${savingsRate}%`}      sub="Of total income saved"                  accentClass="text-indigo-600 dark:text-indigo-400"   index={2} />
          <InsightMetric label="Avg. Expense"     value={`$${avgExpense}`}       sub="Per transaction"                        accentClass="text-amber-500 dark:text-amber-400"     index={3} />
        </div>

        {/* Charts */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          style={{ animation: "fadeSlideUp 0.4s ease both", animationDelay: "240ms" }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Monthly Savings</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Income minus expenses per month</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySavings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="savings" radius={[6, 6, 0, 0]}>
                  {monthlySavings.map((entry, i) => (
                    <Cell key={i} fill={entry.savings >= 0 ? "#6366f1" : "#f43f5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Spending by Category</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Total amount per category</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryArray} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {categoryArray.map((entry, i) => (
                    <Cell key={i} fill={categoryColors[entry.name] || "#8884d8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Observations */}
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          style={{ animation: "fadeSlideUp 0.4s ease both", animationDelay: "360ms" }}
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Smart Observations</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Personalised insights from your data</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {observations.map(({ icon: Icon, bg, iconColor, title, sub }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors duration-150"
                style={{ animation: "fadeSlideUp 0.35s ease both", animationDelay: `${400 + i * 60}ms` }}
              >
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={15} strokeWidth={2} className={iconColor} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}