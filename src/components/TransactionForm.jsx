import {
  PlusCircle,
  Save,
  X,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useTransactions } from "../context/transactioncontext";
import { CATEGORIES } from "../constants/categories";

export default function TransactionForm({ onClose }) {
  const {
    addTransactions,
    newtransaction,
    setNewtransaction,
    isupdate,
    cancelEdit,
    getdate,
  } = useTransactions();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewtransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (newType) => {
    setNewtransaction((prev) => {
      // Default category for that type
      let defaultCat = prev.category;
      if (newType === "income") {
        if (!["salary", "freelance", "investments", "others"].includes(defaultCat)) {
          defaultCat = "salary";
        }
      } else {
        if (!["food", "housing", "transportation", "entertainment", "shopping", "health", "others"].includes(defaultCat)) {
          defaultCat = "food";
        }
      }
      return {
        ...prev,
        type: newType,
        category: defaultCat,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newtransaction.description.trim()) {
      alert("Please provide a description");
      return;
    }

    if (!newtransaction.amount || Number(newtransaction.amount) <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    const payload = {
      id: newtransaction.id || Date.now(),
      description: newtransaction.description.trim(),
      amount: Number(newtransaction.amount),
      type: newtransaction.type || "expense",
      date: newtransaction.date || getdate(),
      category: newtransaction.category || (newtransaction.type === "income" ? "salary" : "food"),
    };

    addTransactions(payload);

    if (onClose) {
      onClose();
    }
  };

  // Filter available categories based on current transaction type
  const availableCategories = Object.values(CATEGORIES).filter((cat) => {
    if (newtransaction.type === "income") {
      return cat.type === "income" || cat.type === "both";
    }
    return cat.type === "expense" || cat.type === "both";
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-xl backdrop-blur-md">
      {/* Decorative gradient glow */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-20 ${
          newtransaction.type === "income" ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              isupdate
                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                : newtransaction.type === "income"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/30 bg-rose-500/10 text-rose-400"
            }`}
          >
            {isupdate ? (
              <Save className="h-4 w-4" />
            ) : newtransaction.type === "income" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 sm:text-base">
              {isupdate ? "Edit Transaction" : "Record New Transaction"}
            </h3>
            <p className="text-xs text-slate-400">
              {isupdate
                ? "Update transaction details below"
                : "Quickly track credits or debits in seconds"}
            </p>
          </div>
        </div>

        {isupdate && (
          <button
            type="button"
            onClick={cancelEdit}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <X className="h-3.5 w-3.5" />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Segmented Type Toggle (Expense vs Income) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900/60 p-1 border border-slate-700/60">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                newtransaction.type === "expense"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-md shadow-rose-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>Expense / Debit</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                newtransaction.type === "income"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Income / Credit</span>
            </button>
          </div>
        </div>

        {/* Amount & Date in 2 columns */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                name="amount"
                placeholder="0.00"
                value={newtransaction.amount}
                onChange={handleInput}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 pl-8 pr-4 py-2.5 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Transaction Date
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                required
                name="date"
                value={newtransaction.date || getdate()}
                onChange={handleInput}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Description / Payee
          </label>
          <div className="relative">
            <FileText className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              name="description"
              placeholder="e.g. Organic Groceries, Consulting Fee, etc."
              value={newtransaction.description}
              onChange={handleInput}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Visual Category Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Select Category
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {availableCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected =
                (newtransaction.category || "").toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setNewtransaction((prev) => ({ ...prev, category: cat.id }))
                  }
                  className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/20 text-white shadow-sm ring-1 ring-indigo-500/40"
                      : "border-slate-700/60 bg-slate-900/40 text-slate-300 hover:border-slate-600 hover:bg-slate-900/80"
                  }`}
                >
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs"
                    style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate text-xs font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition active:scale-[0.98] ${
              isupdate
                ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
                : newtransaction.type === "income"
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
            }`}
          >
            {isupdate ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            <span>{isupdate ? "Save Changes" : "Record Transaction"}</span>
          </button>

          {isupdate && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 transition hover:bg-slate-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
