import { createContext, useContext, useState, useEffect } from "react"
import { transactions as initialTransactions } from "../data/mockData"

const AppContext = createContext()

export function AppProvider({ children }) {

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions")
    return saved ? JSON.parse(saved) : initialTransactions
  })

  const [role, setRole] = useState("viewer")

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
  })

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now() }])
  }

  const editTransaction = (id, updated) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t))
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const filteredTransactions = transactions.filter(t => {
    const matchSearch   = t.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchType     = filters.type === "all" || t.type === filters.type
    const matchCategory = filters.category === "all" || t.category === filters.category
    return matchSearch && matchType && matchCategory
  })

  const totalIncome   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const totalBalance  = totalIncome - totalExpenses

  return (
    <AppContext.Provider value={{
      transactions,
      filteredTransactions,
      role, setRole,
      filters, setFilters,
      addTransaction,
      editTransaction,
      deleteTransaction,
      totalIncome,
      totalExpenses,
      totalBalance,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}