import { useState } from "react"
import { useApp } from "../context/AppContext"
import { Plus, Search, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2, X } from "lucide-react"

const CATEGORIES = ["Food", "Housing", "Entertainment", "Utilities", "Health", "Transport", "Shopping", "Income"]
const emptyForm  = { description: "", amount: "", category: "Food", type: "expense", date: "" }

const styleTag = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }
`

const inputCls = `
  w-full px-4 py-2.5 rounded-xl
  border border-gray-200 dark:border-gray-700
  bg-gray-50 dark:bg-gray-800
  text-sm text-gray-700 dark:text-gray-200
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400
  transition-all
`

export default function Transactions() {
  const { filteredTransactions, filters, setFilters, role, addTransaction, editTransaction, deleteTransaction } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })

  const sorted = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === "amount") return sortConfig.direction === "asc" ? a.amount - b.amount : b.amount - a.amount
    if (sortConfig.key === "date")   return sortConfig.direction === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    return 0
  })

  const handleSort = (key) =>
    setSortConfig(prev => prev.key === key
      ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
      : { key, direction: "desc" })

  const SortIcon = ({ col }) => {
    if (sortConfig.key !== col) return <ChevronsUpDown size={13} className="ml-1 text-gray-300 dark:text-gray-600" />
    return sortConfig.direction === "asc"
      ? <ChevronUp   size={13} className="ml-1 text-indigo-500" />
      : <ChevronDown size={13} className="ml-1 text-indigo-500" />
  }

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (t) => {
    setEditingId(t.id)
    setForm({ description: t.description, amount: t.amount, category: t.category, type: t.type, date: t.date })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.description || !form.amount || !form.date) return
    if (editingId) editTransaction(editingId, { ...form, amount: parseFloat(form.amount) })
    else           addTransaction({ ...form, amount: parseFloat(form.amount) })
    setShowModal(false); setForm(emptyForm)
  }

  return (
    <>
      <style>{styleTag}</style>
      <div className="space-y-5">

        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ animation: "fadeSlideUp 0.35s ease both" }}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{filteredTransactions.length} transactions found</p>
          </div>
          {role === "admin" && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium rounded-xl transition-all duration-150 shadow-sm shadow-indigo-200 dark:shadow-none"
            >
              <Plus size={15} strokeWidth={2.5} />
              Add Transaction
            </button>
          )}
        </div>

        {/* Filters */}
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
          style={{ animation: "fadeSlideUp 0.4s ease both", animationDelay: "60ms" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search transactions…"
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className={`${inputCls} pl-9`}
              />
            </div>
            <select value={filters.type} onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))} className={inputCls}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={filters.category} onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))} className={inputCls}>
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          style={{ animation: "fadeSlideUp 0.4s ease both", animationDelay: "120ms" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {[
                    { label: "Description", key: null },
                    { label: "Date",        key: "date" },
                    { label: "Category",    key: null },
                    { label: "Type",        key: null },
                    { label: "Amount",      key: "amount" },
                    ...(role === "admin" ? [{ label: "Actions", key: null }] : []),
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      onClick={key ? () => handleSort(key) : undefined}
                      className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 select-none ${key ? "cursor-pointer hover:text-indigo-500 transition-colors" : ""}`}
                    >
                      <span className="inline-flex items-center">
                        {label}
                        {key && <SortIcon col={key} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/80">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-sm text-gray-400 dark:text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : sorted.map((t, i) => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors duration-150"
                    style={{ animation: "fadeSlideUp 0.3s ease both", animationDelay: `${140 + i * 30}ms` }}
                  >
                    <td className="px-6 py-3.5 font-medium text-gray-800 dark:text-gray-100">{t.description}</td>
                    <td className="px-6 py-3.5 text-gray-400 dark:text-gray-500 tabular-nums">{t.date}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        t.type === "income"
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-6 py-3.5 font-semibold tabular-nums ${
                      t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                    }`}>
                      {t.type === "income" ? "+" : "−"}${t.amount.toLocaleString()}
                    </td>
                    {role === "admin" && (
                      <td className="px-6 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEdit(t)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors">
                            <Pencil size={13} strokeWidth={2} />
                          </button>
                          <button onClick={() => deleteTransaction(t.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
                            <Trash2 size={13} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            style={{ animation: "fadeIn 0.2s ease both" }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 shadow-2xl"
              style={{ animation: "scaleIn 0.22s ease both" }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    {editingId ? "Edit Transaction" : "New Transaction"}
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {editingId ? "Update the transaction details below" : "Fill in the details to add a transaction"}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Description</label>
                  <input type="text" placeholder="e.g. Grocery run" value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Amount</label>
                    <input type="number" placeholder="0.00" value={form.amount}
                      onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Date</label>
                    <input type="date" value={form.date}
                      onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["expense", "income"].map(opt => (
                      <button key={opt} type="button"
                        onClick={() => setForm(p => ({ ...p, type: opt }))}
                        className={`py-2 rounded-xl text-sm font-medium border transition-all duration-150 capitalize ${
                          form.type === opt
                            ? opt === "income"
                              ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                              : "bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-5 flex gap-3">
                <button onClick={handleSubmit}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium rounded-xl transition-all duration-150">
                  {editingId ? "Save Changes" : "Add Transaction"}
                </button>
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}