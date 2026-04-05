import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

const iconMap = {
  balance:  { icon: Wallet,      bg: "bg-indigo-50 dark:bg-indigo-950", color: "text-indigo-600 dark:text-indigo-400" },
  income:   { icon: TrendingUp,  bg: "bg-emerald-50 dark:bg-emerald-950", color: "text-emerald-600 dark:text-emerald-400" },
  expenses: { icon: TrendingDown, bg: "bg-rose-50 dark:bg-rose-950",    color: "text-rose-500 dark:text-rose-400" },
}

export default function SummaryCard({ title, amount, variant = "balance", sub, index = 0 }) {
  const { icon: Icon, bg, color } = iconMap[variant] || iconMap.balance

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-300"
      style={{ animation: `fadeSlideUp 0.4s ease both`, animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={16} strokeWidth={2} className={color} />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        ${amount?.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
    </div>
  )
}