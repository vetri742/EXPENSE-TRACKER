import { useState } from "react";
import {
  Target,
  Edit3,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { useTransactions } from "../context/transactioncontext";
import { formatCurrency, getCategoryMeta } from "../constants/categories";

export default function BudgetTracker() {
  const { transactions, budgets, updateBudget } = useTransactions();
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempLimit, setTempLimit] = useState("");

  // Get total expenses for a specific category
  const getCategorySpent = (categoryKey) => {
    return transactions
      .filter((item) => item.type === "expense" && (item.category || "").toLowerCase() === categoryKey.toLowerCase())
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  const handleEditClick = (categoryKey, currentLimit) => {
    setEditingCategory(categoryKey);
    setTempLimit(String(currentLimit));
  };

  const handleSave = (categoryKey) => {
    if (tempLimit !== "" && !isNaN(tempLimit) && Number(tempLimit) >= 0) {
      updateBudget(categoryKey, tempLimit);
    }
    setEditingCategory(null);
  };

  const handleKeyDown = (e, categoryKey) => {
    if (e.key === "Enter") {
      handleSave(categoryKey);
    } else if (e.key === "Escape") {
      setEditingCategory(null);
    }
  };

  // Overall totals across defined budget categories
  const categoryKeys = Object.keys(budgets);
  const totalBudgetCap = categoryKeys.reduce((sum, key) => sum + Number(budgets[key] || 0), 0);
  const totalSpentInBudgets = categoryKeys.reduce((sum, key) => sum + getCategorySpent(key), 0);
  const overallPercent =
    totalBudgetCap > 0 ? Math.min(Math.round((totalSpentInBudgets / totalBudgetCap) * 100), 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-xl backdrop-blur-md">
      {/* Header & Global Progress */}
      <div className="flex flex-col gap-4 border-b border-slate-700/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-sm">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 sm:text-lg">
              Category Budget Caps & Thresholds
            </h2>
            <p className="text-xs text-slate-400">
              Set monthly spending ceilings to keep your financial health optimal
            </p>
          </div>
        </div>

        {/* Global overview pill */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-2.5">
          <div className="text-left">
            <div className="text-[11px] font-medium text-slate-400">Total Allocated</div>
            <div className="text-xs font-bold text-slate-200">
              {formatCurrency(totalSpentInBudgets)} / {formatCurrency(totalBudgetCap)}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-700/80" />
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-400">Capacity</div>
            <div
              className={`text-xs font-extrabold ${
                totalSpentInBudgets > totalBudgetCap
                  ? "text-rose-400"
                  : overallPercent >= 80
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {totalSpentInBudgets > totalBudgetCap ? "100% crossed" : `${overallPercent}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Category Budget Items Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {categoryKeys.map((catKey) => {
          const limit = Number(budgets[catKey]) || 0;
          const spent = getCategorySpent(catKey);
          const isOverBudget = spent > limit;
          const rawPercent = limit > 0 ? (spent / limit) * 100 : 0;
          const clampedPercent = Math.min(Math.round(rawPercent), 100);
          const meta = getCategoryMeta(catKey);
          const Icon = meta.icon;

          // Color calculation
          let progressColor = "bg-emerald-500";
          let badgeStatus = {
            text: "On Track",
            class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          };

          if (isOverBudget) {
            progressColor = "bg-rose-500 shadow-sm shadow-rose-500/50";
            badgeStatus = {
              text: "Exceeded",
              class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            };
          } else if (rawPercent >= 80) {
            progressColor = "bg-amber-500";
            badgeStatus = {
              text: "Warning",
              class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            };
          }

          return (
            <div
              key={catKey}
              className={`group relative overflow-hidden rounded-xl border p-4.5 transition-all duration-300 ${
                isOverBudget
                  ? "border-rose-500/40 bg-rose-500/[0.04] shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/30"
                  : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60"
              }`}
            >
              {/* Category Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${meta.bgClass}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100 capitalize">
                      {meta.label}
                    </h3>
                    <div className="text-[11px] text-slate-400">
                      Spent {formatCurrency(spent)} of {formatCurrency(limit)}
                    </div>
                  </div>
                </div>

                {/* Inline Edit or Display */}
                {editingCategory === catKey ? (
                  <div className="flex items-center gap-1.5 animate-in fade-in">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        autoFocus
                        value={tempLimit}
                        onChange={(e) => setTempLimit(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, catKey)}
                        className="w-24 rounded-lg border border-indigo-500 bg-slate-900 pl-5 pr-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Limit"
                      />
                    </div>
                    <button
                      onClick={() => handleSave(catKey)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition"
                      title="Save"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
                      title="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeStatus.class}`}
                    >
                      {badgeStatus.text}
                    </span>
                    <button
                      onClick={() => handleEditClick(catKey, limit)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800 text-slate-400 transition hover:border-slate-500 hover:text-slate-100 active:scale-95"
                      title="Edit Budget Cap"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`text-[11px] font-medium ${isOverBudget ? "text-rose-400 font-semibold" : "text-slate-400"}`}>
                    {isOverBudget ? "100% crossed" : `${clampedPercent}% consumed`}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {limit >= spent
                      ? `${formatCurrency(limit - spent)} left`
                      : `${formatCurrency(spent - limit)} over`}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700/40">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
                    style={{ width: `${clampedPercent}%` }}
                  />
                </div>
              </div>

              {/* Over-budget glowing alert banner */}
              {isOverBudget && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 animate-pulse">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>
                    ⚠️ Budget Exceeded by {formatCurrency(spent - limit)}!
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
