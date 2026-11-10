import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  Edit3,
  Trash2,
  Download,
  AlertCircle,
  Tag,
  RotateCcw,
} from "lucide-react";
import { useTransactions } from "../context/transactioncontext";
import { formatCurrency, getCategoryMeta, CATEGORIES } from "../constants/categories";

export default function TransactionList({ onEditClick }) {
  const { transactions, deleteTransaction, editTransactions } = useTransactions();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectMonth, setSelectMonth] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "expense" | "income"
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Dynamic unique months from transactions
  const uniqueMonths = useMemo(() => {
    const months = [
      ...new Set(
        transactions
          .map((item) => (item.date ? item.date.slice(0, 7) : ""))
          .filter(Boolean)
      ),
    ].sort().reverse();
    return months;
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((item) => {
        if (selectMonth === "all") return true;
        return item.date && item.date.slice(0, 7) === selectMonth;
      })
      .filter((item) => {
        if (typeFilter === "all") return true;
        return item.type === typeFilter;
      })
      .filter((item) => {
        if (category === "all" || category === "") return true;
        return (item.category || "").toLowerCase() === category.toLowerCase();
      })
      .filter((item) => {
        if (!search.trim()) return true;
        return (item.description || "")
          .toLowerCase()
          .includes(search.toLowerCase().trim());
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [transactions, selectMonth, typeFilter, category, search]);

  const handleEdit = (transaction) => {
    editTransactions(transaction);
    if (onEditClick) {
      onEditClick(transaction);
    }
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ["ID", "Date", "Description", "Type", "Category", "Amount (INR)"];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      `"${(t.description || "").replace(/"/g, '""')}"`,
      t.type,
      t.category,
      t.amount,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SpendPulse_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSelectMonth("all");
    setTypeFilter("all");
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-700/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 sm:text-lg">
              Transaction History
            </h2>
            <p className="text-xs text-slate-400">
              Showing {filteredTransactions.length} of {transactions.length} total entries
            </p>
          </div>
        </div>

        {/* Export CSV button */}
        <button
          onClick={handleExportCSV}
          disabled={filteredTransactions.length === 0}
          className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-700/50 hover:text-white disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        {/* Search Input */}
        <div className="relative sm:col-span-2 lg:col-span-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/70 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Type Toggle Pills */}
        <div className="flex rounded-xl bg-slate-900/60 p-1 border border-slate-700/60 sm:col-span-1 lg:col-span-3">
          <button
            onClick={() => setTypeFilter("all")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              typeFilter === "all"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter("expense")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              typeFilter === "expense"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setTypeFilter("income")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              typeFilter === "income"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Income
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="relative sm:col-span-1 lg:col-span-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900/70 px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="all">All Categories</option>
            {Object.values(CATEGORIES).map((c) => (
              <option value={c.id} key={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <Filter className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Month Dropdown */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <select
            value={selectMonth}
            onChange={(e) => setSelectMonth(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900/70 px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="all">All Months</option>
            {uniqueMonths.map((m) => {
              const [y, mo] = m.split("-");
              const dateObj = new Date(parseInt(y, 10), parseInt(mo, 10) - 1, 1);
              const label = dateObj.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
              return (
                <option value={m} key={m}>
                  {label}
                </option>
              );
            })}
          </select>
          <Calendar className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Transactions List */}
      <div className="mt-5 space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/80 py-12 text-center">
            <AlertCircle className="h-10 w-10 text-slate-500 mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              No matching transactions found
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Try adjusting your search criteria, selecting another month, or record a new transaction.
            </p>
            {(search || category !== "all" || selectMonth !== "all" || typeFilter !== "all") && (
              <button
                onClick={resetFilters}
                className="mt-4 flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const meta = getCategoryMeta(t.category);
            const Icon = meta.icon;
            const isIncome = t.type === "income";

            return (
              <div
                key={t.id}
                className="group flex flex-col gap-3 rounded-xl border border-slate-700/50 bg-slate-900/40 p-3.5 transition-all duration-200 hover:border-slate-600 hover:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Category Icon + Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${meta.bgClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-100 truncate">
                        {t.description}
                      </p>
                      <span
                        className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          isIncome
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {isIncome ? "Income" : "Expense"}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{t.date}</span>
                      <span>•</span>
                      <span className="capitalize">{meta.label}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t border-slate-800/60 pt-2 sm:border-0 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span
                      className={`text-sm sm:text-base font-extrabold tracking-tight ${
                        isIncome ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {formatCurrency(t.amount)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(t)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-slate-400 transition hover:border-indigo-500 hover:text-indigo-400"
                      title="Edit Transaction"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {deleteConfirmId === t.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="rounded-lg bg-rose-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-rose-500 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg bg-slate-700 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(t.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-slate-400 transition hover:border-rose-500 hover:text-rose-400"
                        title="Delete Transaction"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
