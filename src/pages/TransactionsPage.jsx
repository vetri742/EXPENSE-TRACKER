import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useTransactions } from "../context/transactioncontext";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import { formatCurrency } from "../constants/categories";
import {
  Receipt,
  PlusCircle,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Sparkles,
} from "lucide-react";

export default function TransactionsPage(props) {
  const { transactions } = useTransactions();
  const outlet = useOutletContext();
  const handleOpenAddModal = props.onOpenAddModal || outlet?.onOpenAddModal;
  const [showInlineAdd, setShowInlineAdd] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-800/80 via-slate-800/60 to-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Receipt className="h-3.5 w-3.5" />
              <span>Financial Ledger & History</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Transactions & Records
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Review, filter, categorize, and export all credit and debit entries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
              <span>Back to Dashboard</span>
            </Link>

            <button
              onClick={() => {
                if (handleOpenAddModal) {
                  handleOpenAddModal();
                } else {
                  setShowInlineAdd((prev) => !prev);
                }
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-600 hover:to-indigo-700 active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Record Transaction</span>
            </button>
          </div>
        </div>

        {/* Quick Ledger Stats Strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-700/50 pt-5 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Total Transactions</span>
              <Sparkles className="h-3 w-3 text-indigo-400" />
            </div>
            <div className="mt-1 text-lg font-bold text-white">
              {transactions.length}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Total Credits</span>
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="mt-1 text-lg font-bold text-emerald-400">
              {formatCurrency(totalIncome)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Total Debits</span>
              <ArrowDownRight className="h-3 w-3 text-rose-400" />
            </div>
            <div className="mt-1 text-lg font-bold text-rose-400">
              {formatCurrency(totalExpense)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Net Ledger</span>
              <Wallet className="h-3 w-3 text-indigo-400" />
            </div>
            <div
              className={`mt-1 text-lg font-bold ${
                netBalance >= 0 ? "text-slate-100" : "text-rose-400"
              }`}
            >
              {formatCurrency(netBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Optional Inline Add Form Accordion */}
      {showInlineAdd && (
        <div className="animate-in fade-in duration-200">
          <TransactionForm onClose={() => setShowInlineAdd(false)} />
        </div>
      )}

      {/* Complete Transaction History Table & Filters */}
      <section aria-label="Transaction History Ledger">
        <TransactionList onEditClick={handleOpenAddModal} />
      </section>
    </div>
  );
}
