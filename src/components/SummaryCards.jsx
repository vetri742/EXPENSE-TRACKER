import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  PiggyBank,
} from "lucide-react";
import { useTransactions } from "../context/transactioncontext";
import { formatCurrency } from "../constants/categories";

export default function SummaryCards() {
  const { transactions } = useTransactions();

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, curr) => total + Number(curr.amount || 0), 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, curr) => total + Number(curr.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Net Balance Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-indigo-500/10">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl transition group-hover:bg-indigo-500/20" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Net Balance
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-sm transition group-hover:scale-105">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
              netBalance >= 0 ? "text-slate-100" : "text-rose-400"
            }`}
          >
            {formatCurrency(netBalance)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span
              className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-medium ${
                netBalance >= 0
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {netBalance >= 0 ? "+ Positive Surplus" : "Overdrawn Deficit"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Income Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-emerald-500/10">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition group-hover:bg-emerald-500/20" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Inflow / Income
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm transition group-hover:scale-105">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold tracking-tight text-emerald-400 sm:text-3xl">
            {formatCurrency(totalIncome)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {transactions.filter((i) => i.type === "income").length} credit transactions
            </span>
          </div>
        </div>
      </div>

      {/* 3. Total Expense Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-rose-500/10">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl transition group-hover:bg-rose-500/20" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Outflow / Expenses
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-sm transition group-hover:scale-105">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold tracking-tight text-rose-400 sm:text-3xl">
            {formatCurrency(totalExpense)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 font-medium text-rose-400">
              {transactions.filter((i) => i.type === "expense").length} debit transactions
            </span>
          </div>
        </div>
      </div>

      {/* 4. Savings Rate Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-sky-500/10">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl transition group-hover:bg-sky-500/20" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Savings Efficiency
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-sm transition group-hover:scale-105">
            <PiggyBank className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold tracking-tight text-sky-400 sm:text-3xl">
            {savingsRate}%
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <div className="h-1.5 flex-1 rounded-full bg-slate-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  savingsRate >= 30
                    ? "bg-emerald-500"
                    : savingsRate > 0
                    ? "bg-sky-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-slate-300">
              {savingsRate >= 30 ? "Optimal" : savingsRate > 0 ? "Moderate" : "Tight"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
