import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { initialTransactions } from "../data/mockData.js";

const STORAGE_KEY = "finance-dashboard-react-js-v1";

export function formatMoney(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const FinanceContext = createContext(null);

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.transactions?.length) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function FinanceProvider({ children }) {
  const persisted = typeof window !== "undefined" ? loadPersisted() : null;

  const [role, setRole] = useState(persisted?.role ?? "viewer");
  const [darkMode, setDarkMode] = useState(persisted?.darkMode ?? false);
  const [transactions, setTransactions] = useState(
    persisted?.transactions ?? initialTransactions
  );
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ transactions, role, darkMode })
      );
    } catch {
      /* ignore */
    }
  }, [transactions, role, darkMode]);

  const addTransaction = useCallback((row) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `t-${Date.now()}`;
    setTransactions((prev) => [{ ...row, id }, ...prev]);
  }, []);

  const updateTransaction = useCallback((id, row) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...row } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const categories = useMemo(() => {
    const s = new Set(transactions.map((t) => t.category));
    return ["all", ...Array.from(s).sort()];
  }, [transactions]);

  const filteredSorted = useMemo(() => {
    let list = [...transactions];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q)
      );
    }

    if (filterCategory !== "all") {
      list = list.filter((t) => t.category === filterCategory);
    }

    if (filterType !== "all") {
      list = list.filter((t) => t.type === filterType);
    }

    const byDate = (a, b) => a.date.localeCompare(b.date);
    const byAmount = (a, b) => a.amount - b.amount;

    switch (sortBy) {
      case "date-asc":
        list.sort(byDate);
        break;
      case "date-desc":
        list.sort((a, b) => -byDate(a, b));
        break;
      case "amount-asc":
        list.sort(byAmount);
        break;
      case "amount-desc":
        list.sort((a, b) => -byAmount(a, b));
        break;
      default:
        break;
    }

    return list;
  }, [transactions, search, filterCategory, filterType, sortBy]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  const monthlyTrend = useMemo(() => {
    const map = new Map();
    for (const t of transactions) {
      const key = t.date.slice(0, 7);
      const prev = map.get(key) ?? { income: 0, expense: 0 };
      if (t.type === "income") prev.income += t.amount;
      else prev.expense += t.amount;
      map.set(key, prev);
    }
    const keys = Array.from(map.keys()).sort();
    const last6 = keys.slice(-6);
    let running = 0;
    return last6.map((month) => {
      const { income, expense } = map.get(month);
      const net = income - expense;
      running += net;
      return { month, net, balance: running };
    });
  }, [transactions]);

  const spendingByCategory = useMemo(() => {
    const cat = {};
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      cat[t.category] = (cat[t.category] || 0) + t.amount;
    }
    const entries = Object.entries(cat).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    return { entries, total };
  }, [transactions]);

  const insights = useMemo(() => {
    const { entries, total } = spendingByCategory;
    const top = entries[0];

    const monthKey = (d) => d.slice(0, 7);
    const now = new Date();
    const thisM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastM = `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}`;

    let thisExp = 0;
    let lastExp = 0;
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      const m = monthKey(t.date);
      if (m === thisM) thisExp += t.amount;
      if (m === lastM) lastExp += t.amount;
    }

    const diff =
      lastExp === 0 ? null : ((thisExp - lastExp) / lastExp) * 100;

    const lines = [];
    if (top) {
      lines.push(
        `Highest spending category: ${top[0]} (${formatMoney(top[1])} total).`
      );
    } else {
      lines.push(
        "No expense data yet — add expenses to see category insights."
      );
    }

    if (lastExp > 0) {
      const dir =
        diff > 0 ? "higher" : diff < 0 ? "lower" : "the same as";
      lines.push(
        `This month vs last month expenses: ${formatMoney(thisExp)} vs ${formatMoney(lastExp)} (${dir} last month${
          diff !== null && diff !== 0
            ? `, about ${Math.abs(diff).toFixed(0)}%`
            : ""
        }).`
      );
    } else {
      lines.push(
        "Monthly comparison: not enough history for last month — keep logging transactions."
      );
    }

    if (total > 0 && totals.balance < 0) {
      lines.push(
        "Observation: total expenses exceed income in the current dataset — review large categories."
      );
    } else if (totals.balance >= 0) {
      lines.push(
        "Observation: you are net positive overall in the current dataset."
      );
    }

    return lines;
  }, [transactions, spendingByCategory, totals.balance]);

  const value = {
    role,
    setRole,
    isAdmin: role === "admin",
    darkMode,
    setDarkMode,
    transactions,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    categories,
    filteredSorted,
    totals,
    monthlyTrend,
    spendingByCategory,
    insights,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
